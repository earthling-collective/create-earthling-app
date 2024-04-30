import { logger } from "@/services/logger";
import { exec } from "@/util/exec";
import { $ } from "bun";
import { rm } from "node:fs/promises";

export async function generatePwaTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  await rm(`./template-pwa`, { recursive: true, force: true });

  //run create spa
  await exec(
    `bun --bun create next-app template-pwa --ts --tailwind --app --src-dir --no-eslint --no-tailwind --import-alias "@/*"`
  );

  //enter target
  process.chdir(`./template-pwa`);

  //initialize shadcn
  await exec(`npx shadcn-ui@latest init -d`);

  logger.info(`✅ PWA template generated`);
}
