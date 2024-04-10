import { $ } from "bun";

export async function generatePwaTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  await $`rm -rf template-pwa`;

  //run create cmd
  await $`bun --bun create next-app template-pwa --ts --tailwind --app --src-dir --no-eslint --no-tailwind --import-alias "@/*"`;

  //enter target
  await $`cd template-pwa`;

  //initialize shadcn
  await $`bun --bun x shadcn-ui@latest init -d`;

  console.log(`✅ PWA template generated`);
}
