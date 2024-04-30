import { logger } from "@/services/logger";
import { exec } from "@/util/exec";
import { rm } from "node:fs/promises";

export async function generateSpaTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  await rm(`template-spa`, { recursive: true, force: true });

  //run create spa
  //TODO: running this with bun creates an empty template?
  await exec(`yarn create vite template-spa --template react-ts`);

  process.chdir("./template-spa");

  await exec(`bun --bun i`);

  logger.info(`✅ SPA template generated`);
}
