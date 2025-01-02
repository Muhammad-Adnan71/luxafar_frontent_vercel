import { cn } from "@utils/functions";
import React, { ReactNode } from "react";

function MainHeading({
  children,
  classes,
  isHeadingH1 = false,
  locale,
}: {
  isHeadingH1?: boolean;
  children: string | ReactNode;
  classes?: String;
  locale?: any;
}) {
  return isHeadingH1 ? (
    <h1
      className={cn([
        `font-heading text-[86px] tracking-tight max-[1535px]:text-[80px] max-xl:text-[60px] max-lg:text-[52px] max-md:text-[44px] text-white capitalize ${
          locale === "ru"
            ? "max-[380px]:text-[30px] mb-10"
            : "max-[380px]:text-[38px]"
        }`,
        classes,
      ])}
      // dangerouslySetInnerHTML={{ __html: children }}
    >
      {typeof children === "string" ? (
        <span dangerouslySetInnerHTML={{ __html: children }}></span>
      ) : (
        children
      )}
    </h1>
  ) : (
    <h2
      className={cn([
        `font-heading text-[86px] tracking-tight max-[1535px]:text-[80px] max-xl:text-[60px] max-lg:text-[52px] max-md:text-[44px] text-white capitalize   ${
          locale === "ru"
            ? "max-[380px]:text-[30px] mb-10"
            : "max-[380px]:text-[38px]"
        }`,
        classes,
      ])}
      // dangerouslySetInnerHTML={{ __html: children }}
    >
      {typeof children === "string" ? (
        <span dangerouslySetInnerHTML={{ __html: children }}></span>
      ) : (
        children
      )}
    </h2>
  );
}

export default MainHeading;
