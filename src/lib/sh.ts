import { exec } from "node:child_process";

export const sh = async (command: string, args: string[]): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    exec(
      `${command} ${args
        .map((arg) => `"${arg.replaceAll('"', '\\"')}"`)
        .join(" ")}`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      },
    );
  });
};
