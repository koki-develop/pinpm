import { readWantedLockfile, type ProjectId } from "@pnpm/lockfile-file";

export const listPnpmDependencies = async (): Promise<
  Record<string, string>
> => {
  const lockfile = await readWantedLockfile(".", {
    ignoreIncompatible: false,
  });
  if (!lockfile) {
    throw new Error("Failed to read lockfile");
  }

  const { dependencies, devDependencies } =
    lockfile.importers["." as ProjectId];

  return Object.fromEntries(
    Object.entries(
      Object.assign(dependencies ?? {}, devDependencies ?? {}),
    ).map(([name, version]) => [name, _removePeerDependencies(version)]),
  );
};

const _removePeerDependencies = (version: string) => {
  if (!version.endsWith(")")) return version;

  let count = 0;
  let pos = version.length - 1;

  while (pos >= 0) {
    if (version[pos] === ")") {
      count++;
    } else if (version[pos] === "(") {
      count--;
      if (count === 0) {
        const result = version.substring(0, pos);
        if (result.endsWith(")")) {
          return _removePeerDependencies(result);
        }
        return result;
      }
    }
    pos--;
  }

  return version;
};
