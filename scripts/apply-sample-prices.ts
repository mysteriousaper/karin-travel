// One-off: puts the SAMPLE_PRICES from prisma/seed-data.ts onto existing tours
// that have no price yet. Run: npx tsx scripts/apply-sample-prices.ts
import { PrismaClient } from '@prisma/client';
import { SAMPLE_PRICES } from '../prisma/seed-data';

async function main() {
  const db = new PrismaClient();
  for (const [slug, [price, currency]] of Object.entries(SAMPLE_PRICES)) {
    await db.tour.updateMany({ where: { slug, priceFrom: null }, data: { priceFrom: price, currency } });
  }
  console.log('sample prices applied');
  await db.$disconnect();
}

main();
