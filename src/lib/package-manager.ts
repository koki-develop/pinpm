import * as fs from "node:fs";
import * as path from "node:path";
import PackageJson from "@npmcli/package-json";
import { sh } from "./sh";

export type PackageManager = "npm" | "pnpm" | "bun";

const lockFiles = [
  // npm
  "package-lock.json",
  // pnpm
  "pnpm-lock.yaml",
  // bun
  "bun.lock",
  "bun.lockb",
] as const;

export const determinePackageManager = async (
  lockfile?: string,
): Promise<PackageManager> => {
  if (lockfile) {
    const absolutePath = path.resolve(process.cwd(), lockfile);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`${absolutePath} not found`);
    }

    const dirname = path.dirname(absolutePath);
    if (dirname !== process.cwd()) {
      throw new Error(`${lockfile} does not exist in the current directory`);
    }

    const filename = path.basename(absolutePath);
    switch (filename) {
      case "package-lock.json":
        return "npm";
      case "pnpm-lock.yaml":
        return "pnpm";
      case "bun.lock":
      case "bun.lockb":
        return "bun";
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

  const foundLockfile = foundLockfiles[0];
  switch (foundLockfile) {
    case "package-lock.json":
      return "npm";
    case "pnpm-lock.yaml":
      return "pnpm";
    case "bun.lock":
    case "bun.lockb":
      return "bun";
  }
};

export const pinDependencies = async (
  allDependencies: Record<string, string>,
) => {
  // load package.json
  const packageJson = new PackageJson();
  await packageJson.load(process.cwd());

  // pin dependencies
  if (packageJson.content.dependencies) {
    const dependencies: Record<string, string> = Object.fromEntries(
      Object.keys(packageJson.content.dependencies).map((name) => [
        name,
        allDependencies[name],
      ]),
    );

    packageJson.update({ dependencies });
  }

  // pin dev dependencies
  if (packageJson.content.devDependencies) {
    const devDependencies: Record<string, string> = Object.fromEntries(
      Object.keys(packageJson.content.devDependencies).map((name) => [
        name,
        allDependencies[name],
      ]),
    );

    packageJson.update({ devDependencies });
  }

  // save package.json
  await packageJson.save();
};

export const runInstall = async (packageManager: PackageManager) => {
  switch (packageManager) {
    case "npm":
      return sh("npm", ["install"]);
    case "pnpm":
      return sh("pnpm", ["install"]);
    case "bun":
      return sh("bun", ["install"]);
  }
};
