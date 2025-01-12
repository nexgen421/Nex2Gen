import React from "react";
import { cn } from "~/lib/utils";

export const Heading = ({
  level,
  children,
  className,
}: {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  // Define size and boldness based on the heading level
  const headingStyles = {
    1: "text-4xl font-bold",
    2: "text-3xl font-semibold",
    3: "text-2xl font-medium",
  };

  return React.createElement(
    HeadingTag,
    { className: cn(`my-4 ${headingStyles[level] || "text-xl"}`, className) },
    children,
  );
};
