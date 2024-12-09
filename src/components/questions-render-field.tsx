// components/forms/QuestionFieldRenderer.tsx
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomFormField from "@/components/forms-old/custom-form-field";
import { FileUploader } from "@/components/file-uploader";
import { FormFieldTypes, getFieldType } from "@/types/form.types";
import { IdentificationTypes } from "@/constants";
import {
  isOptionsQuestion,
  isConsentQuestion,
  RegistrationQuestion,
  QuestionValue,
  InsuranceFormData,
  ConsentFormData,
} from "@/types/register-form.types";

interface QuestionFieldRendererProps {
  question: RegistrationQuestion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  value: QuestionValue;
  onAnswer: (qid: string, value: QuestionValue) => void;
  doctors?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    specialization: string[];
  }>;
  isLoadingDoctors?: boolean;
}

export const QuestionFieldRenderer = ({
  question,
  methods,
  value,
  onAnswer,
  doctors = [],
  isLoadingDoctors = false,
}: QuestionFieldRendererProps) => {
  switch (question.qid) {
    case "doctor":
      return (
        <div className="w-full">
          <CustomFormField
            control={methods.control}
            name={question.qid}
            fieldType={FormFieldTypes.SELECT}
            placeholder={
              isLoadingDoctors ? "Loading doctors..." : "Select your doctor"
            }
            required={true}
            disabled={isLoadingDoctors}
          >
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Dr. {doctor.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {doctor.specialization[0]}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {isLoadingDoctors && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
              Loading available doctors...
            </div>
          )}

          {/* Add debug output */}
          <div className="mt-2 text-xs text-gray-400">
            {methods.watch("doctor") && `Selected: ${methods.watch("doctor")}`}
          </div>
        </div>
      );

    case "insuranceProvider":

      return (
        <div className="space-y-4">
          <CustomFormField
            control={methods.control}
            fieldType={FormFieldTypes.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
            defaultValue=""
            onFieldChange={(name, value) => {
              const currentData: InsuranceFormData = {
                insuranceProvider: value,
                insurancePolicyNumber: methods.getValues("insurancePolicyNumber") || ""
              };
              onAnswer("insuranceProvider", currentData);
            }}
          />
          <CustomFormField
            control={methods.control}
            fieldType={FormFieldTypes.INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="e.g. ABC123456789"
            defaultValue=""
            onFieldChange={(name, value) => {
              const currentData: InsuranceFormData = {
                insuranceProvider: methods.getValues("insuranceProvider") || "",
                insurancePolicyNumber: value
              };
              onAnswer("insuranceProvider", currentData);
            }}
          />
        </div>
      );

    case "familyHistory":
    case "pastHistory":
    case "currentMedications":
    case "allergies":
    case "medicalHistory":
      return (
        <div className="w-[30rem] flex items-center justify-center">
          <CustomFormField
            control={methods.control}
            name={question.qid}
            fieldType={FormFieldTypes.TEXTAREA}
            placeholder={question.placeholder}
            required={question.required}
          />
        </div>
      );

    case "identificationType":
      return (
        <CustomFormField
          control={methods.control}
          name={question.qid}
          fieldType={FormFieldTypes.SELECT}
          placeholder="Select identification type"
          required={true}
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
      );

    case "gender":
      if (isOptionsQuestion(question)) {
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => onAnswer(question.qid, val)}
            className="flex flex-col space-y-4"
          >
            {question.answers.map((answer) => (
              <div
                key={answer}
                className={`flex items-center p-4 rounded-lg border transition-all
                  ${
                    value === answer
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
              >
                <RadioGroupItem
                  id={answer}
                  value={answer}
                  className="sr-only"
                />
                <label
                  htmlFor={answer}
                  className="flex-1 text-base cursor-pointer flex items-center space-x-3"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 
                      ${
                        value === answer
                          ? "border-green-500 bg-green-500"
                          : "border-white/50"
                      }`}
                  />
                  <span
                    className={
                      value === answer ? "text-white" : "text-white/70"
                    }
                  >
                    {answer}
                  </span>
                </label>
              </div>
            ))}
          </RadioGroup>
        );
      }
      return null;

      

      case "documentUpload":
        console.log("Rendering document upload, current value:", value);
        return (
          <div className="space-y-4">
            <FileUploader
              files={value instanceof File ? [value] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  console.log("File being uploaded:", files[0]);
                  onAnswer(question.qid, files[0]);
                  methods.setValue(question.qid, files[0], {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }
              }}
              onUrlChange={(url) => {
                if (url) {
                  console.log("URL received:", url);
                  methods.setValue(`${question.qid}Url`, url);
                }
              }}
              maxSize={5 * 1024 * 1024}
              acceptedFileTypes={{
                "image/*": [".png", ".jpg", ".jpeg"],
                "application/pdf": [".pdf"],
              }}
              userId={methods.getValues("userId") || "temp-" + crypto.randomUUID()} // Generate temp ID if not yet available
              category="identification"
            />
          </div>
        );

        case "consent":
          if (!isConsentQuestion(question)) return null;
          return (
            <div className="space-y-6">
              {question.checkboxes.map((checkbox) => (
                <div key={checkbox.qid} className="flex items-start space-x-3">
                  <CustomFormField
                    control={methods.control}
                    name={checkbox.qid}
                    fieldType={FormFieldTypes.CHECKBOX}
                    label={checkbox.label}
                    required={true}
                    onFieldChange={(_, value) => {
                      const currentValues = methods.getValues();
                      const consentData: ConsentFormData = {
                        privacyConsent: currentValues.privacyConsent || false,
                        treatmentConsent: currentValues.treatmentConsent || false,
                        disclosureConsent: currentValues.disclosureConsent || false,
                        [checkbox.qid]: value === 'true'
                      };
                      onAnswer("consent", consentData);
                    }}
                  />
                </div>
              ))}
            </div>
          );

    case "address":
      return (
        <div className="w-full">
          <CustomFormField
            control={methods.control}
            name={question.qid}
            fieldType={FormFieldTypes.INPUT}
            placeholder={question.placeholder}
            required={question.required}
            iconSrc={question.iconSrc}
            iconAlt={question.iconAlt}
          />
          {methods.formState.errors[question.qid] && (
            <p className="text-sm text-red-500 mt-1">
              {methods.formState.errors[question.qid]?.message as string}
            </p>
          )}
        </div>
      );

    case "phone":
      return (
        <div className="w-full">
          <CustomFormField
            control={methods.control}
            name={question.qid}
            fieldType={FormFieldTypes.PHONE_INPUT}
            placeholder={question.placeholder || "Enter phone number"}
            required={question.required}
          />
          {methods.formState.errors[question.qid] && (
            <p className="text-sm text-red-500 mt-1">
              {methods.formState.errors[question.qid]?.message as string}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div className="w-full">
          <CustomFormField
            control={methods.control}
            name={question.qid}
            fieldType={getFieldType(question.type)}
            placeholder={question.placeholder}
            required={question.required}
            iconSrc={question.iconSrc}
            iconAlt={question.iconAlt}
          />
        </div>
      );
  }
};
