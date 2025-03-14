import {PrismaClient} from '@prisma/client';
import  { generateFakeData } from './sample-data';
import dotenv from 'dotenv';


const main = async () => {
    dotenv.config();
    const sampleData = await generateFakeData();
    const prismaClient = new PrismaClient();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.session.deleteMany();
    await prismaClient.verificationToken.deleteMany();
    await prismaClient.account.deleteMany();
    await prismaClient.order.deleteMany();
    await prismaClient.orderItem.deleteMany();
    await prismaClient.cart.deleteMany();
    
    await prismaClient.product.createMany({data: sampleData.products});
    await prismaClient.user.createMany({data: sampleData.users});
    console.log("Data seeded successfully");
}
main()