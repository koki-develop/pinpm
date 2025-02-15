import * as fs from "node:fs";
import * as path from "node:path";

export type PackageManager = "npm";

type LockFile = (typeof lockFiles)[number];
const lockFiles = [
  // npm
  "package-lock.json",
  // TODO: pnpm
  // TODO: bun
] as const;

export const determinePackageManager = async (): Promise<PackageManager> => {
  const foundLockfiles = lockFiles.filter((lockfile) => {
    return fs.existsSync(path.join(process.cwd(), lockfile));
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
  }
};
