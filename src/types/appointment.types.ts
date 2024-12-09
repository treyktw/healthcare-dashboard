import { QuestionType } from "./register-form.types";

export interface AppointmentQuestion {
  qid: string;
  type: QuestionType;
  question: string;
  button: string;
  required?: boolean;
  placeholder?: string;
}
