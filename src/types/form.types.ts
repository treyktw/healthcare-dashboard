import { Control } from "react-hook-form";
// export type FormValues = z.infer<typeof UserFormValidation>;
import { z } from "zod";

export interface CustomProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldType: FormFieldTypes;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  defaultValue?: string | number | boolean;
  children?: React.ReactNode;
  renderSkeleton?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any
  ) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  required?: any
  onFieldChange?: (name: string, value: string) => void;  // Add this
}

export enum FormFieldTypes {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "datacheckbox",
  DATEPICKER = "datepicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export const AppointmentFormSchema = z.object({
  primaryPhysician: z.string().min(1, "Please select a doctor"),
  schedule: z.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof AppointmentFormSchema>;


export const getFieldType = (type: string): FormFieldTypes => {
  switch (type) {
    case "phone_input":
      return FormFieldTypes.PHONE_INPUT;
    case "date":
      return FormFieldTypes.DATEPICKER;
    case "options":
      return FormFieldTypes.SELECT;
    case "file":
      return FormFieldTypes.SKELETON;
    case "consent":
      return FormFieldTypes.CHECKBOX;
    case "textarea":
      return FormFieldTypes.TEXTAREA;
    default:
      return FormFieldTypes.INPUT;
  }
};