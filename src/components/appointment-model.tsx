"use client";

import React, { Suspense, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentModalProps } from "@/types";
import AppointmentForm from "./forms-old/appointment-form";
import ErrorBoundary from "./error-boundary";

const AppointmentModal = ({
  type,
  appointment,
  patientId,
  userId,
  title,
  description
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    try {
      if (isOpen && appointment) {
        // Only log if appointment exists to prevent undefined access
        console.log("Opening modal with appointment:", {
          id: appointment.id,
          doctorId: appointment.doctorId,
          date: appointment.date
        });
      }
      setOpen(isOpen);
    } catch (error) {
      console.error("Modal open error:", error);
    }
  }, [appointment]);

  // Wrap form in error boundary with proper cleanup
  const renderForm = useCallback(() => {
    if (!open) return null;

    return (
      <ErrorBoundary
        fallback={<div className="p-4 text-red-500">Error loading appointment form</div>}
      >
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <div className="max-h-[70vh] overflow-y-auto">
            <AppointmentForm
              type={type}
              userId={userId}
              patientId={patientId}
              appointment={appointment}
              setOpen={setOpen}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  }, [open, type, userId, patientId, appointment, setOpen]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" ? "text-green-500" : ""}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-dark-400 border-dark-500 sm:max-w-xl">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {title || `${type} Appointment`}
          </DialogTitle>
          <DialogDescription>
            {description || `Please fill out the following details to ${type} an appointment`}
          </DialogDescription>
        </DialogHeader>

        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(AppointmentModal);