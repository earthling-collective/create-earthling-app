import { join, relative } from "path";
import { analyzeHierarchy } from "./analyze-hierarchy";
import { initPackageSpa } from "./init-package-spa";
import { initPackageSsr } from "./init-package-ssr";
import { minimatch } from "minimatch";
import inquirer from "inquirer";
import shell from "shelljs";

export async function initPackage(name: string, options: InitOptions) {
  const { template = "default", ci, verbose } = options;

  //TODO this makes it possible to test in dev, should remove though
  shell.cd("../");

  const { packageDir } = await analyzeHierarchy({ verbose });

  //if workspaces are found, initialize as a workspace
  const workspaces = packageDir?.package?.workspaces;
  if (packageDir) {
    const relativePath = relative(
      packageDir.location,
      join(process.cwd(), `./${name}`)
    );

    if (verbose)
      console.log(
        `attemping to init package inside ${packageDir.package?.name} at "${relativePath}"`
      );

    const locationMatchesWorkspace =
      Array.isArray(workspaces) &&
      workspaces.some((x) => minimatch(relativePath, x));
    //if cwd is not registered as a workspace, ask the user whether that is ok or error out for CI
    if (!locationMatchesWorkspace) {
      const {
        allowNonWorkspaceLocation,
      }: { allowNonWorkspaceLocation: boolean } = ci
        ? { allowNonWorkspaceLocation: false }
        : await inquirer.prompt([
            {
              name: "allowNonWorkspaceLocation",
              message: `The location "${relativePath}" is not registered as a workspace under "${packageDir.package?.name}". Would you like to initiate the package here anyway?`,
              type: "confirm",
            },
          ]);

      if (!allowNonWorkspaceLocation)
        throw new Error(
          `"${relativePath}" is not a valid workspace location. check "${packageDir.location}/package.json" for details`
        );
    }
  }

  switch (template.toLocaleLowerCase()) {
    case "default":
    case "ssr":
      return await initPackageSsr(name, options);
    case "spa":
      return await initPackageSpa(name, options);
    default:
      throw new Error(
        `Template "${template}" not found. Try using "ssr" or "spa".`
      );
  }
}
