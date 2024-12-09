// components/registration/Options.tsx
import { motion } from "framer-motion";
import { variant } from "@/constants/animations";

interface OptionsProps {
  qid: string;
  answers: string[];
  chosenAnswer?: string;
  chooseAnswer: (qid: string, answer: string) => void;
}

export function Options({ qid, answers, chosenAnswer, chooseAnswer }: OptionsProps) {
  return (
    <>
      {answers.map((ans, i) => (
        <motion.li
          key={i}
          variants={variant}
          onClick={() => chooseAnswer(qid, ans)}
          className={`${chosenAnswer === ans ? "active" : ""}`}
        >
          <a href="#">{ans}</a>
        </motion.li>
      ))}
    </>
  );
}