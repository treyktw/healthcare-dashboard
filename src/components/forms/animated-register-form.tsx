"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { registerPatients } from "@/lib/actions/patient.actions";

import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/loading-screen";

import { AnimatedRegisterFormProps } from "@/types";
import { registrationQuestions } from "@/types/register-form-questions";
import {
  convertFileToFormData,
  isFileInput,
  QuestionValue,
  RegistrationFormData,
} from "@/types/register-form.types";
import Question from "../questions";

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

const initialFormData: RegistrationFormData = {
  name: "",
  email: "",
  phone: "",
  birthDate: new Date(),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  primaryPhysicianId: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedications: "",
  familyHistory: "",
  pastHistory: "",
  identificationType: "",
  identificationNumber: "",
  identificationDocument: undefined,
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

const AnimatedRegisterForm = ({ user }: AnimatedRegisterFormProps) => {
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] = useState<RegistrationFormData>(() => ({
    ...initialFormData,
    name: user.name,
    email: user.email,
    phone: user.phone,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAnswer = (qid: string, value: QuestionValue) => {
    setFormData((prev) => {
      if (qid === "birthDate") {
        return {
          ...prev,
          [qid]: value instanceof Date ? value : new Date(value as string),
        };
      }

      // Handle file uploads
      if (isFileInput(value)) {
        const formData = convertFileToFormData(value);
        return {
          ...prev,
          [qid]: formData,
        };
      }

      // Handle other values
      return {
        ...prev,
        [qid]: value,
      };
    });
  };

  const handleNextSlide = async (index: number) => {
    if (index > registrationQuestions.length - 1) {
      try {
        setIsLoading(true);
        setShowLoadingScreen(true);
  
        const submissionData = {
          userId: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate instanceof Date 
            ? formData.birthDate 
            : new Date(formData.birthDate as string),
          gender: formData.gender,
          address: formData.address,
          occupation: formData.occupation,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          primaryPhysicianId: formData.primaryPhysicianId || formData.doctor,
          insuranceProvider: typeof formData.insuranceProvider === 'object' 
            ? formData.insuranceProvider.insuranceProvider 
            : formData.insuranceProvider || '',
          insurancePolicyNumber: typeof formData.insuranceProvider === 'object'
            ? formData.insuranceProvider.insurancePolicyNumber 
            : formData.insurancePolicyNumber || '',
          allergies: formData.allergies || '',
          currentMedications: formData.currentMedications || '',
          familyHistory: formData.familyHistory || '',
          documentUploadUrl: formData.documentUploadUrl,
          treatmentConsent: Boolean(formData.treatmentConsent),
          disclosureConsent: Boolean(formData.disclosureConsent),
          privacyConsent: Boolean(formData.privacyConsent)
        };
  
        const result = await registerPatients(submissionData);
  
        if (!result.success) {
          throw new Error(result.error || "Registration failed");
        }
  
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(`/patients/${user.id}/new-appointment`);
  
      } catch (error) {
        console.error("Registration error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to complete registration",
          variant: "destructive",
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
      {showLoadingScreen && (
        <LoadingScreen message="Completing your registration..." />
      )}
      <div className="relative min-h-screen flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {registrationQuestions.map(
            (question, i) =>
              i === slide && (
                <motion.div
                  key={question.qid}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="mx-auto max-w-xl px-4"
                >
                  <Question
                    question={question}
                    onAnswer={handleAnswer}
                    onNext={() => handleNextSlide(slide + 1)}
                    onPrev={handlePrevSlide}
                    value={formData[question.qid]}
                    isLoading={
                      isLoading && i === registrationQuestions.length - 1
                    }
                    currentStep={slide} // Pass the current slide index
                    totalSteps={registrationQuestions.length - 1} // Pass total number of questions (minus welcome)
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AnimatedRegisterForm;
