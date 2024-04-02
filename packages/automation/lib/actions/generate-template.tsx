import shell from "shelljs";
import { TEMPLATES_DIR } from "@/vars";
import { generateSpaTemplate } from "./generate-template-spa";
import { generatePwaTemplate } from "./generate-template-pwa";
import { generateAppTemplate } from "./generate-template-app";
import { generateRepoTemplate } from "./generate-template-repo";

export async function generateTemplate(options?: GenerateTemplateOptions) {
  const { template, verbose } = options || {};

  if (verbose) console.log(`Templates dir: ${TEMPLATES_DIR}`);

  if (template) {
    shell.cd(TEMPLATES_DIR);

    switch (template.toLocaleLowerCase()) {
      case "pwa":
        return await generatePwaTemplate(options);
      case "spa":
        return await generateSpaTemplate(options);
      case "app":
        return await generateAppTemplate(options);
      case "repo":
        return await generateRepoTemplate(options);
      default:
        throw new Error(
          `Template "${template}" not found. Try using "pwa","spa" or "app".`
        );
    }
  } else {
    shell.cd(TEMPLATES_DIR);
    await generateRepoTemplate(options);

    shell.cd(TEMPLATES_DIR);
    await generateSpaTemplate(options);

    shell.cd(TEMPLATES_DIR);
    await generateAppTemplate(options);

    shell.cd(TEMPLATES_DIR);
    await generatePwaTemplate(options);
  }
}
