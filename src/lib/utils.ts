import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deliveryMilestoneFormat(dm: string | undefined | null) {
  if (dm === undefined || dm === null) return null;

  const words = dm.split("_");
  const result = words.join(" ");
  return result;
}

const colors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
];

export const getRandomColor = (lastColor: string | null) => {
  let newColor;
  do {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  } while (newColor === lastColor);
  return newColor;
};
