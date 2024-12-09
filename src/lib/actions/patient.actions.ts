"use server";

import { CreateUserParams, RegisterUserParams } from "@/types";
import { prisma } from "../database/prisma";
import { revalidatePath } from "next/cache";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user with UUID
    const newUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(), // Explicitly set UUID
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    return {
      ...newUser,
      $id: newUser.id, // Add $id to maintain compatibility with old Appwrite format
    };
  } catch (error) {
    console.log("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    return {
      ...user,
      $id: user.id, // Maintain compatibility with old Appwrite format
    };
  } catch (error) {
    console.log("Error getting user:", error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerPatients(data: RegisterUserParams): Promise<{ success: boolean; data?: any; error?: string }> {

  const doctor = await prisma.doctor.findUnique({
    where: { id: data.primaryPhysicianId }
  });

  if (!doctor) {
    return { success: false, error: `Doctor with ID ${data.primaryPhysicianId} not found` };
  }


  try {
    const patient = await prisma.patient.create({
      data: {
        userId: data.userId,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        occupation: data.occupation,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        primaryPhysicianId: data.primaryPhysicianId,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        allergies: data.allergies || "",
        currentMedications: data.currentMedications || "",
        familyHistory: data.familyHistory || "",
        medicalHistory: data.pastHistory || "",
        fileUrl: data.fileUrl || "",
        treatmentConsent: true,
        disclosureConsent: true,
        privacyConsent: true
      }
    });

    revalidatePath('/patients/[userId]');
    return JSON.parse(JSON.stringify({ success: true, data: patient }));
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registration failed" };
  }
}

// Separate function to handle file upload
// const handleFileUpload = async (identificationDocument: FormData): Promise<string | null> => {
//   try {
//     const file = identificationDocument.get('blobFile') as Blob;
//     if (!file) {
//       console.log('No file found in form data');
//       return null;
//     }

//     const bucketPath = path.join(process.cwd(), 'bucket', 'identifications');
//     await mkdir(bucketPath, { recursive: true });

//     const fileName = `${crypto.randomUUID()}-identification`;
//     const filePath = path.join(bucketPath, fileName);

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     await writeFile(filePath, buffer);

//     return `/bucket/identifications/${fileName}`;
//   } catch (fileError) {
//     console.log('File upload error:', fileError);
//     return null;
//   }
// };

export const getPatient = async (userId: string) => {
  try {
    const patient = await prisma.patient.findFirstOrThrow({
      where: { userId },
      include: {
        user: true,
        primaryPhysician: {
          include: {
            user: true,
          },
        },
        appointments: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return {
      ...patient,
      $id: patient.id // Add this for backward compatibility
    };
  } catch (error) {
    console.log("Error getting patient:", error);
    throw error;
  }
};


export const updatePatient = async (
  patientId: string,
  data: Partial<RegisterUserParams>
) => {
  try {
    const fileUrl = data.fileUrl;

    const updateData = {
      ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
      ...(data.gender && { gender: data.gender }),
      ...(data.address && { address: data.address }),
      ...(data.occupation && { occupation: data.occupation }),
      ...(data.emergencyContactName && { emergencyContactName: data.emergencyContactName }),
      ...(data.emergencyContactPhone && { emergencyContactPhone: data.emergencyContactPhone }),
      ...(data.primaryPhysicianId && { primaryPhysicianId: data.primaryPhysicianId }),
      ...(data.insuranceProvider && { insuranceProvider: data.insuranceProvider }),
      ...(data.insurancePolicyNumber && { insurancePolicyNumber: data.insurancePolicyNumber }),
      allergies: data.allergies || "",
      currentMedications: data.currentMedications || "",
      familyHistory: data.familyHistory || "",
      medicalHistory: data.pastHistory || "",
      ...(fileUrl && { fileUrl }),
      updatedAt: new Date()
    };

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: updateData,
      include: {
        user: true,
        primaryPhysician: {
          include: {
            user: true,
          },
        },
        appointments: {
          orderBy: {
            date: 'desc'
          },
          take: 5,
        },
      },
    });

    return { success: true, data: updatedPatient };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update patient record"
    };
  }
};
