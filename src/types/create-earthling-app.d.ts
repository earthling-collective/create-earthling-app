declare type TemplateId = "pwa" | "spa" | "app";

declare type InitOptions = {
  repo?: boolean;
  template?: TemplateId;
  ci?: boolean;
  cwd?: string;
  verbose?: boolean;
};

declare type GenerateTemplateOptions = {
  repo?: boolean;
  template?: TemplateId;
};
