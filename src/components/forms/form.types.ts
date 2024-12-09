// types/form.types.ts
export interface RegistrationItem {
  qid: string;
  type: 'welcome' | 'input' | 'options' | 'date' | 'phone_input' | 'textarea' | 'checkbox';
  inputType?: string;
  question: string;
  answers?: string[];
  value?: string | Date;
  chosenAnswer?: string;
  required?: boolean;
  button: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
}



export const appointmentRegistrationData: RegistrationItem[] = [
  {
    qid: 'welcome',
    type: 'welcome',
    question: "Let's schedule your dental appointment",
    button: "Get Started",
  },
  {
    qid: 'doctor',
    type: 'options',
    question: 'Choose your preferred dentist',
    answers: ['Dr. John Green', 'Dr. Jane Powell', 'Dr. Alex Ramirez'],
    required: true,
    button: 'Continue',
  },
  {
    qid: 'date',
    type: 'date',
    question: 'When would you like to schedule your appointment?',
    required: true,
    button: 'Continue',
  },
  {
    qid: 'reason',
    type: 'input',
    inputType: 'text',
    question: 'What is the reason for your visit?',
    required: true,
    button: 'Continue',
  },
  {
    qid: 'notes',
    type: 'input',
    inputType: 'text',
    question: 'Any additional notes for the dentist?',
    required: false,
    button: 'Schedule Appointment',
  }
];