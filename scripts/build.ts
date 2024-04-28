import { importTemplates } from "@/actions/import-templates";
import { logger } from "@/services/logger";
import { OUT_DIR } from "@/vars";

Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: OUT_DIR,
  target: "node",
}).then(async () => {
  logger.info(`build complete, importing templates`);
  await importTemplates();
});
