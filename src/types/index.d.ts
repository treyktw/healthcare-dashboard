import type { Patient, User } from "@prisma/client";
// import { Appointment } from "./appwrite.types";

interface PageParams {
  userId: string;
}

export interface SearchParamProps {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}

interface SearchParams {
  appointmentId?: string;
  admin?: string;
  // Add other search parameters you expect
}

export interface SearchParamProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare global {
  type Gender = "Male" | "Female" | "Other";
  type Status = "pending" | "scheduled" | "cancelled";
}

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  $id: string;
}

export interface RegisterUserParams {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryPhysicianId: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedications?: string;
  familyHistory?: string;
  pastHistory?: string;
  fileUrl?: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
}

declare type Doctor = {
  image: string;
  name: string;
};

declare type UserPreferences = {
  // Theme & Display
  theme: "light" | "dark" | "system";
  fontSize?: "small" | "medium" | "large";
  colorScheme?: string;

  // Notifications
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    newMessages: boolean;
    updates: boolean;
  };

  // Privacy & Security
  privacy: {
    profileVisibility: "public" | "private" | "contacts";
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    twoFactorEnabled: boolean;
  };

  // Communication
  communication: {
    emailFrequency: "daily" | "weekly" | "monthly" | "never";
    language: string;
    timezone: string;
  };

  // User Interface
  interface: {
    sidebarCollapsed: boolean;
    compactView: boolean;
    showTutorials: boolean;
  };

  // Account Settings
  account: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  };
};

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string | undefined;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

interface UpdateAppointmentParams {
  userId: string;
  appointmentId: string;
  appointment: AppointmentUpdateFields;
  type: AppointmentType;
  timeZone?: string;
}

export interface UpdateAppointmentData {
  appointmentId: string;
  userId: string;
  appointment: {
    doctorId?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    status?: "pending" | "scheduled" | "cancelled";
    reason?: string | null;
    notes?: string | null;
    cancellationReason?: string | null;
  };
  type: "schedule" | "cancel" | "update";
}

export interface AppointmentBase {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: string;
  status: Status;
  reason: string | null;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient & {
    user: User;
  };
}

// Type for the table columns
export type AppointmentTableData = AppointmentBase & {
  patient: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
};

export interface AppointmentWithRelations {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: Status;
  type: string;
  reason: string | null;
  notes: string | null; // This maps to note
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  patient: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  doctor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface EmergencyContactUpdate {
  name?: string;
  phone?: string;
}

export interface InsuranceUpdate {
  provider?: string;
  policyNumber?: string;
}

export interface FormPatientData {
  disclosureConsent: boolean;
  privacyConsent: boolean;
  treatmentConsent: boolean;
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryPhysicianId: string;
  insuranceProvider: string; // Changed from union type
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedications?: string;
  familyHistory?: string;
  pastHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  documentUpload?: FormData;
  documentUploadUrl?: DocumentUploadUrl;
  consent?: {
    treatmentConsent: boolean;
    disclosureConsent: boolean;
    privacyConsent: boolean;
  };
}

export interface AppointmentModalProps {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment & {
    patient: {
      id: string;
      user: {
        id: string;
        name: string;
      };
    };
  };
  title: string;
  description: string;
}

// For update operations, allow partial updates of base fields
type AppointmentUpdateFields = Partial<AppointmentBase>;

export interface CreateAppointmentData {
  userId: string;
  patientId: string;
  doctorId: string;
  date: Date;
  status: Status;
  type: string;
  reason?: string | null;
  notes?: string | null;
}


export interface AnimatedPatientFormProps {
  questions: InitialRegistrationQuestion[];
  // onComplete: (data: InitialRegistrationData) => Promise<void>;
}

export interface AnimatedRegisterFormProps {
  questions: PatientRegistrationQuestion[];
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface InitialRegistrationData {
  name: string;
  email: string;
  phone: string;
}