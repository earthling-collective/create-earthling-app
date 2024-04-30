import { logger } from "@/services/logger";
import { exec } from "@/util/exec";
import { rm } from "fs/promises";

export async function generateAppTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  await rm(`./template-app`, { recursive: true, force: true });

  //run create cmd
  await exec(
    `bun create expo-app --template expo-template-blank-typescript template-app`
  );

  logger.info(`✅ App template generated`);
}
