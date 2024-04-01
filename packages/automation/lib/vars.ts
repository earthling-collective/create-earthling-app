import { join } from "path";

export const REPO_DIR = process.env.REPO_DIR || join(process.cwd(), "../../");

export const TEMPLATES_DIR =
  process.env.TEMPLATES_DIR || join(REPO_DIR, "./templates");
