import { join, relative } from "path";
import { analyzeHierarchy } from "./analyze-hierarchy";
import { minimatch } from "minimatch";
import inquirer from "inquirer";
import shell from "shelljs";
import { logger } from "@/services/logger";
import { initPackageSpa } from "./init-package-spa";
import { initPackagePwa } from "./init-package-pwa";
import { readdir } from "fs/promises";
import { existsSync } from "fs";

export async function initPackage(name: string, options: InitOptions) {
  const { template = "default", ci } = options;

  //TODO this makes it possible to test in dev, should remove though
  shell.cd("../");

  const { packageDir } = await analyzeHierarchy();
  const targetDir = join(process.cwd(), `/${name}`);

  //if workspaces are found, initialize as a workspace
  const workspaces = packageDir?.package?.workspaces;
  if (packageDir) {
    const relativePath = relative(packageDir.location, targetDir);

    logger.verbose(
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

  //check if dir exists and remove if confirmed
  if (existsSync(targetDir) && (await readdir(targetDir)).length > 1) {
    const shouldDeleteInitDir = ci
      ? true
      : (
          await inquirer.prompt([
            {
              name: "shouldDeleteDir",
              type: "confirm",
              message: `Content already exists at "${targetDir}". Would you like to delete these files before initializing a new project?`,
            },
          ])
        ).shouldDeleteDir;

    if (shouldDeleteInitDir) {
      await shell.rm(`-rf`, targetDir);
      logger.notice(`Content from "${targetDir}" has been deleted.`);
    }
  }

  switch (template.toLocaleLowerCase()) {
    case "pwa":
      return await initPackagePwa(name, options);
    case "spa":
      return await initPackageSpa(name, options);
    // case "app":
    //   return await initPackageSpa(name, options);
    default:
      throw new Error(
        `Template "${template}" not found. Try using "ssr" or "spa".`
      );
  }
}
