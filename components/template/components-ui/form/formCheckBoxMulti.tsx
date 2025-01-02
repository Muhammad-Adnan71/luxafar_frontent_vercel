import React from "react";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import { useFormContext, Controller } from "react-hook-form";
import ErrorText from "components/CMS/components-ui/form/errorText";
import { Checkbox } from "components/CMS/components-ui/shadcn/ui/checkbox";

function FormCheckboxMulti({
  options,
  name,
  defaultValue = [],
  onChange,
}: {
  onChange?: (value: string) => void;
  defaultValue?: string[];
  name: string;
  options?: { label: string; value: string }[];
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleCheckboxChange = (
    value: string,
    checked: boolean,
    field: any
  ) => {
    const newValue = checked
      ? [...(field.value || []), value]
      : (field.value || []).filter((v: string) => v !== value);

    setValue(name, newValue);
    onChange && onChange(value);
  };

  return (
    <div
      className={`relative flex gap-x-[20px] max-lg:gap-x-[40px] gap-y-2 flex-start flex-wrap mt-5 mb-5 ${
        options && options[0]?.label.length > 20 ? "flex-col gap-y-2" : ""
      }`}
    >
      {options?.map((item, index) => (
        <div
          key={index}
          className={`w-[20%] max-xl:w-[30%] max-lg:w-[40%] flex items-center gap-[15px] ${
            options && options[0]?.label.length > 20 ? "w-full" : ""
          }`}
        >
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <Checkbox
                className="border-secondary-color min-w-[20px] min-h-[20px] border-[2px] rounded-full"
                id={`r${item.value}`}
                checked={(field.value || []).includes(item.value)}
                onCheckedChange={(checked: any) =>
                  handleCheckboxChange(item.value, checked, field)
                }
              />
            )}
          />
          <Label
            htmlFor={`r${item.value}`}
            className="text-[11px] opacity-70 font-body"
          >
            {item.label}
          </Label>
        </div>
      ))}
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormCheckboxMulti;
