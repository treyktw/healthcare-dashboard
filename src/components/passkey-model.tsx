"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModel = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false); // Set initial state to true
  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState("");
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const access = encryptedKey && decryptKey(encryptedKey)
    if (access === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setOpen(false);
      router.push("/admin");

      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [encryptedKey, passKey, path, router]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passKey);
      localStorage.setItem("accessKey", encryptedKey);
      console.log("Welcome Admin");

      setOpen(false);
    } else {
      setError("Invalid passkey");
    }
  };

  const closeModal = () => {
    setOpen(false); // Set to false when closing
    router.push("/"); // Redirect after closing
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="space-y-5 bg-dark-400 border-dark-500 !outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src={"/assets/icons/close.svg"}
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal}
              // priority
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To Access the <span className="text-green-500">Admin</span> page,
            please enter the passkey
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="">
          <InputOTP
            maxLength={6}
            value={passKey}
            onChange={(value) => setPassKey(value)}
          >
            <InputOTPGroup className="w-full flex justify-between">
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={0}
              />
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={1}
              />
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={2}
              />
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={3}
              />
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={4}
              />
              <InputOTPSlot
                className="text-36-bold justify-center flex border-dark-500 rounded-lg size-16 gap-4"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="text-red-500 text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="text-white bg-green-500 w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModel;
