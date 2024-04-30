import { logger } from "@/services/logger";
import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initPackageApp(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  logger.info(`✅ App package "${name}" initialized`);
}
