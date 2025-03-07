import 'server-only'

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export const extractErrorMessage = (error: unknown) => {
  if(error instanceof ZodError){
    return error.errors.map((err) => err.message).join(", ");
  }
  // handle database errors
  if(error instanceof PrismaClientValidationError) return error.message;
  if(error instanceof PrismaClientKnownRequestError) return error.meta?.target + " already exists";
  return error instanceof Error ? error.message : "An error occurred";
}