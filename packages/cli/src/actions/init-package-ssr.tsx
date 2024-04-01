import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initPackageSsr(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  console.log(`✅ SSR package "${name}" initialized`);
}
