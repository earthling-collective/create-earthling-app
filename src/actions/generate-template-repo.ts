import { logger } from "@/services/logger";
import { exec } from "@/util/exec";
import { writeFile, readFile, rm, mkdir, exists } from "fs/promises";
import type { PackageJson } from "type-fest";

export async function generateRepoTemplate(options?: GenerateTemplateOptions) {
  //clear existing template]
  await rm(`./template-repo`, { recursive: true, force: true });

  await mkdir(`template-repo`);
  process.chdir(`./template-repo`);

  //run create cmd
  await exec(`bun init --yes`);

  //
  await rm(`./index.ts`);
  if (!exists(`packages`)) await mkdir(`packages`);

  //start package.json editing
  const pkg = JSON.parse(
    (await readFile("./package.json")).toString("utf-8")
  ) as PackageJson;

  delete pkg.module;
  delete pkg.type;
  pkg.workspaces = ["/packages/*"];

  await writeFile("./package.json", JSON.stringify(pkg));
  //end package.json editing

  logger.info(`✅ Repo template generated`);
}
