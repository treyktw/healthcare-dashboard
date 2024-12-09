// You can create a route to trigger this:
// app/api/seed/doctors/route.ts
import { seedDoctors } from '@/lib/helpers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const doctors = await seedDoctors();
    return NextResponse.json({
      message: 'Doctors seeded successfully',
      doctors
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed doctors' },
      { status: 500 }
    );
  }
}