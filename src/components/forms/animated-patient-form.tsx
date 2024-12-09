// components/forms/animated-patient-form.tsx
"use client";

import { createUser } from "@/lib/actions/patient.actions";
import { AnimatedPatientFormProps } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingScreen from "../loading-screen";
import Question from "../questions";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionValue } from "@/types/register-form.types";

interface PatientFormData {
  [key: string]: QuestionValue;
  name: string;
  email: string;
  phone: string;
}

const initialFormData: PatientFormData = {
  name: "",
  email: "",
  phone: "",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
};

const AnimatedPatientForm = ({ questions }: AnimatedPatientFormProps) => {
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();

  const handleAnswer = (qid: string, value: QuestionValue) => {
    setFormData(prev => {
      if (qid in initialFormData) {
        return {
          ...prev,
          [qid]: value || "" // Ensure we always store a string
        };
      }
      return prev;
    });
  };

  const handleNextSlide = async (index: number) => {
    if (index > questions.length - 1) {
      try {
        setIsLoading(true);
        setShowLoadingScreen(true);

        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
        };

        if (!userData.phone) {
          throw new Error('Phone number is required');
        }

        const user = await createUser(userData);

        if (user?.id) {
          localStorage.setItem("initialPatientData", JSON.stringify(userData));
          await new Promise(resolve => setTimeout(resolve, 2000));
          router.push(`/patients/${user.id}/register`);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        // Add error handling (toast, etc.)
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
      <div className="relative min-h-screen flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
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

export default AnimatedPatientForm;