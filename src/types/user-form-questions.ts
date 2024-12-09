export const initialRegistrationQuestions = [
  {
    qid: "welcome",
    type: "welcome" as const,
    question: "Hi There! 👋\nLet's get you started with DentalCare",
    button: "Get Started",
  },
  {
    qid: "name",
    type: "input" as const,
    question: "What is your full name?",
    placeholder: "John Doe",
    required: true,
    button: "Continue",
    iconSrc: "/assets/icons/user.svg",
    iconAlt: "user",
  },
  {
    qid: "email",
    type: "input" as const,
    question: "What's your email address?",
    placeholder: "john@example.com",
    required: true,
    button: "Continue",
    iconSrc: "/assets/icons/email.svg",
    iconAlt: "email",
  },
  {
    qid: "phone",
    type: "phone_input" as const,
    question: "What's your phone number?",
    placeholder: "(555) 123-4567",
    required: true,
    button: "Complete Registration",
  }
];