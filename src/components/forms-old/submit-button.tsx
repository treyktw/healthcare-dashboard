import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Add onClick prop
}

const SubmitButton = ({ isLoading, className, children, disabled, onClick  }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={className ?? "bg-green-500 text-white w-full"}
      onClick={onClick} // Forward the onClick handler
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
