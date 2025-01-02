import { cn } from "@utils/functions";
import React from "react";

function NameHeading(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h5
      {...props}
      className={cn([
        `text-secondary-color uppercase mb-3 font-body ` + props.className,
      ])}
    ></h5>
  );
}

export default NameHeading;
