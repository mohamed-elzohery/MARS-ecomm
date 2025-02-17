'user server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInEmailSchema } from "../validators";
import { signIn, signOut } from "@/auth";

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