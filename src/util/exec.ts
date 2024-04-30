import { logger } from "@/services/logger";
import { exec as baseExec } from "node:child_process";

export function exec(command: string) {
  return new Promise<void>((resolve, reject) => {
    baseExec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        logger.info(stdout);
        resolve();
      }
    });
  });
}
