import * as fs from "node:fs";
import * as path from "node:path";
import { listBunDependencies } from "./lib/bun";
import { listNpmDependencies } from "./lib/npm";
import { determinePackageManager } from "./lib/package-manager";
import { pinDependencies } from "./lib/pin";
import { listPnpmDependencies } from "./lib/pnpm";

export type Options = {
  lockfile?: string;
};

export const main = async (options: Options) => {
  // read package.json
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.json not found");
  }

  // determine package manager
  const packageManager = await determinePackageManager(options.lockfile);

  // get dependencies
  const allDependencies = await (async () => {
    switch (packageManager) {
      case "npm":
        return listNpmDependencies();
      case "pnpm":
        return listPnpmDependencies();
      case "bun":
        return listBunDependencies();
    }
  })();

  // pin dependencies
  await pinDependencies(allDependencies);
};
