import { cn } from "@utils/functions";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/10 dark:bg-gray-600/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
