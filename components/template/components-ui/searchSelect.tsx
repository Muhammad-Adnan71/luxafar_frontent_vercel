"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/CMS/components-ui/shadcn/ui/select";
import { cn } from "@utils/functions";
import React from "react";

function SearchSelectInput({
  placeHolder,
  label,
  items,
  isBorderBold,
  onChange,
  value,
  className,
  classNameValue,
  classNameItem,
  classNameContent,
  defaultValue,
  classNameSpan,
}: {
  defaultValue?: string;
  classNameContent?: string;
  classNameItem?: string;
  classNameSpan?: string;
  className?: string;
  classNameValue?: string;
  value?: string;
  onChange?: Function;
  label?: string;
  placeHolder?: string;
  isBorderBold?: boolean;
  items?: { value: string; label: string }[];
}) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={(value) => onChange && onChange(value)}
    >
      <SelectGroup className="w-full max-lg:text-sm">
        {label && (
          <SelectLabel className="lg:text-center text-white font-body mb-3 font-normal px-0 opacity-80">
            {label}
          </SelectLabel>
        )}
        <SelectTrigger
          className={cn(
            [
              `[&>span]:text-[12px] font-body border-secondary-color bg-transparent rounded-sm text-[rgba(255,255,255,0.4)]  capitalize ${
                isBorderBold
                  ? "focus:outline-none max-sm:rounded-md border max-sm:py-5 max-sm:bg-primary-color pl-8 justify-start border-[#6F6A5A] focus:shadow-none "
                  : "justify-center max-sm:py-6"
              }`,
            ],
            className
          )}
        >
          {value ? (
            <SelectValue
              className={"font-body " + classNameValue}
              placeholder={placeHolder}
            />
          ) : (
            <SelectValue>
              {value ? (
                value // Render the selected value if it exists
              ) : (
                <span
                  className={cn(["text-gray-500 font-body ", classNameSpan])}
                >
                  {placeHolder}
                </span> // Render the placeholder otherwise
              )}
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent
          className={"max-h-[300px] font-body " + classNameContent}
        >
          {items?.map((item, index) => (
            <SelectItem
              value={item.value}
              key={index}
              className={classNameItem}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}

export default SearchSelectInput;
