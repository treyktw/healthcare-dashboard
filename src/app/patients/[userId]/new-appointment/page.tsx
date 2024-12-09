// app/patients/[userId]/new-appointment/page.tsx
import AnimatedAppointmentForm from "@/components/forms/animated-new-appointment-form";
import { getPatient } from "@/lib/actions/patient.actions";
import { PageParams } from "@/types";
import { appointmentQuestions } from "@/types/appointment-questions";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function NewAppointment({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { userId } = await params;

  try {
    const patient = await getPatient(userId);

    if (!patient) {
      return notFound();
    }

    return (
      <div className="flex h-screen flex-col md:flex-row">
        <section className="flex items-center flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto flex size-full flex-col flex-1">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="Logo"
              width={1000}
              height={1000}
              className="h-10 w-auto"
            />
            <AnimatedAppointmentForm
              questions={appointmentQuestions}
              userId={userId}
              patientId={patient.id}
            />
          </div>
        </section>

        <div className="hidden w-full md:block md:w-2/5 lg:w-1/2">
          <Image
            src="/assets/images/appointment-img.png"
            alt="appointment"
            width={1000}
            height={1000}
            className="side-img object-cover"
            priority
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading patient:", error);
    return notFound();
  }
}