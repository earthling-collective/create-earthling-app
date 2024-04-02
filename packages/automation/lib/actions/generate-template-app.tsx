import shell from "shelljs";

export async function generateAppTemplate(options?: GenerateTemplateOptions) {
  //clear existing template
  shell.rm("-rf", `./template-app`);

  //run create cmd
  shell.exec(
    `bun create expo-app --template expo-template-blank-typescript template-app`
  );

  console.log(`✅ App template generated`);
}
