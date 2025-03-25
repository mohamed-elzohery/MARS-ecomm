export const APP_NAME = process.env.APP_NAME || "MARS STORE";
export const APP_DESCRIPTION = process.env.APP_DESCRIPTION || "MARS CLOTHING BRAND";
export const SERVER_URL = `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = process.env.LATEST_PRODUCTS_LIMIT || 4;
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(", ") : ["Stripe", "PayPal", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD ? process.env.DEFAULT_PAYMENT_METHOD: "PayPal";
export const PAGE_SIZE = process.env.PAGE_SIZE || 10;
export const USER_ROLES = process.env.USER_ROLES?.split(",") || ["user", "admin"];