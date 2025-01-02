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
import React from "react";
import { cn } from "@utils/functions";

function SelectInput({
  placeHolder,
  items,
  classes,
  name,
  onChange,
  value,
  wrapperClass,
}: {
  name: string;
  placeHolder?: string;
  wrapperClass?: string;
  items?: { value: string; label: string }[];
  classes?: string;
  onChange?: Function;
  value: string;
}) {
  return (
    <Select
      name={name}
      value={value}
      onValueChange={(value) => onChange && onChange(value)}
    >
      <SelectGroup
        className={cn([
          "w-full max-lg:text-sm h-full input-wrapper",
          wrapperClass,
        ])}
      >
        <SelectTrigger
          className={cn([
            "bg-primary-color text-xs text-left text-[rgba(148,147,147,0.8)] block w-full border-[#6F6A5A] border rounded-md py-3 px-8 focus:outline-none focus:shadow-none  [&>.arrowIcon]:!right-[10px] h-[48px]",
            classes,
          ])}
        >
          {value ? (
            <SelectValue placeholder={placeHolder} />
          ) : (
            <SelectValue>
              {value ? (
                value // Render the selected value if it exists
              ) : (
                <span className="text-gray-500 font-body text-[14px] max-sm:!text-[12px]">
                  {placeHolder}
                </span> // Render the placeholder otherwise
              )}
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px] font-body">
          {items?.map((item, index) => (
            <SelectItem value={item.value} key={index}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}

export default SelectInput;
