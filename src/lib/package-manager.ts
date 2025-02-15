import * as fs from "node:fs";
import * as path from "node:path";

export type PackageManager = "npm" | "pnpm";

const lockFiles = [
  // npm
  "package-lock.json",
  // pnpm
  "pnpm-lock.yaml",
  // TODO: bun
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
      default:
        throw new Error(`Unsupported lockfile: ${filename}`);
    }
  }

  const foundLockfiles = lockFiles.filter((lockfile) => {
    return fs.existsSync(path.resolve(process.cwd(), lockfile));
  });
  if (foundLockfiles.length === 0) {
    throw new Error("No lockfile found");
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
  }
};
