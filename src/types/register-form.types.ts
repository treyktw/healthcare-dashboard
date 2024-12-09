// types/register.ts

export interface DocumentUploadData {
  fileUrl: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  uploadDate: string;
  userId: string;
}

export type QuestionType =
  | "welcome"
  | "input"
  | "date"
  | "options"
  | "select"
  | "phone_input"
  | "file"
  | "combined"
  | "consent"
  | "textarea"

// Interface for the question field
export interface BaseQuestion {
  qid: string;
  type: QuestionType; // Using our QuestionType union
  question: string;
  button: string;
  required?: boolean;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
}

// Extend BaseQuestion for specific question types
interface InputQuestion extends BaseQuestion {
  type: "input";
  inputType: string;
}

export interface InsuranceData {
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

interface OptionsQuestion extends BaseQuestion {
  type: "options";
  answers: string[];
}

interface CombinedQuestion extends BaseQuestion {
  type: "combined";
  fields: {
    qid: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }[];
}

export interface ConsentQuestion extends BaseQuestion {
  type: "consent";
  checkboxes: {
    qid: string;
    label: string;
  }[];
}

// Union type of all possible question types
export type RegistrationQuestion =
  | BaseQuestion
  | InputQuestion
  | OptionsQuestion
  | CombinedQuestion
  | ConsentQuestion;

// Question component props
export interface QuestionProps {
  question: RegistrationQuestion;
  onAnswer: (qid: string, value: QuestionValue) => void;
  onNext: () => void;
  onPrev: () => void;
  value: QuestionValue;
  isLoading?: boolean;
  currentStep: number;
  totalSteps: number;
}

// Base value types
export type BasicInputValue = string | Date | boolean | null | undefined;
export type FileInputValue = FormData | null | undefined;

export interface InsuranceFormData {
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

export interface ConsentFormData {
  privacyConsent: boolean;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
}

export type DocumentUploadUrl = {
  fileUrl: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  uploadDate: string;
};


// Form data interface that matches RegisterUserParams
// types/register-form.types.ts
export type QuestionValue =
  | string
  | Date
  | boolean
  | FormData
  | null
  | undefined
  | File
  | null
  | Record<string, boolean>
  | InsuranceData
  | null
  | InsuranceFormData
  | ConsentFormData
  | DocumentUploadUrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { [key: string]: any }; // For complex objects

  export interface RegistrationFormData {
    [key: string]: QuestionValue; // Add index signature to allow string indexing
    
    // Basic Info
    name: string;
    email: string;
    phone: string;
    birthDate: Date | string;
    gender: Gender;
    address: string;
    occupation: string;
  
    // Emergency Contact
    emergencyContactName: string;
    emergencyContactPhone: string;
  
    // Doctor
    primaryPhysicianId: string;
    doctor?: string;
  
    // Medical Info
    allergies: string;
    currentMedications: string;
    familyHistory: string;
    pastHistory: string;
  
    // Insurance
    insuranceProvider: string | InsuranceFormData;
    insurancePolicyNumber: string;
  
    // Documents
    identificationType: string;
    identificationNumber: string;
    identificationDocument?: FormData;
    documentUploadUrl?: DocumentUploadUrl
  
    // Consents
    treatmentConsent: boolean;
    disclosureConsent: boolean;
    privacyConsent: boolean;
  }

export interface FormPatientData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: string;
  address: string;
  occupation?: string;

  // Emergency Contact
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyPhone?: string;
  emergencyContactPhone?: string;

  // Medical Information
  allergies?: string;
  currentMedications?: string;
  familyHistory?: string;
  pastHistory?: string;

  // Doctor Selection
  doctor?: string;
  primaryPhysicianId?: string;

  // Insurance Information
  insuranceProvider?: string | { 
    insuranceProvider: string;
    insurancePolicyNumber: string;
  };
  insurancePolicyNumber?: string;

  // Document Upload
  documentUpload?: FormData;
  documentUploadUrl?: {
    fileUrl: string;
    filePath: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    category: string;
    uploadDate: string;
  };

  // Identification
  identificationType?: string;
  identificationNumber?: string;

  // Consent Information
  consent?: {
    treatmentConsent: boolean;
    disclosureConsent: boolean;
    privacyConsent: boolean;
  };
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;
  privacyConsent?: boolean;

}

// Type guard for checking dates
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

// Helper function to handle date formatting
export const formatDateValue = (value: QuestionValue): string | Date => {
  if (isDate(value)) {
    return value;
  }
  if (typeof value === "string" && value) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return new Date();
};

export type FileValue = File | null;

// Helper functions for type checking
export const isFileInput = (value: unknown): value is File => {
  return value instanceof File;
};

export const isFormData = (value: unknown): value is FormData => {
  return value instanceof FormData;
};

// Helper to convert File to FormData
export const convertFileToFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};

export const isOptionsQuestion = (
  question: RegistrationQuestion
): question is OptionsQuestion => {
  return question.type === "options";
};

export function isConsentQuestion(
  question: RegistrationQuestion
): question is ConsentQuestion {
  return question.type === "consent" && "checkboxes" in question;
}
