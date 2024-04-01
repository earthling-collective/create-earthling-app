import { analyzeHierarchy } from "./analyze-hierarchy";

export async function initRepo(
  name: string,
  options: { template?: string; ci?: boolean }
) {
  const { template = "default" } = options;

  const { repoDir } = await analyzeHierarchy();

  //block creation if parent repo exists (no sub-repos)
  if (repoDir != null)
    throw new Error(
      `Can not initialize a repo here. Parent repo found at "${repoDir.location}". Try another location.`
    );

  //

  //
  console.log(
    `✅ repo "${name}" initialized${
      template !== "default" ? ` using template "${template}"` : ``
    }`
  );
}
