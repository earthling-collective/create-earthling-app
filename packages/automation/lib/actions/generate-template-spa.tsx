import shell from "shelljs";

export async function generateTemplateSpa(options?: GenerateTemplateOptions) {
  //clear existing template
  shell.rm("-rf", `./template-spa`);

  //run create spa
  shell.exec(`yarn create vite template-spa --template react-ts`);

  console.log(`✅ SPA template generated`);
}
