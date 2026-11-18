// OWNER: Saransh. Run with `pnpm db:seed`. Extend with sample events in Phase 3.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@goodloop.test";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-123";
  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", passwordHash, role: "ADMIN" },
  });
  await db.user.upsert({
    where: { email: "organiser@goodloop.test" },
    update: {},
    create: {
      email: "organiser@goodloop.test",
      name: "Demo Organiser",
      passwordHash: await bcrypt.hash("organiser-123", 10),
      role: "ORGANISER",
      organiserStatus: "APPROVED",
    },
  });
  console.log("Seeded admin + demo organiser");
}

main().finally(() => db.$disconnect());
