import { Suspense } from "react";
import { notFound } from "next/navigation";
import RegistrationForm from "../RegistrationForm";

type RegistrationPageProps = {
  params: Promise<{ type: string }>;
};

async function RegistrationPageContent({ params }: RegistrationPageProps) {
  const { type } = await params;

  if (type !== "client" && type !== "student") {
    notFound();
  }

  return <RegistrationForm kind={type} />;
}

function RegistrationPageFallback() {
  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-16 text-slate-200">
      <div className="mx-auto max-w-3xl animate-pulse rounded-3xl border border-white/10 bg-[#0c111b] p-8">
        <div className="h-7 w-56 rounded bg-white/10" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-white/[0.06]" />
        <div className="mt-2 h-4 w-3/4 rounded bg-white/[0.06]" />
        <div className="mt-8 space-y-4">
          <div className="h-11 rounded-xl bg-white/[0.06]" />
          <div className="h-11 rounded-xl bg-white/[0.06]" />
          <div className="h-11 rounded-xl bg-white/[0.06]" />
        </div>
      </div>
    </main>
  );
}

export default function RegistrationPage({ params }: RegistrationPageProps) {
  return (
    <Suspense fallback={<RegistrationPageFallback />}>
      <RegistrationPageContent params={params} />
    </Suspense>
  );
}
