"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import {
  AppointmentFormSchema,
  AppointmentFormValues,
  FormFieldTypes,
} from "@/types/form.types";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/prisma.actions";
import { Doctors } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Appointment } from "@prisma/client";
import CustomFormField from "./custom-form-field";
import SubmitButton from "./submit-button";

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment | null; // Made optional
  setOpen?: (open: boolean) => void;
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment = null,
  setOpen,
}: AppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      primaryPhysician: appointment?.doctorId || "",
      schedule: appointment?.date ? new Date(appointment.date) : new Date(),
      reason: appointment?.reason || "",
      note: appointment?.notes || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // Log initial values for debugging
  useEffect(() => {
    console.log("Initial form values:", {
      doctorId: appointment?.doctorId,
      formValue: form.getValues("primaryPhysician"),
    });
  }, [appointment?.doctorId, form]);

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setIsLoading(true);

      if (type === "create") {
        const appointmentData = {
          userId,
          patientId,
          doctorId: values.primaryPhysician,
          date: values.schedule,
          status: "pending" as const,
          type: "regular",
          reason: values.reason || null,
          notes: values.note || null,
        };

        const result = await createAppointment(appointmentData);

        if (result?.id) {
          toast({
            title: "Success",
            description: "Appointment created successfully",
          });
          form.reset();
          setOpen?.(false);
          router.refresh();
        }
      } else if (appointment && (type === "schedule" || type === "cancel")) {
        const updateData = {
          appointmentId: appointment.id,
          userId,
          appointment: {
            doctorId: values.primaryPhysician,
            date: values.schedule,
            startTime: values.schedule,
            endTime: new Date(values.schedule.getTime() + 30 * 60000),
            status:
              type === "cancel"
                ? ("cancelled" as const)
                : ("scheduled" as const),
            reason: values.reason || null,
            notes: values.note || null,
            cancellationReason:
              type === "cancel" ? values.cancellationReason : null,
          },
          type,
        };

        await updateAppointment(updateData);
        toast({
          title: "Success",
          description: `Appointment ${type}d successfully`,
        });
        setOpen?.(false);
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              fieldType={FormFieldTypes.SELECT}
              placeholder="Select a Doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <p>Dr. {doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              name="schedule"
              label="Appointment Date & Time"
              fieldType={FormFieldTypes.DATEPICKER}
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="grid gap-4">
              <CustomFormField
                control={form.control}
                name="reason"
                label="Reason"
                fieldType={FormFieldTypes.TEXTAREA}
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                control={form.control}
                name="note"
                label="Notes"
                fieldType={FormFieldTypes.TEXTAREA}
                placeholder="Additional notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation"
            fieldType={FormFieldTypes.TEXTAREA}
            placeholder="Please provide a reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`w-full ${
            type === "cancel"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {type === "cancel" ? "Cancel Appointment" : "Schedule Appointment"}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
