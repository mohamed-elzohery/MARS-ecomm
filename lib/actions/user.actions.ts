'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paymentMethodSchema, shippingAddressSchema, signInEmailSchema, signUpEmailSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { PaymentMethod, ShippingAddress, UpdateUserData } from "@/types";
import { redirect } from "next/navigation";
import { extractErrorMessage } from "../server-utils";

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
    redirect('/')
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
};

export const updatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    try {
        const session = await auth();
        if(!session?.user?.id) return {
            success: false,
            message: "User not found"
        };
        const currentUser = await prisma.user.findUnique({where: {id: session.user.id}});
        if(currentUser === null) return {
            success: false,
            message: "User not found"
        };
        const method = paymentMethodSchema.parse(paymentMethod);
        await prisma.user.update({
            where: {id: session.user.id},
            data: {paymentMethod: method.type}
        });
        return {
            success: true,
            message: 'Payment method updated successfully'
        }
    } catch (error) {
        return {success: false, message: extractErrorMessage(error)}
    }
}

export const updateProfile = async (data: UpdateUserData) => {
    try{
        const session = await auth();
        if(session === null || !session.user?.id) throw new Error("User not authenticated");
        
         await prisma.user.update({
            where: {id: session.user.id},
            data: data
        });
        
        return {
            success: true,
            message: 'Profile updated successfully'
        }
    }catch(error){
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}


