"use client";
import { cn } from "@utils/functions";
import React, { ReactNode, useRef, useState } from "react";

function Paragraph({
  children,
  htmlText,
  classes,
  isCollapsible,
}: {
  isCollapsible?: boolean;
  htmlText?: string;
  children?: ReactNode;
  classes?: string;
}) {
  const [textToggle, setTextToggle] = useState(false);
  const paraRef = useRef<HTMLDivElement>(null);
  return children ? (
    <p
      className={cn([
        "font-body 2xl:text-md max-2xl:text-sm text-white opacity-80 mb-5 leading-snug max-xl:text-[14px] ",
        classes,
      ])}
    >
      {children}
    </p>
  ) : (
    <>
      <div
        ref={paraRef}
        dangerouslySetInnerHTML={{
          __html: isCollapsible
            ? htmlText?.slice(0, textToggle ? htmlText.length : 400) ?? ""
            : htmlText ?? "",
        }}
        className={cn([
          `font-body link-color 2xl:text-md max-2xl:text-sm text-white opacity-80  leading-snug max-xl:text-[14px] ${
            isCollapsible &&
            paraRef?.current?.innerText &&
            paraRef?.current?.innerText?.length > 400
              ? "mb-1"
              : "mb-5"
          }`,
          htmlText && htmlText?.length > 400 && isCollapsible && textToggle
            ? " !line-clamp-none " + classes
            : " " + classes,
        ])}
      ></div>
      {isCollapsible && htmlText && htmlText?.length > 400 && (
        <p
          onClick={() => setTextToggle(!textToggle)}
          className="mb-5 text-secondary-color text-[12px] capitalize cursor-pointer underline font-body"
        >
          {!textToggle ? "read more" : "show less"}
        </p>
      )}
    </>
  );
}

export default Paragraph;
