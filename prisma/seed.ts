import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@toekomst.be";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
  } else {
    await prisma.adminUser.create({
      data: { email, passwordHash: hashPassword(password) },
    });
    console.log(`Created admin user ${email}.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
