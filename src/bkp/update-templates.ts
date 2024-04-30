import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
import micromatch from "micromatch";

const paths = {
  root: resolve(process.cwd(), "./"),
  templates: resolve(process.cwd(), "../../templates"),
};

const packageJsonDefaults = {
  version: "0.0.0",
  private: true,
};

const webTemplates = ["spa", "desktop", "ssr"];
const nativeTemplates = ["expo"];

type LibraryConfig = {
  templates?: string[]; //templates for which to include this package
  version?: string;
  dev?: boolean;
  setup?: (params: { templateName: string }) => Promise<void>;
};
const extraLibraries: Record<string, LibraryConfig> = {
  "@supabase/supabase-js": {},
  // "earthling-ui": {
  //   dev: true,
  // },
  "framer-motion": {
    templates: [...webTemplates],
  },
  immer: {},
  luxon: {},
  "@types/luxon": { dev: true },
  "use-immer": {},
  zod: {},
  zustand: {},
};

export async function updateTemplates() {
  await generate("ssr", {
    createCmd: `yarn create next-app ssr --ts --tailwind --app --src-dir --no-eslint --no-tailwind --import-alias "@/*"`,
  });
  await generate("spa", {
    createCmd: `yarn create vite spa --template react-ts`,
  });
  await generate("desktop", {
    createCmd: `yarn create @quick-start/electron desktop --template react-ts --skip`,
  });
  await generate("app", {
    createCmd: `yarn create expo-app -t expo-template-blank-typescript app`,
  });
}

type GeneratorOptions = {
  createCmd: string;
};

async function generate(name: string, options: GeneratorOptions) {
  console.log(`generating "${name}"`);

  //navigate to template folder
  shell.cd(paths.templates);

  //clear existing template
  shell.rm("-rf", `./${name}`);

  //run create vite
  await exec(options.createCmd);

  //navigate to specific template folder
  const templatePath = resolve(paths.templates, `./${name}`);
  shell.cd(templatePath);

  //read package.json
  const packageJsonPath = resolve(paths.templates, `./${name}/package.json`);
  let packageJson = JSON.parse(
    (await readFile(packageJsonPath)).toString("utf-8")
  );

  //merge package.json defaults
  packageJson = Object.assign({}, packageJson, packageJsonDefaults);
  packageJson.name = `${name}-template`;

  //save package.json
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, "  "));

  //install dependencies
  await exec(`yarn install --no-immutable`);

  //
  async function installLibraries(libraries: Record<string, LibraryConfig>) {
    //use yarn to pull latest
    await exec(
      `yarn add ${Object.entries(libraries)
        .map((x) => `${x[0]}${x[1].version ? `@${x[1].version}` : ``}`)
        .join(" ")}`
    );

    //custom setup fns
    for (let [name, def] of Object.entries(libraries)) {
      await def.setup?.({ templateName: name });
    }
  }

  //add addtl regular dependencies
  await installLibraries(
    Object.fromEntries(
      Object.entries(extraLibraries)
        .filter((x) => !x[1].dev) //is not dev
        .filter((x) => micromatch.any(name, x[1].templates || ["*"])) //matches template
    )
  );

  //add addtl dev dependencies
  await installLibraries(
    Object.fromEntries(
      Object.entries(extraLibraries)
        .filter((x) => x[1].dev) //is dev
        .filter((x) => micromatch.any(name, x[1].templates || ["*"])) //matches template
    )
  );

  shell.cd(paths.root);
}
