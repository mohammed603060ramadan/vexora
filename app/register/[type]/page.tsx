import { notFound } from "next/navigation";
import RegistrationForm from "../RegistrationForm";

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (type !== "client" && type !== "student") notFound();
  return <RegistrationForm kind={type} />;
}
