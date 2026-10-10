import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card border border-line/70 bg-white p-6 shadow-card", className)}
      {...props}
    />
  );
}
