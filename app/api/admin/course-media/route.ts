import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "course-media";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const admin = createAdminClient();
  let isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) {
    const { data: registry, error } = await admin.from("vexora_admins").select("user_id").eq("user_id", user.id).maybeSingle();
    if (error) return NextResponse.json({ error: "Could not verify administrator permissions." }, { status: 500 });
    isAdmin = Boolean(registry);
  }
  if (!isAdmin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  let formData: FormData;
  try { formData = await request.formData(); } catch { return NextResponse.json({ error: "Invalid upload form." }, { status: 400 }); }
  const file = formData.get("file");
  const kind = formData.get("kind");
  if (!(file instanceof File) || (kind !== "image" && kind !== "video")) {
    return NextResponse.json({ error: "Choose an image or video file." }, { status: 400 });
  }
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  const videoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
  const allowed = kind === "image" ? imageTypes : videoTypes;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (!allowed.includes(file.type) || file.size <= 0 || file.size > maxBytes) {
    return NextResponse.json({ error: kind === "image" ? "Use JPG, PNG, WebP, AVIF or GIF up to 15 MB." : "Use MP4, WebM, MOV or OGG up to 50 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || (kind === "image" ? "jpg" : "mp4");
  const path = `${kind}/${user.id}/${crypto.randomUUID()}.${extension}`;
  const { data: bucket } = await admin.storage.getBucket(BUCKET);
  if (!bucket) {
    const { error: createError } = await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_VIDEO_BYTES,
      allowedMimeTypes: [...imageTypes, ...videoTypes],
    });
    if (createError && !/already exists/i.test(createError.message)) {
      console.error("Course media bucket setup failed:", createError.message);
      return NextResponse.json({ error: "Could not prepare course media storage. Check Supabase Storage permissions." }, { status: 500 });
    }
  }

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) {
    console.error("Course media upload failed:", uploadError.message);
    return NextResponse.json({ error: "Upload failed. Check the course-media bucket configuration." }, { status: 500 });
  }
  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: publicUrl, path, kind }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
