import { join } from "path";
import { readFile, readdir, stat, mkdir, cp, rm } from "fs/promises";
import { Stats, existsSync } from "fs";
import colors from "colors";
import { TEMPLATES_DIR, TEMPLATES_OUT_DIR } from "../vars";

export async function importTemplates() {
  //map templates
  const templates: {
    name: string;
    path: string;
    stats: Stats;
    packageJson: Record<string, any>;
  }[] = (
    await Promise.all<any>(
      (await readdir(TEMPLATES_DIR)).map(async (name) => {
        const path = join(TEMPLATES_DIR, name);
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
  console.log(`templates mapped`);

  //clean templates out dir
  if (existsSync(TEMPLATES_OUT_DIR))
    await rm(TEMPLATES_OUT_DIR, { recursive: true });
  await mkdir(TEMPLATES_OUT_DIR, { recursive: true });
  console.log(`templates out dir cleaned`);

  //copy templates
  await Promise.all(
    templates.map(async ({ name, path, packageJson, stats }) => {
      console.log(`copying template "${colors.bold(name)}"`);
      await cp(path, join(TEMPLATES_OUT_DIR, name), {
        recursive: true,
        errorOnExist: false,
        filter: (source) =>
          ![/node_modules/, /\.git\//, /\.yarn\//].some((x) => x.test(source)),
      });

      //replace template vars
    })
  );
}
