// components/forms/animated-appointment-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "../loading-screen";
import Question from "../questions";
import { QuestionValue } from "@/types/register-form.types";
import { createAppointment } from "@/lib/actions/prisma.actions";
import { CreateAppointmentData } from "@/types";
import { AppointmentQuestion } from "@/types/appointment.types";

export interface AppointmentFormData {
  [key: string]: QuestionValue;
  doctor: string | null;
  date: Date;
  reason: string;
  notes: string;
}

export interface AnimatedAppointmentFormProps {
  questions: AppointmentQuestion[];
  userId: string;
  patientId: string;
}

const initialFormData: AppointmentFormData = {
  doctor: null,
  date: new Date(),
  reason: "",
  notes: "",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
};

const AnimatedAppointmentForm = ({
  questions,
  userId,
  patientId,
}: AnimatedAppointmentFormProps) => {
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] =
    useState<AppointmentFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();

  const handleAnswer = (qid: string, value: QuestionValue) => {
    console.log("handleAnswer:", { qid, value, type: typeof value }); // Added type check

    if (qid === "doctor") {
      console.log("Doctor selection event triggered:", value);
    }

    setFormData((prev) => {
      console.log("Previous form data:", prev);
      const updatedData = { ...prev, [qid]: value };
      console.log("New form data:", updatedData);
      return updatedData;
    });
  };

  const handleNextSlide = async (index: number) => {
    if (index > questions.length - 1) {
      try {
        console.log("Form submission - Current form data:", formData);
        console.log("Doctor value:", formData.doctor);

        if (!formData.doctor || formData.doctor === "") {
          console.log("Doctor validation failed:", {
            doctor: formData.doctor,
            type: typeof formData.doctor,
          });
          throw new Error("Doctor selection is required");
        }

        setIsLoading(true);
        setShowLoadingScreen(true);

        const appointmentData: CreateAppointmentData = {
          userId,
          patientId,
          doctorId: formData.doctor,
          date: formData.date,
          // startTime: formData.date,
          // endTime: new Date(formData.date.getTime() + 30 * 60000),
          status: "pending" as Status,
          type: "regular",
          reason: formData.reason || null,
          notes: formData.notes || null,
        };

        console.log("Creating appointment with:", appointmentData); // Debug log

        const createdAppointment = await createAppointment(appointmentData);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${createdAppointment.id}`
        );
      } catch (error) {
        console.error("Error creating appointment:", {
          error,
          formData,
          doctorValue: formData.doctor,
        });
      } finally {
        setIsLoading(false);
        setShowLoadingScreen(false);
      }
      return;
    }

    if (index >= 0) {
      setSlide(index);
    }
  };

  const handlePrevSlide = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen />}
      <div className="h-[50rem] relative flex items-center justify-center w-full">
        <AnimatePresence mode="wait">s
          {questions.map(
            (question, i) =>
              i === slide && (
                <motion.div
                  key={question.qid}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mx-auto max-w-lg px-4"
                >
                  <Question
                    question={question}
                    onAnswer={handleAnswer}
                    onNext={() => handleNextSlide(slide + 1)}
                    onPrev={handlePrevSlide}
                    value={formData[question.qid]}
                    isLoading={isLoading && i === questions.length - 1}
                    currentStep={slide}
                    totalSteps={questions.length}
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AnimatedAppointmentForm;
