"use client";

import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../status-badge";
import { findDoctor, formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../appointment-model";
import { AppointmentTableData } from "@/types";
import ErrorBoundary from "../error-boundary";

export const columns: ColumnDef<AppointmentTableData>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14--medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patient.user.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.startTime).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "doctorId",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = findDoctor(row.original.doctorId);
      // console.log(doctor?.name);
      if (!doctor) {
        console.log(
          `Could not find doctor with identifier: ${row.original.doctorId}`
        );
        return <div>Invalid doctor information</div>;
      }
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image}
            alt={doctor?.image}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: appointment } }) => {
      try {
        return (
          <div className="flex gap-1">
            <ErrorBoundary>
              <AppointmentModal
                type="schedule"
                patientId={appointment.patientId}
                userId={appointment.patient.user.id}
                appointment={appointment}
                title="Schedule Appointment"
                description="Please confirm the following details to schedule"
              />
              <AppointmentModal
                type="cancel"
                patientId={appointment.patientId}
                userId={appointment.patient.user.id}
                appointment={appointment}
                title="Cancel Appointment"
                description="Are you sure you want to cancel this appointment?"
              />
            </ErrorBoundary>
          </div>
        );
      } catch (error) {
        console.error('Error rendering appointment actions:', error);
        return <div>Error loading actions</div>;
      }
    },
  },
];
