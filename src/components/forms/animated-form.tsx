"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RegistrationItem } from "./form.types";
import Question from "@/components/questions";
import { QuestionValue } from "@/types/register-form.types";



const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

interface AnimatedFormProps {
  questions: RegistrationItem[];
  onComplete: (formData: Record<string, string | Date>) => void;
  logo?: React.ReactNode;
}

const AnimatedForm = ({ questions, onComplete, logo }: AnimatedFormProps) => {
  const [questionsList, setQuestionsList] = useState<RegistrationItem[]>(questions);
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | Date>>({});

  const length = questionsList.length - 1;

  function handleNextSlide(index: number): void {
    if (index > length) {
      onComplete(formData);
      return;
    }
    if (index < 0) return;
    setSlide(index);
  }
  const handleAnswer = (qid: string, value: QuestionValue) => {
    setFormData((prev) => {
      // Ensure we're only updating fields that exist in our form data type
      if (qid in prev) {
        return {
          ...prev,
          [qid]: value
        };
      }
      return prev;
    });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {logo && (
        <div className="absolute top-8 left-8">
          {logo}
        </div>
      )}
      
      <div className="container mx-auto px-4 py-20">
        {questionsList.map((item, i) => (
          <AnimatePresence key={i} mode="wait">
            {i === slide && (
              <Question
                item={item}
                chooseAnswer={handleAnswer}
                nextSlide={() => handleNextSlide(slide + 1)}
              />
            )}
          </AnimatePresence>
        ))}

        <motion.nav className="fixed bottom-8 left-0 right-0 flex justify-between px-8">
          {slide > 0 && (
            <motion.div
              className="flex items-center gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="text-lg font-medium">
                {slide}<span className="mx-2">/</span>{length}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleNextSlide(slide - 1)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                >
                  ←
                </button>
                <button 
                  onClick={() => handleNextSlide(slide + 1)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                >
                  →
                </button>
              </div>
            </motion.div>
          )}
        </motion.nav>
      </div>
    </main>
  );
};

export default AnimatedForm;