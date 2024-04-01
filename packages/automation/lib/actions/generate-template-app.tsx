import shell from "shelljs";

export async function generateTemplateApp(options?: GenerateTemplateOptions) {
  //clear existing template
  shell.rm("-rf", `./template-app`);

  //run create cmd
  shell.exec(
    `yarn create expo-app -t expo-template-blank-typescript template-app`
  );

  console.log(`✅ App template generated`);
}
