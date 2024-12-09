"use server";

import { parseStringify } from "@/lib/utils";
import { AppointmentTableData, CreateAppointmentData, UpdateAppointmentData } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../database/prisma";

export const createAppointment = async (appointment: CreateAppointmentData) => {
  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        id: crypto.randomUUID(),
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        startTime: appointment.date,
        endTime: new Date(appointment.date.getTime() + 30 * 60000),
        status: appointment.status,
        type: appointment.type,
        reason: appointment.reason,
        notes: appointment.notes,
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    return parseStringify(newAppointment);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  } catch (error) {
    console.error('Error getting appointment:', error);
    throw error;
  }
};

export const getRecentAppointments = async () => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.reduce((acc, appointment) => {
      if (appointment.status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (appointment.status === "pending") {
        acc.pendingCount += 1;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    return {
      totalCount: appointments.length,
      ...counts,
      documents: appointments as unknown as AppointmentTableData[],
    };
  } catch (error) {
    console.log("Error getting appointments:", error);
    throw error;
  }
};

export const updateAppointment = async (params: UpdateAppointmentData) => {
  try {
    const appointment = await prisma.appointment.update({
      where: {
        id: params.appointmentId,
      },
      data: {
        doctorId: params.appointment.doctorId,
        date: params.appointment.date,
        startTime: params.appointment.startTime,
        endTime: params.appointment.endTime,
        status: params.appointment.status,
        reason: params.appointment.reason,
        notes: params.appointment.notes,
        cancellationReason: params.appointment.cancellationReason,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    // if (!updateAppointment) {
    //   throw new Error("Appointment not found");
    // }

    // const smsMessage = `Hi Its Carepulse.
    // ${
    //   type === "schedule"
    //     ? `Your Appointment has been scheduled for ${formatDateTime(
    //         appointment.schedule
    //       )}`
    //     : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
    // }`;

    // // Store notification in database
    // await prisma.message.create({
    //   data: {
    //     userId,
    //     content: smsMessage,
    //     type: "SMS",
    //     status: "SENT",
    //   },
    // });

    revalidatePath("/admin");
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Renamed from sendSMSNotification to createMessage to match our schema
export const createMessage = async (userId: string, content: string) => {
  try {
    const message = await prisma.message.create({
      data: {
        userId,
        content,
        type: "SMS",
        status: "SENT",
      },
    });

    return parseStringify(message);
  } catch (error) {
    console.log("Error creating message", error);
    throw error;
  }
};
