import * as fs from "node:fs";
import * as path from "node:path";
import { npmList } from "./lib/npm";
import { determinePackageManager } from "./lib/package-manager";
import { pinDependencies } from "./lib/pin";

// biome-ignore lint/complexity/noBannedTypes:
export type Options = {};

export const main = async (options: Options) => {
  // read package.json
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.json not found");
  }

  // determine package manager
  const packageManager = await determinePackageManager();

  // get dependencies
  const dependencies = await (async () => {
    switch (packageManager) {
      case "npm":
        return npmList();
    }
  })();

  // pin dependencies
  await pinDependencies(dependencies);
};
