import shell from "shelljs";
import { TEMPLATES_DIR } from "@/vars";
import { generateTemplateSpa } from "./generate-template-spa";
import { generateTemplatePwa } from "./generate-template-pwa";
import { generateTemplateApp } from "./generate-template-app";

export async function generateTemplate(options?: GenerateTemplateOptions) {
  const { template, verbose } = options || {};

  if (verbose)
    console.log(`Setting working dir to templates dir (${TEMPLATES_DIR})`);
  shell.cd(TEMPLATES_DIR);

  if (template) {
    switch (template.toLocaleLowerCase()) {
      case "pwa":
        return await generateTemplatePwa(options);
      case "spa":
        return await generateTemplateSpa(options);
      case "app":
        return await generateTemplateApp(options);
      default:
        throw new Error(
          `Template "${template}" not found. Try using "pwa","spa" or "app".`
        );
    }
  } else {
    await Promise.allSettled([
      generateTemplateSpa(options),
      generateTemplateApp(options),
      generateTemplatePwa(options),
    ]);
  }
}
