import { cn } from "@utils/functions";
import React, { ReactNode } from "react";

function Subheading({
  children,
  classes,
}: {
  children: ReactNode;
  classes?: String;
}) {
  return (
    <h3
      className={cn([
        "font-heading text-[28px] text-secondary-color capitalize mb-5 ",
        classes,
      ])}
    >
      {typeof children === "string" ? (
        <span dangerouslySetInnerHTML={{ __html: children }}></span>
      ) : (
        children
      )}
    </h3>
  );
}

export default Subheading;
