import { program } from "commander";
import pkg from "@/../package.json";
import { cleanRepo } from "@/actions/clean-repo";

program.name("🤖:repo").description("").version(pkg.version);

program.command("clean").action(async () => {
  try {
    await cleanRepo();
  } catch (err) {
    console.error(`❌`, err);
  }
});

program.parse(process.argv);
