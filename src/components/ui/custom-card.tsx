import React from "react";
import { cn } from "~/lib/utils";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({ children, className }) => {
  return (
    <div className={cn("w-full rounded-lg p-2", className)}>{children}</div>
  );
};

export default CustomCard;
