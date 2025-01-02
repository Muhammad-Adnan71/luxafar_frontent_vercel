import Button from "@template-components/button";
import SectionHeading from "@template-components/sectionHeading";
import { cn, pathNameByLocale } from "@utils/functions";
import React, { ReactNode } from "react";

function SectionTitleHeader({
  title,
  buttonText,
  buttonURL,
  classes,
  mainHeadingClasses,
  isHeadingAnimated,
  buttonClick,
  locale,
}: {
  buttonClick?: any;
  classes?: string;
  title: string | ReactNode;
  buttonText?: string;
  buttonURL?: string;
  mainHeadingClasses?: string;
  isHeadingAnimated?: boolean;
  locale?: any;
}) {
  return (
    <div className={cn(["flex justify-between items-end", classes])}>
      <SectionHeading
        isHeadingAnimated={isHeadingAnimated}
        classes={cn([
          "w-[60%] max-xl:w-[70%] max-md:w-full ",
          mainHeadingClasses,
        ])}
      >
        {typeof title === "string" ? (
          <span dangerouslySetInnerHTML={{ __html: title }}></span>
        ) : (
          title
        )}
      </SectionHeading>
      {buttonText && (
        <Button
          onClick={buttonClick}
          text={buttonText}
          redirect={pathNameByLocale(locale, buttonURL as string)}
          classes={` ${
            locale !== "en" ? "text-[10px] !capitalize px-3" : ""
          } max-md:hidden `}
        ></Button>
      )}
    </div>
  );
}

export default SectionTitleHeader;
