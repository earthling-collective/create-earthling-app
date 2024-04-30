import { analyzeHierarchy } from "./analyze-hierarchy";
import { TEMPLATES_OUT_DIR } from "@/vars";
import { join } from "path";
import { type PackageJson } from "type-fest";
import { format } from "prettier";
import { logger } from "@/services/logger";
import { cp, mkdir, writeFile, readFile } from "node:fs/promises";

export async function initPackagePwa(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  //ensure target dir
  await mkdir(`./${name}`);

  //copy template files
  await cp(
    join(TEMPLATES_OUT_DIR, `./template-pwa/*`),
    join(process.cwd(), `./${name}/`),
    { recursive: true }
  );

  //enter target
  process.chdir(`./${name}`);

  //start update package json
  const updatedPackage = JSON.parse(
    await readFile(`package.json`, {
      encoding: `utf-8`,
    })
  ) as PackageJson;
  updatedPackage.name = name;
  updatedPackage.version = "1.0.0-alpha.0";
  // remove unneeded fields
  delete updatedPackage.description;
  delete updatedPackage.license;
  delete updatedPackage.repository;
  delete updatedPackage.bugs;
  delete updatedPackage.author;
  //save updated package json
  await writeFile(
    `./package.json`,
    await format(JSON.stringify(updatedPackage), { parser: "json" })
  );
  //end update package.json

  logger.info(`✅ PWA package "${name}" initialized`);
}
