"use client";

// 1. Imports
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";

// UI Components
import { FormControl } from "./ui/form";
import SubmitButton from "@/components/forms-old/submit-button";
import {
  ConsentQuestion,
  QuestionProps,
  QuestionValue,
  RegistrationQuestion,
} from "@/types/register-form.types";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { QuestionFieldRenderer } from "./questions-render-field";

const questionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Question({
  question,
  onAnswer,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
  value,
  isLoading = false,
}: QuestionProps) {
  const [doctors, setDoctors] = useState<
    {
      id: string;
      name: string;
      image: string;
      specialization: string[];
      licenseNumber: string;
      imageUrl: string;
    }[]
  >([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const getValidationSchema = (question: RegistrationQuestion) => {
    if (question.type === "input") {
      switch (question.qid) {
        case "address":
          return z.object({
            [question.qid]: z
              .string()
              .min(5, "Address must be at least 5 characters")
              .max(500, "Address must be at most 500 characters"),
          });

        case "occupation":
          return z.object({
            [question.qid]: z
              .string()
              .min(2, "Occupation must be at least 2 characters")
              .max(100, "Occupation must be at most 100 characters"),
          });

        case "emergencyContact":
          return z.object({
            [question.qid]: z
              .string()
              .min(2, "Contact name must be at least 2 characters")
              .max(100, "Contact name must be at most 100 characters"),
          });

        case "insuranceProvider":
          return z.object({
            [question.qid]: z
              .string()
              .min(2, "Insurance provider must be at least 2 characters")
              .max(100, "Insurance provider must be at most 100 characters"),
            insurancePolicyNumber: z
              .string()
              .min(5, "Policy number must be at least 5 characters")
              .max(50, "Policy number must be at most 50 characters"),
          });

        default:
          return z.object({
            [question.qid]: question.required
              ? z.string().min(1, "This field is required")
              : z.string().optional(),
          });
      }
    }

    // Rest of your validation logic
    if (question.type === "date") {
      return z.object({
        [question.qid]: z.date({
          required_error: "Please select a date",
          invalid_type_error: "That's not a date!",
        }),
      });
    }

    return z.object({
      [question.qid]: question.required
        ? z.string().min(1, "This field is required")
        : z.string().optional(),
    });
  };

  const methods = useForm({
    resolver: zodResolver(getValidationSchema(question)),
    defaultValues: {
      ...(question.type === "consent"
        ? Object.fromEntries(
            (question as ConsentQuestion).checkboxes.map((checkbox) => [
              checkbox.qid,
              typeof value === "object" && value !== null
                ? (value as Record<string, boolean>)[checkbox.qid] || false
                : false,
            ])
          )
        : {
            [question.qid]: value ?? "",
          }),
    },
    mode: "onChange",
  });

  // Handle date changes specifically
  const handleDateChange = (date: Date | null) => {
    if (date) {
      methods.setValue(question.qid, date, { shouldValidate: true });
      onAnswer(question.qid, date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", question.qid);

    // Get all form values
    const formValues = methods.getValues();
    console.log("Form values at submission:", formValues); // Debug log

    if (question.qid === "phone") {
      const phoneValue = formValues[question.qid];
      console.log("Phone value:", phoneValue); // Debug log
      if (phoneValue) {
        onAnswer(question.qid, phoneValue);
      }
    } else if (question.qid === "doctor") {
      console.log("Selected doctor:", formValues[question.qid]);
      if (formValues[question.qid]) {
        onAnswer(question.qid, formValues[question.qid]);
      }
    } else if (question.qid === "documentUpload" && value instanceof File) {
      console.log("File ready, proceeding to next");
      onNext();
    } else if (question.type === "consent") {
      const consentQuestion = question as ConsentQuestion;
      const consentData: Record<string, boolean> = {};

      consentQuestion.checkboxes.forEach((checkbox) => {
        consentData[checkbox.qid] = Boolean(formValues[checkbox.qid]);
      });

      onAnswer(question.qid, consentData as QuestionValue);
    } else {
      console.log("Form data:", formValues);
      const fieldValue = formValues[question.qid];
      if (fieldValue !== null && fieldValue !== undefined) {
        onAnswer(question.qid, fieldValue as QuestionValue);
      }
    }

    onNext();
  };

  // Fetch doctors for doctor selection
  useEffect(() => {
    if (question.qid === "doctor") {
      const fetchDoctors = async () => {
        setIsLoadingDoctors(true);
        try {
          const data = await getDoctors();
          setDoctors(data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        } finally {
          setIsLoadingDoctors(false);
        }
      };
      fetchDoctors();
    }

    // Only set value if it exists and is not null
    if (value !== undefined && value !== null && question.qid) {
      console.log("Syncing value to form:", value);
      methods.setValue(question.qid, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [methods, question.qid, value]);

  const renderDatePicker = () => (
    <div className="flex w-full rounded-md border border-dark-500 bg-dark-400">
      <div className="flex items-center pl-3">
        <Image
          src="/assets/icons/calendar.svg"
          width={24}
          height={24}
          alt="calendar"
          sizes="lg"
        />
      </div>
      <FormControl className="flex-1">
        <DatePicker
          selected={value instanceof Date ? value : null}
          onChange={handleDateChange}
          dateFormat="MM/dd/yyyy"
          wrapperClassName="date-picker w-full"
          className="w-full h-11 bg-dark-400 border-0 focus:ring-0"
          placeholderText="Select your birth date"
        />
      </FormControl>
    </div>
  );

  // Handle field rendering based on type
  const renderContent = () => {
    if (question.type === "date") {
      return renderDatePicker();
    }

    return (
      <QuestionFieldRenderer
        question={question}
        methods={methods}
        value={value}
        onAnswer={onAnswer}
        doctors={doctors}
        isLoadingDoctors={isLoadingDoctors}
      />
    );
  };

  if (question.type === "welcome") {
    return (
      <motion.div
        variants={questionVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold whitespace-pre-line">
          {question.question}
        </h1>
        <button
          type="button"
          onClick={onNext}
          className="mt-8 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {question.button}
        </button>
      </motion.div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.h2
          variants={questionVariants}
          initial="hidden"
          animate="show"
          className="text-3xl font-bold text-center"
        >
          {question.question}
        </motion.h2>

        <motion.div
          variants={questionVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {renderContent()}
        </motion.div>
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          >
            ←
          </button>
          <span className="text-white/60">
            Step {currentStep} of {totalSteps}
          </span>
          <SubmitButton
            isLoading={isLoading}
            // Remove the onClick handler here
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-white p-0 disabled:bg-gray-500"
          >
            →
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
