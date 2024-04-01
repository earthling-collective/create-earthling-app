import { build } from "tsup";
import { importTemplates } from "@/actions/import-templates";

//run tsup
build({
  entry: ["./src/index.ts"],
  format: ["cjs"],
}).then(async () => {
  console.log(`tsup finished`);

  await importTemplates();
});
