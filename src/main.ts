import * as fs from "node:fs";
import * as path from "node:path";
import { listBunDependencies } from "./lib/bun";
import { Color } from "./lib/color";
import { listNpmDependencies } from "./lib/npm";
import {
  detectPackageManager,
  pinDependencies,
  runInstall,
} from "./lib/package-manager";
import { listPnpmDependencies } from "./lib/pnpm";
import { withSpinner } from "./lib/spinner";

export type Options = {
  lockfile?: string;
  install?: boolean;
};

export const main = async (options: Options) => {
  // read package.json
  await withSpinner({ start: "Reading package.json" }, async () => {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found");
    }
  });

  // determine package manager
  const { packageManager, lockfile } = await withSpinner(
    {
      start: "Detecting package manager",
      result: ({ packageManager }) => packageManager,
    },
    async () => {
      return await detectPackageManager(options.lockfile);
    },
  );

  // get dependencies
  const allDependencies = await withSpinner(
    {
      start: `Extracting dependencies from ${lockfile}`,
      result: (dependencies) =>
        `${Object.keys(dependencies).length} dependencies`,
    },
    async () => {
      switch (packageManager) {
        case "npm":
          return listNpmDependencies();
        case "pnpm":
          return listPnpmDependencies();
        case "bun":
          return listBunDependencies();
      }
    },
  );

  // pin dependencies
  await withSpinner(
    {
      start: "Pinning dependencies",
      result: (pinnedDependencies) => {
        if (pinnedDependencies.length === 0) {
          return "All dependencies are already pinned";
        }

        return pinnedDependencies.map(
          (dependency) =>
            `${dependency.name} (${new Color(dependency.prev).red()} -> ${new Color(dependency.pinned).green()})`,
        );
      },
    },
    async () => pinDependencies(allDependencies),
  );

  // run install command
  if (options.install) {
    await runInstall(packageManager);
  }
};
