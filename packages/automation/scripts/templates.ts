#!/usr/bin/env node

import { cleanRepo } from "@/actions/clean-repo";
import { generateTemplate } from "@/actions/generate-template";
import { program } from "commander";
import pkg from "@/../package.json";

program.name("🤖").description("").version(pkg.version);

program
  .command("generate")
  .option("-t, --template <template>")
  .option("--verbose")
  .action(async (options) => {
    try {
      await generateTemplate(options);
      await cleanRepo();
    } catch (err) {
      console.error(`❌`, err);
    }
  });

program.command("test").action(async () => {
  try {
    //TODO
  } catch (err) {
    console.error(`❌`, err);
  }
});

program.parse(process.argv);
