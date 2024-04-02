#!/usr/bin/env node

import { program } from "commander";
import pkg from "../package.json";
import { init } from "./actions/init";

console.log(`🧩 zabukit ${pkg.version}`);

program.name("🧩 zabukit").description("").version(pkg.version);

program
  .command("init")
  .argument("<name>")
  .option("-r, --repo")
  .option("-t, --template <template>")
  .option("--verbose")
  .option("--ci")
  .option("--cwd <path>")
  .action(init);

program
  .command("register")
  .argument("<url>")
  .action((url) => {
    console.log("REGISTER", url);
  });

program
  .command("unregister")
  .argument("<url>")
  .action((url) => {
    console.log("UNREGISTER", url);
  });

program
  .command("add")
  .argument("<component>")
  .action((component) => {
    console.log("Add", component);
  });

program
  .command("remove")
  .argument("<component>")
  .action((component) => {
    console.log("Remove", component);
  });

program.parse(process.argv);
