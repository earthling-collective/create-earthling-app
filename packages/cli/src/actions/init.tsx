import { initPackage } from "./init-package";
import { initRepo } from "./init-repo";
import shell from "shelljs";

export async function init(name: string, options: InitOptions) {
  const { repo, cwd, verbose } = options;

  if (cwd) {
    if (verbose) console.log(`Setting cwd to "${cwd}"`);
    shell.cd(cwd);
  }

  if (repo) {
    await initRepo(name, options);
  } else {
    await initPackage(name, options);
  }
}
