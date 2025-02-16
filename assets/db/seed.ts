import {PrismaClient} from '@prisma/client';
import sampleData from './sample-data';

const main = async () => {
    const prismaClient = new PrismaClient();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.session.deleteMany();
    await prismaClient.verificationToken.deleteMany();
    await prismaClient.account.deleteMany();
    
    await prismaClient.product.createMany({data: sampleData.products});
    await prismaClient.user.createMany({data: sampleData.users});
    console.log("Data seeded successfully");
}
main()