declare type InitOptions = {
  repo?: boolean;
  template?: "spa" | "ssr";
  ci?: boolean;
  cwd?: string;
  verbose?: boolean;
};

declare type GenerateTemplateOptions = {
  repo?: boolean;
  template?: "pwa" | "spa" | "app";
  verbose?: boolean;
};
