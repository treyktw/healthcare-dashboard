"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import Image from "next/image";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { E164Number } from "libphonenumber-js/core";

import { CustomProps, FormFieldTypes } from "@/types/form.types";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const RenderField = ({
  field,
  props,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  props: CustomProps;
}) => {
  const {
    fieldType,
    iconAlt,
    iconSrc,
    placeholder,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  switch (fieldType) {
    case FormFieldTypes.INPUT:
      return (
        <div className="flex w-full rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <div className="flex items-center pl-3">
              <Image
                src={iconSrc || "/assets/icons/logo-icon.svg"}
                alt={iconAlt || "icon"}
                height={24}
                width={24}
              />
            </div>
          )}
          <FormControl className="flex-1">
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value}
              className="w-full bg-dark-400 placeholder:text-dark-600 border-dark-500 h-11 focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldTypes.PHONE_INPUT:
      return (
        <FormControl className="w-full">
          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withcontrycallingcode="true"
            value={field.value as E164Number | undefined}
            onChange={(value) => field.onChange(value)}
            className="w-full mt-2 h-[46.5px] rounded-md px-3 text-sm border bg-dark-400 placeholder:text-dark-600 border-dark-500"
          />
        </FormControl>
      );

    case FormFieldTypes.DATEPICKER:
      const currentValue = field.value;
      const selectedDate =
        typeof currentValue === "string"
          ? new Date(currentValue)
          : currentValue instanceof Date
          ? currentValue
          : null;

      return (
        <div className="flex w-full rounded-md border border-dark-500 bg-dark-400">
          <div className="flex items-center pl-3">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calendar"
            />
          </div>
          <FormControl className="flex-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => field.onChange(date)}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              className="w-full h-11 bg-dark-400 border-0 focus:ring-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldTypes.SKELETON:
      return renderSkeleton ? (
        <div className="w-full">{renderSkeleton(field)}</div>
      ) : null;

    case FormFieldTypes.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultOpen={typeof field.value === "string"}
          >
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldTypes.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            value={
              field.value instanceof Date
                ? field.value.toISOString()
                : field.value || ""
            }
            className="shad-textarea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldTypes.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-2">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <div className="w-full">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            {fieldType !== FormFieldTypes.CHECKBOX && label && (
              <FormLabel>{label}</FormLabel>
            )}

            <RenderField field={field} props={props} />
            <FormMessage className="!text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomFormField;
