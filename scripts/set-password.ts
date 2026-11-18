// Sets a user's password without the password ever appearing in chat, shell history or logs.
// Usage: pnpm db:set-password <email>
// Reads DATABASE_URL from .env (Prisma loads it). Run it against the database you intend to change.
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** One readline session for all prompts; hides typing when attached to a terminal. */
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
let hidden = false;
if (process.stdin.isTTY) {
  const w = rl as unknown as { _writeToOutput: (s: string) => void };
  const original = w._writeToOutput.bind(rl);
  w._writeToOutput = (s: string) => {
    if (!hidden) original(s);
  };
}
const lines: string[] = [];
const waiting: ((l: string) => void)[] = [];
rl.on("line", (l) => (waiting.shift() ?? ((x: string) => lines.push(x)))(l));

function ask(prompt: string): Promise<string> {
  process.stdout.write(prompt);
  hidden = true;
  return new Promise((resolve) => {
    const done = (l: string) => {
      hidden = false;
      if (process.stdin.isTTY) process.stdout.write("\n");
      resolve(l);
    };
    const queued = lines.shift();
    if (queued !== undefined) done(queued);
    else waiting.push(done);
  });
}

async function main() {
  const email = process.argv[2]?.toLowerCase();
  if (!email) throw new Error("Usage: pnpm db:set-password <email>");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error(`No user with email ${email}`);

  const password = await ask(`New password for ${email} (min 12 characters): `);
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");
  if (password.length > 72) throw new Error("Password must be at most 72 characters (bcrypt limit).");
  const again = await ask("Repeat the password: ");
  if (again !== password) throw new Error("Passwords do not match.");

  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  console.log(`Password updated for ${email}.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
    return db.$disconnect();
  });
