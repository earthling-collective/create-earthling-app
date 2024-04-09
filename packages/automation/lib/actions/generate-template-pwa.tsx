import shell from "shelljs";

export async function generatePwaTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  shell.rm("rf", `./template-pwa`);

  //run create cmd
  shell.exec(
    `bun create next-app template-pwa --ts --tailwind --app --src-dir --no-eslint --no-tailwind --import-alias "@/*"`
  );

  console.log(`✅ PWA template generated`);
}
