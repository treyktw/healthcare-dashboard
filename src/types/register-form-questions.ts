import { QuestionType, RegistrationQuestion } from "./register-form.types";

export const QUESTION_TYPES = {
  WELCOME: 'welcome' as QuestionType,
  INPUT: 'input' as QuestionType,
  DATE: 'date' as QuestionType,
  OPTIONS: 'options' as QuestionType,
  SELECT: 'select' as QuestionType,
  PHONE_INPUT: 'phone_input' as QuestionType,
  FILE: 'file' as QuestionType,
  COMBINED: 'combined' as QuestionType,
  CONSENT: 'consent' as QuestionType,
} as const;

// lib/register-questions.ts
export const registrationQuestions: RegistrationQuestion[]  = [
  {
    qid: "welcome",
    type: QUESTION_TYPES.WELCOME,
    question: "Welcome! 👋\nLet's complete your patient profile",
    button: "Get Started",
  },
  {
    qid: "birthDate",
    type: QUESTION_TYPES.DATE,
    question: "When were you born?",
    required: true,
    button: "Continue"
  },
  {
    qid: "gender",
    type: QUESTION_TYPES.OPTIONS,
    question: "What is your gender?",
    answers: ["Male", "Female", "Other"],
    required: true,
    button: "Continue"
  },
  {
    qid: "address",
    type: QUESTION_TYPES.INPUT,
    inputType: "text",
    question: "What is your address?",
    placeholder: "14th Street, New York",
    required: true,
    button: "Continue"
  },
  {
    qid: "occupation",
    type: QUESTION_TYPES.INPUT,
    inputType: "text",
    question: "What is your occupation?",
    placeholder: "Software Engineer",
    required: true,
    button: "Continue"
  },
  {
    qid: "emergencyContact",
    type: QUESTION_TYPES.INPUT,
    inputType: "text",
    question: "Who should we contact in case of emergency?",
    placeholder: "Guardian's Name",
    required: true,
    button: "Continue"
  },
  {
    qid: "emergencyPhone",
    type: QUESTION_TYPES.PHONE_INPUT,
    question: "What's their phone number?",
    placeholder: "(555) 123-4567",
    required: true,
    button: "Continue"
  },
  {
    qid: "doctor",
    type: QUESTION_TYPES.SELECT,
    question: "Choose your preferred doctor",
    required: true,
    button: "Continue",
  },
  {
    qid: "medicalHistory",
    type: QUESTION_TYPES.COMBINED,
    question: "Medical History",
    fields: [
      {
        qid: "allergies",
        type: "textarea",
        placeholder: "Any allergies?",
        required: false
      },
      {
        qid: "currentMedication",
        type: "textarea",
        placeholder: "Current medications?",
        required: false
      }
    ],
    button: "Continue"
  },
  {
    qid: "familyHistory",
    type: QUESTION_TYPES.COMBINED,
    question: "Family History",
    fields: [
      {
        qid: "familyMedicalHistory",
        type: "textarea",
        placeholder: "Family medical history",
        required: false
      },
      {
        qid: "pastMedicalHistory",
        type: "textarea",
        placeholder: "Past medical history",
        required: false
      }
    ],
    button: "Continue"
  },    
  {
    qid: "insuranceProvider",
    type: "input" as QuestionType,
    question: "Who is your insurance provider?",
    placeholder: "Enter your insurance provider",
    required: true,
    button: "Continue",
  // If you have an icon
    iconAlt: "insurance"
  },
  {
    qid: "documentUpload",
    type: QUESTION_TYPES.FILE,
    question: "Upload your identification document",
    required: true,
    button: "Continue"
  },
  {
    qid: "consent",
    type: QUESTION_TYPES.CONSENT,
    question: "Almost done! Please review and consent",
    checkboxes: [
      {
        qid: "treatmentConsent",
        label: "I consent to treatment"
      },
      {
        qid: "disclosureConsent",
        label: "I consent to disclosure of information"
      },
      {
        qid: "privacyConsent",
        label: "I consent to privacy policy"
      }
    ],
    button: "Complete Registration"
  }
]