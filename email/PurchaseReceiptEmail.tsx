import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Order } from "@/types";
import { round2 } from "@/lib/utils";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Polo Sporting Stretch Shirt",
    slug: "polo-sporting-stretch-shirt",
    category: "Men's Dress Shirts",
    description: "Classic Polo style with modern comfort",
    images: [
      "/images/sample-products/p1-1.jpg",
      "/images/sample-products/p1-2.jpg",
    ],
    price: 59.99,
    brand: "Polo",
    rating: 4.5,
    numReviews: 10,
    stock: 5,
    isFeatured: true,
  },
  {
    name: "Brooks Brothers Long Sleeved Shirt",
    slug: "brooks-brothers-long-sleeved-shirt",
    category: "Men's Dress Shirts",
    description: "Timeless style and premium comfort",
    images: [
      "/images/sample-products/p2-1.jpg",
      "/images/sample-products/p2-2.jpg",
    ],
    price: 85.9,
    brand: "Brooks Brothers",
    rating: 4.2,
    numReviews: 8,
    stock: 10,
    isFeatured: true,
  },
  {
    name: "Tommy Hilfiger Classic Fit Dress Shirt",
    slug: "tommy-hilfiger-classic-fit-dress-shirt",
    category: "Men's Dress Shirts",
    description: "A perfect blend of sophistication and comfort",
    images: [
      "/images/sample-products/p3-1.jpg",
      "/images/sample-products/p3-2.jpg",
    ],
    price: 99.95,
    brand: "Tommy Hilfiger",
    rating: 4.9,
    numReviews: 3,
    stock: 0,
    isFeatured: false,
  },
  {
    name: "Calvin Klein Slim Fit Stretch Shirt",
    slug: "calvin-klein-slim-fit-stretch-shirt",
    category: "Men's Dress Shirts",
    description: "Streamlined design with flexible stretch fabric",
    images: [
      "/images/sample-products/p4-1.jpg",
      "/images/sample-products/p4-2.jpg",
    ],
    price: 39.95,
    brand: "Calvin Klein",
    rating: 3.6,
    numReviews: 5,
    stock: 10,
    isFeatured: false,
  },
  {
    name: "Polo Ralph Lauren Oxford Shirt",
    slug: "polo-ralph-lauren-oxford-shirt",
    category: "Men's Dress Shirts",
    description: "Iconic Polo design with refined oxford fabric",
    images: [
      "/images/sample-products/p5-1.jpg",
      "/images/sample-products/p5-2.jpg",
    ],
    price: 79.99,
    brand: "Polo",
    rating: 4.7,
    numReviews: 18,
    stock: 6,
    isFeatured: false,
  },
  {
    name: "Polo Classic Pink Hoodie",
    slug: "polo-classic-pink-hoodie",
    category: "Men's Sweatshirts",
    description: "Soft, stylish, and perfect for laid-back days",
    images: [
      "/images/sample-products/p6-1.jpg",
      "/images/sample-products/p6-2.jpg",
    ],
    price: 99.99,
    brand: "Polo",
    rating: 4.6,
    numReviews: 12,
    stock: 8,
    isFeatured: true,
  },
];

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main st",
      city: "New York",
      postalCode: "10001",
      country: "US",
    },
    createdAt: new Date(),
    totalPrice: "100",
    taxPrice: "10",
    shippingPrice: "10",
    itemsPrice: "80",
    orderItems: products.map((x) => ({
      name: x.name,
      orderId: "123",
      productId: "123",
      slug: x.slug,
      qty: x.stock,
      image: x.images[0],
      price: x.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
  },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

type OrderInformationProps = {
  order: Order;
};

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">{round2(order.totalPrice)}</Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderItems.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    {item.name} x {item.qty}
                  </Column>
                  <Column align="right" className="align-top">
                    {round2(item.price)}
                  </Column>
                </Row>
              ))}
              {[
                { name: "Items", price: order.itemsPrice },
                { name: "Tax", price: order.taxPrice },
                { name: "Shipping", price: order.shippingPrice },
                { name: "Total", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{round2(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
