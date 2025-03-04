'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { shippingAddressSchema, signInEmailSchema, signUpEmailSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/assets/db/prisma";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { ShippingAddress } from "@/types";
import { redirect } from "next/navigation";

export const signInEmail =async (prevState: unknown, formData: FormData) => {
    try {
        const user = signInEmailSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn('credentials', user);

        return {success: true, message: 'Signed in successfully'}
    } catch (error) {
        if(isRedirectError(error)) throw error;
        return {success: false, message: "Invalid email or password"}
    }
}

export const signOutUser = async () => {
    await signOut();
}

export const signUpEmail = async (prevState: unknown, formData: FormData) => {
    try {
        const user = signUpEmailSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });
        const plainPassword = user.password;
        user.password = hashSync(plainPassword, 10);
        await prisma.user.create({data: {name: user.name, password: user.password, email: user.email}});
        await signIn('credentials', 
          {
              email: user.email,
            password: plainPassword
          }
        );

        return {success: true, message: 'Signed up successfully'}
    } catch (error) {
        if(isRedirectError(error)) throw error;
        return {success: false, message: extractErrorMessage(error)}
    }
}

export const getUserByID = async (userId: string) => {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if(user === null) throw new Error("User not found");
    return user;
}
export const updateUserShippoinfAddress = async (address: ShippingAddress) => {
    try {
        const validatedAddress = shippingAddressSchema.parse(address);
        const session = await auth();
        if(session === null) redirect('/sign-in');
        const user = await prisma.user.update({
            where: {id: session.user?.id},
            data: {address: validatedAddress}
        });
        if(user === null) throw new Error("User not found");
        return {success: true, message: 'Shipping address updated successfully'}
    } catch (error) {
        return {success: false, message: extractErrorMessage(error)}
    }
}


// Utils
const extractErrorMessage = (error: unknown) =>  {
  if(error instanceof ZodError){
    return error.errors.map((err) => err.message).join(", ");
  }
// handle data base errors
if(error instanceof PrismaClientValidationError) return error.message;
  if(error instanceof PrismaClientKnownRequestError) return error.meta?.target + " already exists";
  return error instanceof Error ? error.message : "An error occurred";
}