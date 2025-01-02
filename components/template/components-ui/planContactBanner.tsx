import React, { ReactNode } from "react";
import Button from "./button";
import Paragraph from "./paragraph";
import { cn, pathNameByLocale } from "@utils/functions";

function PlanContactBanner({
  title,
  buttonText,
  buttonURL,
  description,
  classes,
  locale,
}: {
  locale?: any;
  title: string;
  buttonText: string;
  buttonURL: string;
  description: string;
  classes?: string;
}) {
  return (
    <div
      className={cn([
        "bg-quaternary-color py-10 px-32 flex justify-between items-center max-[1400px]:px-20 max-xl:px-10 max-lg:flex-col max-lg:items-start max-md:px-5 ",
        classes,
      ])}
    >
      <div className="">
        <h2
          className={`text-[60px] max-md:inline-block font-heading text-white mb-5 flex gap-1 whitespace-nowrap  max-md:text-[40px] max-sm:text-[33px] max-sm:flex-col max-sm:whitespace-normal max-sm:inline ${
            locale !== "en"
              ? "max-2xl:text-[45px] max-xl:text-[36px] flex-wrap"
              : "max-xl:text-[50px]"
          } `}
          dangerouslySetInnerHTML={{ __html: title }}
        ></h2>
        <Paragraph classes="opacity-1 w-[55%] m-0 max-lg:w-full max-sm:text-[13px] max-sm:mt-4 ">
          {description}
        </Paragraph>
      </div>
      <div className="max-lg:mt-5">
        <Button
          classes={locale !== "en" ? "text-[10px] !capitalize px-3" : ""}
          text={buttonText}
          redirect={pathNameByLocale(locale, buttonURL)}
        ></Button>
      </div>
    </div>
  );
}

export default PlanContactBanner;
