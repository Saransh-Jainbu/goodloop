// OWNER: Saransh. Run with `pnpm db:seed`. Also seeds demo events.
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

  await seedEvents();
}

// Demo listings owned by the demo organiser. Fixed ids make re-running safe (no duplicates),
// and dates are relative to today so they always look upcoming.
async function seedEvents() {
  const organiser = await db.user.findUniqueOrThrow({ where: { email: "organiser@goodloop.test" } });
  const at = (days: number, hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const events = [
    {
      id: "seed-blood-donation",
      title: "Community Blood Donation Camp",
      cause: "HEALTH",
      description:
        "Donate blood and save up to three lives. Trained staff run the camp, with refreshments afterwards. Please eat well beforehand and carry a photo ID. (Demo listing)",
      startsAt: at(4, 10), endsAt: at(4, 16),
      address: "Community Health Centre, Saket, New Delhi", lat: 28.5245, lng: 77.2066, capacity: 120,
    },
    {
      id: "seed-food-drive",
      title: "Weekend Food Distribution Drive",
      cause: "COMMUNITY",
      description:
        "Help pack and hand out meals to families in need. Volunteers sort donations, pack boxes and distribute them. No experience needed. (Demo listing)",
      startsAt: at(6, 9), endsAt: at(6, 12),
      address: "India Gate Lawns, Rajpath, New Delhi", lat: 28.6129, lng: 77.2295, capacity: 40,
    },
    {
      id: "seed-clothes-drive",
      title: "Winter Clothes Collection Drive",
      cause: "COMMUNITY",
      description:
        "Collect, sort and distribute warm clothes and blankets before winter. Bring clean, usable clothes to donate, or come to help sort. (Demo listing)",
      startsAt: at(9, 10), endsAt: at(9, 15),
      address: "Lajpat Nagar Central Market, New Delhi", lat: 28.5677, lng: 77.2433, capacity: 30,
    },
    {
      id: "seed-river-cleanup",
      title: "Yamuna Ghat Clean-up",
      cause: "ENVIRONMENT",
      description:
        "An early-morning clean-up of the riverbank. Gloves and bags are provided. Wear closed shoes and bring a water bottle. (Demo listing)",
      startsAt: at(5, 7), endsAt: at(5, 10),
      address: "Yamuna Ghat, Kashmere Gate, Delhi", lat: 28.6671, lng: 77.2285, capacity: 50,
    },
    {
      id: "seed-tutoring",
      title: "Free Weekend Tutoring for Kids",
      cause: "EDUCATION",
      description:
        "Spend a morning helping school children with maths, reading and homework. Patience matters more than expertise. (Demo listing)",
      startsAt: at(7, 11), endsAt: at(7, 13),
      address: "Community Library, Dwarka Sector 10, New Delhi", lat: 28.5823, lng: 77.05, capacity: 15,
    },
    {
      id: "seed-animal-shelter",
      title: "Animal Shelter Care Day",
      cause: "ANIMALS",
      description:
        "Help feed, walk and groom rescued animals, and clean their enclosures. Animal lovers of all ages are welcome. (Demo listing)",
      startsAt: at(11, 9), endsAt: at(11, 13),
      address: "Animal Shelter, Sarita Vihar, New Delhi", lat: 28.529, lng: 77.29, capacity: 20,
    },
    {
      id: "seed-tree-plantation",
      title: "Tree Plantation Drive",
      cause: "ENVIRONMENT",
      description:
        "Plant saplings with local residents and help keep them watered. Tools and saplings are provided. (Demo listing)",
      startsAt: at(14, 8), endsAt: at(14, 11),
      address: "Lodhi Garden, New Delhi", lat: 28.5931, lng: 77.2197, capacity: 60,
    },
    {
      id: "seed-senior-checkup",
      title: "Senior Citizens Health Check-up Support",
      cause: "HEALTH",
      description:
        "Support a free health check-up camp for senior citizens: guide visitors, help with forms and keep queues moving. (Demo listing)",
      startsAt: at(16, 9), endsAt: at(16, 14),
      address: "Community Hall, Rohini Sector 7, New Delhi", lat: 28.7041, lng: 77.1025, capacity: 25,
    },
  ] as const;

  for (const e of events) {
    const data = { ...e, status: "PUBLISHED" as const, organiserId: organiser.id };
    await db.event.upsert({ where: { id: e.id }, update: data, create: data });
  }
  console.log(`Seeded ${events.length} sample events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
