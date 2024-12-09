// app/page.tsx
import AnimatedPatientForm from "@/components/forms/animated-patient-form";
import PasskeyModel from "@/components/passkey-model";
import { SearchParamProps } from "@/types";
import { initialRegistrationQuestions } from "@/types/user-form-questions";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const isAdmin = (await searchParams).admin === "true";

  return (
    <div className="min-h-screen relative">
      {isAdmin && <PasskeyModel />}

      {/* Main content container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <section className="w-full max-w-lg h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4">
            <AnimatedPatientForm questions={initialRegistrationQuestions} />
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm">
        <p className="text-gray-600">℗ 2024 CarePusle</p>
        <Link
          href="/?admin=true"
          className="text-green-500 hover:text-green-600"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
