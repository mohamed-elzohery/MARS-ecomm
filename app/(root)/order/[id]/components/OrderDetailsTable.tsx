"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatOrderId } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  createPayPalOrder,
} from "@/lib/actions/order.actions";
import { toast } from "sonner";

const OrderDetailsTable = ({
  order,
  clientId,
}: {
  order: Omit<Order, "paymentResult">;
  clientId: string;
}) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const handleCreateOrder = async () => {
    const res = await createPayPalOrder(order);
    if (!res.success) return toast(res.message);
    return res.data;
  };
  const handleApproveOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast(res.message);
  };
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatOrderId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y ">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/{item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{itemsPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{taxPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{shippingPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{totalPrice}</div>
              </div>
              {!order.isPaid && (
                <PayPalScriptProvider options={{ clientId }}>
                  <PrintPayPalStatus />
                  <PayPalButtons
                    onApprove={handleApproveOrder}
                    createOrder={handleCreateOrder}
                  />
                </PayPalScriptProvider>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const PrintPayPalStatus = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  let status = "";
  if (isPending) {
    status = "Loading PayPal script...";
  } else if (isRejected) {
    status = "Error loading paypal";
  }
  return status;
};

export default OrderDetailsTable;
