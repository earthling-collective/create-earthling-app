import { program } from "commander";
import pkg from "../package.json";
import { init } from "./actions/init";
import { logger } from "./services/logger";

logger.info(`🌎 Create Earthling App ${pkg.version}`);

program.name("🌎").description("").version(pkg.version);

program
  .command("init")
  .argument("<name>")
  .option("-r, --repo")
  .option("-t, --template <template>")
  .option("--verbose")
  .option("--ci")
  .option("--cwd <path>")
  .action(init);
