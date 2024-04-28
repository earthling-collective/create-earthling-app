import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initPackageApp(name: string, options: InitOptions) {
  const { ci } = options;

  const {} = await analyzeHierarchy();

  console.log(`✅ App package "${name}" initialized`);
}
