import { program } from "commander";
import pkg from "../package.json";
import { init } from "./actions/init";
import { logger } from "./services/logger";
import { argv } from "process";

logger.info(`🌎 Create Earthling App ${pkg.version}`);

program
  .name("🌎")
  .description("")
  .version(pkg.version)
  .argument("<name>")
  .option("-r, --repo")
  .option("-t, --template <template>")
  .option("--verbose")
  .option("--ci")
  .option("--cwd <path>")
  .action(init);

program.parse(argv);
