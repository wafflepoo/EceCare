import { cn } from "@/lib/utils";
import React from "react";

export const SmallCard = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <div className="w-full  md:w-1/3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className={cn("text-sm md:text-base", className)}>{value}</p>
    </div>
  );
};
