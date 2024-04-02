import { mkdir } from "fs/promises";
import { analyzeHierarchy } from "./analyze-hierarchy";
import shell from "shelljs";
import { TEMPLATES_OUT_DIR } from "@/vars";
import { join } from "path";

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
  shell.cp("-r", join(TEMPLATES_OUT_DIR, "template-repo"), `./${name}`);

  //
  console.log(
    `✅ repo "${name}" initialized${
      template !== "default" ? ` using template "${template}"` : ``
    }`
  );
}
