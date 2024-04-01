import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initPackageSpa(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  console.log(`✅ SPA package "${name}" initialized`);
}
