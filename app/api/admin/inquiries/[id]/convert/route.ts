import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  const supabase = await createClient();
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (
    authError ||
    !authData.user ||
    authData.user.app_metadata?.role !== "admin"
  ) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { error: "Invalid inquiry ID." },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const { data: inquiry, error: inquiryError } = await admin
      .from("inquiries")
      .select("id, full_name, email, phone, company, message, notes, status")
      .eq("id", id)
      .maybeSingle();

    if (inquiryError) {
      console.error("Inquiry lookup failed:", inquiryError.message);
      return NextResponse.json(
        { error: "Could not load the inquiry." },
        { status: 500 },
      );
    }

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404 },
      );
    }

    const { data: existingClient, error: existingClientError } = await admin
      .from("clients")
      .select("id, name")
      .eq("source_inquiry_id", inquiry.id)
      .maybeSingle();

    if (existingClientError) {
      console.error("Existing client lookup failed:", existingClientError.message);
      return NextResponse.json(
        { error: "Could not verify the existing client." },
        { status: 500 },
      );
    }

    let client = existingClient;

    if (!client) {
      const notes = [
        inquiry.message ? `Inquiry details:\n${inquiry.message}` : "",
        inquiry.notes ? `Internal notes:\n${inquiry.notes}` : "",
      ].filter(Boolean).join("\n\n");

      const { data: createdClient, error: createClientError } = await admin
        .from("clients")
        .insert({
          name: inquiry.full_name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: inquiry.company,
          notes: notes || null,
          source_inquiry_id: inquiry.id,
        })
        .select("id, name")
        .single();

      if (createClientError) {
        if (createClientError.code === "23505") {
          const { data: duplicateClient, error: duplicateLookupError } = await admin
            .from("clients")
            .select("id, name")
            .eq("source_inquiry_id", inquiry.id)
            .maybeSingle();

          if (duplicateLookupError || !duplicateClient) {
            console.error("Duplicate client recovery failed:", duplicateLookupError?.message);
            return NextResponse.json(
              { error: "Could not complete the conversion." },
              { status: 500 },
            );
          }

          client = duplicateClient;
        } else {
          console.error("Client creation failed:", createClientError.message);
          return NextResponse.json(
            { error: "Could not create the client." },
            { status: 500 },
          );
        }
      } else {
        client = createdClient;
      }
    }

    if (inquiry.status !== "converted") {
      const { error: updateInquiryError } = await admin
        .from("inquiries")
        .update({ status: "converted" })
        .eq("id", inquiry.id);

      if (updateInquiryError) {
        console.error("Inquiry status update failed:", updateInquiryError.message);
        return NextResponse.json(
          {
            error:
              "The client exists, but the inquiry status could not be updated. Retry the conversion to finish.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      client,
      message: existingClient
        ? "This inquiry was already linked to a client."
        : "Inquiry converted to client successfully.",
    });
  } catch (error) {
    console.error("Inquiry conversion failed:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
