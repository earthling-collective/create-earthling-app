import { TEMPLATES_DIR } from "@/vars";
import { generateSpaTemplate } from "./generate-template-spa";
import { generatePwaTemplate } from "./generate-template-pwa";
import { generateAppTemplate } from "./generate-template-app";
import { generateRepoTemplate } from "./generate-template-repo";
import { logger } from "@/services/logger";

export async function generateTemplate(options?: GenerateTemplateOptions) {
  const { template } = options || {};

  logger.info(`templates dir: ${TEMPLATES_DIR}`);

  if (template) {
    logger.info(`generating template "${template}"`);

    process.chdir(`${TEMPLATES_DIR}`);

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
    logger.info(`generating all templates`);

    process.chdir(`${TEMPLATES_DIR}`);
    await generateRepoTemplate(options);

    process.chdir(`${TEMPLATES_DIR}`);
    await generateSpaTemplate(options);

    process.chdir(`${TEMPLATES_DIR}`);
    await generateAppTemplate(options);

    process.chdir(`${TEMPLATES_DIR}`);
    await generatePwaTemplate(options);
  }
}
