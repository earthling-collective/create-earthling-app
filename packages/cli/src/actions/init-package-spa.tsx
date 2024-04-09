import { logger } from "@/services/logger";
import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initPackageSpa(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  logger.notice(`✅ SSR package "${name}" initialized`);
}
