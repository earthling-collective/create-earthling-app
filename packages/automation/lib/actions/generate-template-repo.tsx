import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import shell from "shelljs";
import type { PackageJson } from "type-fest";

export async function generateRepoTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  shell.rm("-rf", `./template-repo`);

  //
  shell.mkdir(`template-repo`);
  shell.cd(`./template-repo/`);

  //run create cmd
  shell.exec(`bun init --yes`);

  //
  shell.rm("./index.ts");
  shell.mkdir("packages/");

  //start package.json editing
  const pkg = JSON.parse(
    (await readFile("./package.json")).toString("utf-8")
  ) as PackageJson;

  delete pkg.module;
  delete pkg.type;
  pkg.workspaces = ["/packages/*"];

  await writeFile("./package.json", JSON.stringify(pkg));
  //end package.json editing

  console.log(`✅ Repo template generated`);
}
