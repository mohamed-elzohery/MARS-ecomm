import { APP_NAME } from "@/lib/constants";
import { Resend } from "resend";
import PurchaseReceiptEmail from "./PurchaseReceiptEmail";
import { Order } from "@/types";

const resend = new Resend(process.env.RESEND_API_SECRET);

export const sendPurchaseEmail = async (order: Order) => {
  await resend.emails.send({
    from: `${APP_NAME} ${process.env.RESEND_SENDER_EMAIL}`,
    subject: `Purchase Confirmation ${order.id}`,
    to: order.user.email,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
