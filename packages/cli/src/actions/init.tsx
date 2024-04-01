import { initPackage } from "./init-package";
import { initRepo } from "./init-repo";

export async function init(name: string, options: InitOptions) {
  const { repo } = options;

  if (repo) {
    await initRepo(name, options);
  } else {
    await initPackage(name, options);
  }
}
