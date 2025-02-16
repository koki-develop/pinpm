import * as fs from "node:fs";
import * as path from "node:path";
import PackageJson from "@npmcli/package-json";
import { sh } from "./sh";
import { withSpinner } from "./spinner";

export type PackageManager = "npm" | "pnpm" | "bun";
export type Lockfile = (typeof lockFiles)[number];

const lockFiles = [
  // npm
  "package-lock.json",
  // pnpm
  "pnpm-lock.yaml",
  // bun
  "bun.lock",
  "bun.lockb",
] as const;

export const detectPackageManager = async (
  lockfile?: string,
): Promise<{
  packageManager: PackageManager;
  lockfile: string;
}> => {
  const foundLockfile = _findLockfile(lockfile);
  const packageManager = (() => {
    switch (foundLockfile) {
      case "package-lock.json":
        return "npm";
      case "pnpm-lock.yaml":
        return "pnpm";
      case "bun.lock":
      case "bun.lockb":
        return "bun";
    }
  })();

  return {
    packageManager,
    lockfile: foundLockfile,
  };
};

export type PinnedDependency = {
  name: string;
  prev: string;
  pinned: string;
};

export const pinDependencies = async (
  allDependencies: Record<string, string>,
): Promise<PinnedDependency[]> => {
  const pinnedDependencies: PinnedDependency[] = [];

  // load package.json
  const packageJson = new PackageJson();
  await packageJson.load(process.cwd());

  // pin dependencies
  if (packageJson.content.dependencies) {
    const dependencies: Record<string, string> = Object.entries(
      packageJson.content.dependencies,
    ).reduce(
      (acc, [name, prev]) => {
        const pinned = allDependencies[name];
        if (prev !== pinned) {
          pinnedDependencies.push({ name, prev, pinned });
        }

        acc[name] = pinned;
        return acc;
      },
      {} as Record<string, string>,
    );

    packageJson.update({ dependencies });
  }

  // pin dev dependencies
  if (packageJson.content.devDependencies) {
    const devDependencies: Record<string, string> = Object.entries(
      packageJson.content.devDependencies,
    ).reduce(
      (acc, [name, prev]) => {
        const pinned = allDependencies[name];
        if (prev !== pinned) {
          pinnedDependencies.push({ name, prev, pinned });
        }

        acc[name] = pinned;
        return acc;
      },
      {} as Record<string, string>,
    );

    packageJson.update({ devDependencies });
  }

  // save package.json
  await packageJson.save();

  return pinnedDependencies;
};

export const runInstall = async (packageManager: PackageManager) => {
  switch (packageManager) {
    case "npm":
      await withSpinner(
        { start: "Installing dependencies with `npm install`" },
        async () => {
          await sh("npm", ["install"]);
        },
      );
      break;
    case "pnpm":
      await withSpinner(
        { start: "Installing dependencies with `pnpm install`" },
        async () => {
          await sh("pnpm", ["install"]);
        },
      );
      break;
    case "bun":
      await withSpinner(
        { start: "Installing dependencies with `bun install`" },
        async () => {
          await sh("bun", ["install"]);
        },
      );
      break;
  }
};

const _findLockfile = (lockfile?: string): Lockfile => {
  if (lockfile) {
    const absolutePath = path.resolve(process.cwd(), lockfile);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`${lockfile} not found`);
    }

    const dirname = path.dirname(absolutePath);
    if (dirname !== process.cwd()) {
      throw new Error(`${lockfile} does not exist in the current directory`);
    }

    const filename = path.basename(absolutePath);
    switch (filename) {
      case "package-lock.json":
      case "pnpm-lock.yaml":
      case "bun.lock":
      case "bun.lockb":
        return filename;
      default:
        throw new Error(
          `Unsupported lockfile: ${filename}\npinpm currently only supports: ${lockFiles.join(", ")}`,
        );
    }
  }

  const foundLockfiles = lockFiles.filter((lockfile) => {
    return fs.existsSync(path.resolve(process.cwd(), lockfile));
  });
  if (foundLockfiles.length === 0) {
    throw new Error(
      `No supported lockfile found\npinpm currently only supports: ${lockFiles.join(", ")}`,
    );
  }
  if (foundLockfiles.length > 1) {
    throw new Error(`Multiple lockfiles found: ${foundLockfiles.join(", ")}`);
  }

  return foundLockfiles[0];
};
