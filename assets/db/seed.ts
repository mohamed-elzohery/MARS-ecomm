import {PrismaClient} from '@prisma/client';
import sampleData from './sample-data';

const main = async () => {
    const prismaClient = new PrismaClient();
    await prismaClient.product.deleteMany();
    await prismaClient.product.createMany({data: sampleData.products});
    console.log("Data seeded successfully");
}
main()