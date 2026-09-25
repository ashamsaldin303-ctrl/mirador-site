// MIRADOR — DB BOOT GUARD (loop2, D2's recommendation): the sandbox container
// gets rebuilt/restarted on OOM and has twice shipped a wiped custom.db with
// the dev server booting green — an EMPTY SITE served silently. This guard
// runs before `next dev`: if the menu tables are empty it re-seeds
// deterministically (prisma/seed.ts is idempotent — it upserts its fixed
// slugs), then logs loudly either way. Guard failures never block boot:
// a broken guard must not take the site down — it warns and exits 0.
//
// TYPE-ONLY NOTE (loop2-I2r): this file executes under the Bun runtime,
// whose globals (Bun.spawn, import.meta.dir) the project's dom/esnext tsc
// libs do not know — the declaration below is an ambient TYPE shim with
// zero runtime impact, so `bunx tsc --noEmit` stays green for the tree.
import { PrismaClient } from "@prisma/client";

declare const Bun: {
  spawn: (
    cmd: string[],
    opts: { cwd?: string; stdout?: string; stderr?: string },
  ) => { exited: Promise<number> };
};

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.menuSection.count().catch(() => -1);
  if (sections === -1) {
    console.warn("[db-guard] could not read DB — skipping (server will surface errors)");
    return;
  }
  if (sections > 0) {
    console.log(`[db-guard] OK — ${sections} menu sections present`);
    return;
  }
  console.warn("[db-guard] EMPTY DATABASE DETECTED — re-seeding…");
  const proc = Bun.spawn(["bun", "prisma/seed.ts"], {
    cwd: (import.meta as ImportMeta & { dir: string }).dir + "/..",
    stdout: "inherit",
    stderr: "inherit",
  });
  await proc.exited;
}

main()
  .catch((e) => {
    console.warn("[db-guard] non-fatal failure:", e);
  })
  .finally(() => prisma.$disconnect());
