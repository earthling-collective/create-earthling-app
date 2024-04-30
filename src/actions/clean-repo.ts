import { sortPackageJson } from "sort-package-json";
import glob from "fast-glob";
import { readFile, writeFile } from "fs/promises";
import { format } from "prettier";
import { REPO_DIR } from "@/vars";
import { logger } from "@/services/logger";

export async function cleanRepo() {
  await sortPackageJsons();
}

async function sortPackageJsons() {
  logger.info("Sorting repo package.jsons");

  process.chdir(`${REPO_DIR}`);

  const globbed = await glob(["./package.json", "templates/*/package.json"]);

  const result = await Promise.allSettled(
    globbed.map(async (x) => {
      logger.info(`sorting "${x}"`);
      let json: object = JSON.parse((await readFile(x)).toString("utf-8"));
      json = sortPackageJson(json);
      await writeFile(
        x,
        await format(JSON.stringify(json), { parser: "json" })
      );
    })
  );
  for (let r of result) if (r.status === "rejected") logger.info(r.reason);
}
