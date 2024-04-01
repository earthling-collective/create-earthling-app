import { importTemplates } from "@/actions/import-templates";
import { OUT_DIR } from "@/vars";

Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: OUT_DIR,
  target: "node",
}).then(async () => {
  console.log(`build complete, importing templates`);
  await importTemplates();
});
