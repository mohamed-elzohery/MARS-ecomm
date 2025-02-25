
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformToValidJSON = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value))
};

export const formatTwoDecimal = (value: string) => {
  const [int, dec] = value.split(".");
  return dec ? `${int}.${dec.padEnd(2, "0")}` : `${int}.00`;
} 

export const round2 = (value: string | number) => {
  if(typeof value === 'number'){
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}