// app/patients/[userId]/register/page.tsx
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms-old/register-form";

const Register = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  try {
    const user = await getUser((await params).userId);

    async function seedDoctors() {
      "use server";
      try {
        const response = await fetch(
          `localhost:3000/api/seedDoctors`,
          {
            method: "POST",
          }
        );
        return response.json();
      } catch (error) {
        console.error("Error seeding doctors:", error);
      }
    }

    if (!user) {
      redirect("/register");
    }

    return (
      <div className="min-h-screen relative m-10 ">
        {/* Logo in top left */}
        {/* <div className="absolute top-8 left-8 z-10">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div> */}

        <button
          onClick={seedDoctors}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Seed Doctors
        </button>

        {/* Main content */}
        <div className="flex min-h-screen">
          {/* Form section */}
          <section className="flex-1">
            <RegisterForm user={user} />
          </section>

          {/* Image section */}
          <div className="hidden lg:block w-1/3 relative">
            <Image
              src="/assets/images/register-img.png"
              alt="Registration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
          </div>
        </div>

        {/* Copyright */}
        <div className="relative mt-4">
          <p className="text-sm text-gray-500">© 2024 CarePulse</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in Register page:", error);
    redirect("/register");
  }
};

export default Register;
