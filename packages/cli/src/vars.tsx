import { join } from "path";

export const PACKAGE_DIR = process.env.PACKAGE_DIR || process.cwd();

export const REPO_DIR = process.env.REPO_DIR || join(process.cwd(), "../../");
export const TEMPLATES_DIR =
  process.env.TEMPLATES_DIR || join(REPO_DIR, "./templates");

export const OUT_DIR = process.env.OUT_DIR || join(PACKAGE_DIR, "./dist");
export const TEMPLATES_OUT_DIR =
  process.env.TEMPLATES_DIR || join(OUT_DIR, "./templates");
