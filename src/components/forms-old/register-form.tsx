"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import CustomFormField from "./custom-form-field";
import SubmitButton from "./submit-button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PatientFormValidation } from "@/lib/validation";

import { Form, FormControl } from "@/components/ui/form";

import { User } from "@/types";
import { FormFieldTypes } from "@/types/form.types";
import { registerPatients } from "@/lib/actions/patient.actions";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../file-uploader";
import { toast } from "sonner";

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  // Get stored data when component mounts
  const storedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("initialPatientData") || "{}")
      : {};

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: storedData.name || "",
      email: storedData.email || "",
      phone: storedData.phone || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setisLoading(true);
  
    try {
      let fileUrl = undefined;
  
      if (values.identificationDocument?.[0]) {
        const formData = new FormData();
        formData.append('file', values.identificationDocument[0]);
        formData.append('userId', user.id);
        formData.append('category', 'identification');
  
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
  
        if (!uploadResponse.ok) throw new Error('File upload failed');
        
        const uploadResult = await uploadResponse.json();
        fileUrl = uploadResult.fileUrl;
      }
  
      const patientData = {
        userId: user.id,
        name: storedData.name || '',
        email: storedData.email || '',
        phone: storedData.phone || '',
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactPhone: values.emergencyContactNumber,
        primaryPhysicianId: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies || '',
        currentMedications: values.currentMedication || '',
        familyHistory: values.familyMedicalHistory || '',
        pastHistory: values.pastMedicalHistory || '',
        fileUrl,
        treatmentConsent: Boolean(values.treatmentConsent),
        disclosureConsent: Boolean(values.disclosureConsent),
        privacyConsent: Boolean(values.privacyConsent)
      };
  
      const result = await registerPatients(patientData);
  
      if (result.success) {
        router.push(`/patients/${user.id}/new-appointment`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="space-y-4">
          <h1 className="text-32-bold md:text-36-bold">Welcome! 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="text-18-bold md:text-24-bold">
              Personal Information
            </h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="email"
            label="Email"
            placeholder="johndoe@treyktw.dev"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldTypes.DATEPICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
          />

          <CustomFormField
            fieldType={FormFieldTypes.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field: {
              onChange: ((value: string) => void) | undefined;
              value: string | undefined;
            }) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={
                    typeof field.value === "string" ? field.value : ""
                  }
                >
                  {GenderOptions.map((option, i) => (
                    <div
                      key={option + i}
                      className="flex h-full flex-1 items-center gap-1 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-7 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="address"
            label="address"
            placeholder="14th Street, New york"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-7 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Gaurdian's Name"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="Software Engineer"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="text-18-bold md:text-24-bold">
              Medical Information
            </h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.SELECT}
          name="primaryPhysician"
          label="Doctor"
          placeholder="Select a Doctor"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              <div className="flex items-center cursor-pointer gap-2">
                <Image
                  src={doctor.image}
                  alt="doctor-images"
                  width={32}
                  height={32}
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.INPUT}
            name="insurancePolicyNumber"
            label="Inusrance Policy Number"
            placeholder="e.g. ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="e.g. Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="e.g. ibuprofenm, Paracetamol"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldTypes.TEXTAREA}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="e.g. Appendectomy Tonsillectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="text-18-bold md:text-24-bold">
              Identification and Verification
            </h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.SELECT}
          name="identificationType"
          label="Identification Type"
          placeholder="Select a Physician"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type} className="cursor-pointer">
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="identificationNumber"
          label="Identification Number"
          placeholder="e.g. 123456789"
        />

        <CustomFormField
          fieldType={FormFieldTypes.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of identification"
          renderSkeleton={(field: {
            value: File[];
            onChange: (files: File[]) => void;
          }) => (
            <FormControl>
              <FileUploader
                files={field.value}
                onChange={field.onChange}
                userId={user.$id}
                category={"identification"}
              />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="text-18-bold md:text-24-bold">
              Consent and Privacy
            </h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
