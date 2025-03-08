
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
};

export const formatOrderId = (orderId: string) => {
  return `..${orderId.substring(orderId.length - 6)}`
}

export const formatDateTime = (date: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }
  const formattedDateTime = new Date(date).toLocaleString('en-US', dateTimeOptions);
  const formattedDate = new Date(date).toLocaleString('en-US', dateOptions);
  const formattedTime = new Date(date).toLocaleString('en-US', timeOptions);

  return {
    dateTime: formattedDateTime,
    date: formattedDate,
    time: formattedTime
  }
}

