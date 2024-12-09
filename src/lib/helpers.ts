// lib/helpers/seedDoctors.ts

import { Doctors } from '@/constants';
import { prisma } from './database/prisma';

export async function seedDoctors() {
  try {
    // Create doctors in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdDoctors = await Promise.all(
        Doctors.map(async (doctor) => {
          // Create or update doctor
          return await tx.doctor.upsert({
            where: { 
              id: doctor.id 
            },
            update: {
              user: {
                update: {
                  name: doctor.name,
                  email: `${doctor.id.toLowerCase()}@carepulse.com`,
                  phone: '+1234567890'  // placeholder
                }
              }
            },
            create: {
              id: doctor.id,
              user: {
                create: {
                  name: doctor.name,
                  email: `${doctor.id.toLowerCase()}@carepulse.com`,
                  phone: '+1234567890'  // placeholder
                }
              },
              specialization: ['General Dentistry'],
              licenseNumber: `DDS-${doctor.id.toUpperCase()}`,
              licenseExpiry: new Date('2025-12-31'),
              imageUrl: doctor.image
            }
          });
        })
      );

      return createdDoctors;
    });

    console.log('Doctors seeded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error seeding doctors:', error);
    throw error;
  }
}