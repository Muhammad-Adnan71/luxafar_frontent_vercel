import React, { useEffect, useState } from "react";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import { useFormContext, useWatch } from "react-hook-form";
import ErrorText from "components/CMS/components-ui/form/errorText";
import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";

function FormRadio({
  options,
  name,
  defaultValue,
  classes,
  optionClasses,
  onChange,
}: {
  onChange?: (value: string) => void;
  optionClasses?: string;
  classes?: string;
  defaultValue?: string;
  name: string;
  options?: { label: string; value: string }[];
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useFormContext();
  const watchedValue = useWatch({ name });

  useEffect(() => {
    setSelectedValue(watchedValue || "");
  }, [watchedValue]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setSelectedValue("");
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <div className="relative">
      <RadioGroup
        onValueChange={(value: string) => {
          setValue(name, value);
          setSelectedValue(value);
          onChange && onChange(value);
        }}
        defaultValue={getValues(name)}
        className={`flex gap-x-[20px] max-lg:gap-x-[40px] flex-start flex-wrap mt-5 mb-5 ${
          options && options[0]?.label.length > 20 ? "flex-col" : ""
        } ${classes}`}
        value={selectedValue}
      >
        {options?.map((option, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-[20%] max-xl:w-[30%] max-lg:w-[40%] flex items-center gap-[15px] ${
                options && options[0]?.label.length > 20
                  ? "w-full max-xl:w-full max-lg:w-full"
                  : ""
              } ${optionClasses}`}
            >
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
                className="border-secondary-color min-w-[20px] min-h-[20px] border-[2px]"
              />
              <Label
                id={`${name}-${option.value}`}
                htmlFor={`${name}-${option.value}`}
                className="text-[11px] opacity-70 font-body"
              >
                {option.label}
              </Label>
            </div>
          </React.Fragment>
        ))}
      </RadioGroup>
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormRadio;
