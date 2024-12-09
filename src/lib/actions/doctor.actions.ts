// lib/actions/doctor.actions.ts
"use server";

import { prisma } from "@/lib/database/prisma";

export const getDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
    });

    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name,
      image: doctor.imageUrl,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      imageUrl: doctor.imageUrl
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};