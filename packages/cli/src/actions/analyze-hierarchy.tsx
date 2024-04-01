import { findUpMultiple, pathExistsSync } from "find-up";
import { readFileSync, existsSync } from "fs";
import merge from "lodash/merge";
import { join } from "path";
import type { PackageJson, PartialDeep } from "type-fest";
import { parse as parseYaml } from "yaml";

type ZabuKitRc = PartialDeep<{}>;

type Dir = {
  location: string;
  rc: ZabuKitRc | null;
  repo: GitRepo | null;
  package: PackageJson | null;
};

type GitRepo = {};

export async function analyzeHierarchy(options?: { verbose?: boolean }) {
  const { verbose } = options || {};

  let combinedRc: ZabuKitRc = {};

  let repoDir = null as Dir | null;
  let packageDir = null as Dir | null;

  let parents: Dir[] = (
    await findUpMultiple(
      (dir) =>
        pathExistsSync(join(dir, "package.json")) ||
        pathExistsSync(join(dir, ".zabukitrc")) ||
        pathExistsSync(join(dir, ".git/config"))
          ? dir
          : "",
      { type: "directory", cwd: process.cwd() }
    )
  )
    .map((location) => {
      let dir: Dir = {
        location,
        rc: null,
        repo: null,
        package: null,
      };

      //parse zabukit runtime configuration
      const rcPath = join(location, ".zabukitrc");
      if (existsSync(rcPath)) {
        const rc = parseYaml(readFileSync(rcPath).toString("utf-8"));

        //merge rcs
        combinedRc = merge(combinedRc, rc);

        dir = {
          ...dir,
          rc,
        };
      }

      //parse git repo information
      const repoPath = join(location, ".git/config");
      if (existsSync(repoPath)) {
        const repo = {};

        dir = {
          ...dir,
          repo,
        };

        if (!repoDir) repoDir = dir;
      }

      //parse package.json information
      const packagePath = join(location, "package.json");
      if (existsSync(packagePath)) {
        const pkg: PackageJson = JSON.parse(
          readFileSync(packagePath).toString("utf-8")
        );

        dir = {
          ...dir,
          package: pkg,
        };

        if (!packageDir) packageDir = dir;
      }

      return dir;
    })
    .filter((x) => !!x) as Dir[];

  if (verbose)
    console.log({
      cwd: process.cwd(),
      parents: parents.map((x) => x.location),
      packageDir: packageDir?.location,
      repoDir: repoDir?.location,
    });

  return {
    parents,
    packageDir,
    repoDir,
    combinedRc,
  };
}
