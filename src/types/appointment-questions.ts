import { AppointmentQuestion } from "./appointment.types";
import { QuestionType } from "./register-form.types";

// lib/appointment-questions.ts
export const appointmentQuestions: AppointmentQuestion[] = [
  {
    qid: "welcome",
    type: "welcome" as QuestionType,
    question: "Let's schedule your appointment",
    button: "Get Started"
  },
  {
    qid: "doctor",
    type: "select" as QuestionType,
    question: "Select your doctor",
    required: true,
    button: "Continue"
  },
  {
    qid: "date",
    type: "date" as QuestionType,
    question: "When would you like to schedule?",
    required: true,
    button: "Continue"
  },
  {
    qid: "reason",
    type: "textarea" as QuestionType,
    question: "What's the reason for your visit?",
    placeholder: "Please describe your symptoms or reason for visit",
    required: true,
    button: "Continue"
  },
  {
    qid: "notes",
    type: "textarea" as QuestionType,
    question: "Any additional notes?",
    placeholder: "Optional: Add any additional information",
    required: false,
    button: "Schedule Appointment"
  }
] as const;