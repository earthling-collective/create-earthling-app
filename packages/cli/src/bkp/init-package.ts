#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "fs/promises";
import { join, resolve } from "path";
import { Stats, existsSync } from "fs";
import colors from "colors";
import { program } from "commander";
import { format } from "prettier";
import inquirer from "inquirer";

async function isEmpty(path: string) {
  return (await readdir(path)).length === 0;
}

async function emptyDir(dir: string) {
  if (!existsSync(dir)) return;
  const files = await readdir(dir);
  for (const file of files)
    await rm(resolve(dir, file), { recursive: true, force: true });
}

(async () => {
  const root = join(__dirname, ".");
  const templatesDir = join(root, "./templates");

  console.log(colors.green(colors.bold("create-earthling-app 🌎")));

  //map templates
  const templates: {
    name: string;
    path: string;
    stats: Stats;
    packageJson: Record<string, any>;
  }[] = (
    await Promise.all<any>(
      (await readdir(templatesDir)).map(async (name) => {
        const path = join(templatesDir, name);
        const stats = await stat(path);
        if (!stats.isDirectory()) return false;
        const packageJsonPath = join(path, "./package.json");
        if (!existsSync(packageJsonPath)) return false;
        try {
          const packageJson = JSON.parse(
            await readFile(packageJsonPath, "utf8")
          );
          return { name, path, stats, packageJson };
        } catch (err: any) {
          console.error(err);
          return false;
        }
      })
    )
  ).filter((x) => !!x);

  program
    .argument("[directory]", "Project slug")
    .option("-t, --template <template>", "Template")
    .parse(process.argv);

  //find answers
  const answers = {
    name: (
      program.args[0] ||
      (
        await inquirer.prompt({
          name: "name",
          message: "Project name:",
          type: "input",
          validate: (x) =>
            /^[a-z0-9\-]+$/gi.test(x)
              ? true
              : `Only "-" and alphanumeric characters allowed`,
        })
      ).name
    ).toLowerCase(),

    template:
      program.opts().template ||
      (
        await inquirer.prompt({
          name: "template",
          message: "Select a framework:",
          type: "list",
          choices: templates.map((x) => ({ name: x.name, value: x.name })),
        })
      ).template,
  };
  const template = templates.find((x) => x.name === answers.template);
  if (!template) throw new Error(`Template "${answers.template}" not found`);

  //ensure path
  const projectPath = join(process.cwd(), `./${answers.name.toLowerCase()}`);
  if (!existsSync(projectPath)) await mkdir(projectPath);

  //make sure directory is empty
  if (!(await isEmpty(projectPath))) {
    if (
      (
        await inquirer.prompt({
          name: "remove",
          message: `Target directory ${colors.bold(
            `"${answers.name}"`
          )} is not empty. Remove existing files and continue?`,
          type: "confirm",
        })
      ).remove
    )
      await emptyDir(projectPath);
    else {
      // if cancel, exit
      console.log(colors.red("❌ Cancelled"));
      process.exit(1);
    }
  }

  //copy template
  await cp(template.path, projectPath, { recursive: true });

  //override package.json
  const updatedPackage = template.packageJson;
  updatedPackage.name = answers.name;
  updatedPackage.version = "1.0.0-alpha.0";
  // remove unneeded fields
  delete updatedPackage.description;
  delete updatedPackage.license;
  delete updatedPackage.repository;
  delete updatedPackage.bugs;
  delete updatedPackage.author;
  //save updated package json
  await writeFile(
    resolve(projectPath, "./package.json"),
    await format(JSON.stringify(updatedPackage), { parser: "json" })
  );

  console.log(`Project created at ${colors.bold(`"${projectPath}"`)}`);
  console.log(colors.bgBlack(colors.blue(`cd ./${answers.name}; yarn;`)));
})();
