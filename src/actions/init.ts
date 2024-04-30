import { logger } from "@/services/logger";
import { initPackage } from "./init-package";
import { initRepo } from "./init-repo";
export async function init(name: string, options: InitOptions) {
  const { repo, cwd } = options;

  if (cwd) {
    logger.verbose(`Setting cwd to "${cwd}"`);
    process.chdir(`${cwd}`);
  }

  if (repo) {
    await initRepo(name, options);
  } else {
    await initPackage(name, options);
  }
}
