'use server'
import { CartItem } from "@/types"

export const addItemToCart = async (cartItem: CartItem) => {
    console.log(cartItem)
    return {
        success: true,
        message: 'item is added to cart '
    }
}