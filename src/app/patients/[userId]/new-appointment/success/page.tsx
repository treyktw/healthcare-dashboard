//patients/[userId]/new-appointment/success

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDateTime, findDoctor } from "@/lib/utils";
import { PageParams, SearchParams } from "@/types";
import { getUser } from "@/lib/actions/patient.actions";
import { getAppointment } from "@/lib/actions/prisma.actions";

const RequestSuccess = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<PageParams>;
}) => {
  const { appointmentId = "" } = await searchParams;
  const { userId } = await params;

  const appointment = await getAppointment(appointmentId);
  const user = await getUser(userId);

  if (!appointment || !user) {
    return <div>Invalid appointment or user information</div>;
  }

  // Get the doctor from the doctors constant using the appointment's doctorId
  const doctorConstant = findDoctor(appointment.doctor.id);

  if (!doctorConstant) {
    console.error(`Doctor not found in constants: ${appointment.doctor.id}`);
    return <div>Invalid doctor information</div>;
  }

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctorConstant.image}
              alt={`Dr. ${appointment.doctor.user.name}`}
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">
              Dr. {appointment.doctor.user.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.startTime).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${await userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
