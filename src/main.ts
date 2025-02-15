import * as fs from "node:fs";
import * as path from "node:path";
import { listNpmDependencies } from "./lib/npm";
import { determinePackageManager } from "./lib/package-manager";
import { pinDependencies } from "./lib/pin";
import { listPnpmDependencies } from "./lib/pnpm";

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
  const allDependencies = await (async () => {
    switch (packageManager) {
      case "npm":
        return listNpmDependencies();
      case "pnpm":
        return listPnpmDependencies();
    }
  })();

  // pin dependencies
  await pinDependencies(allDependencies);
};
