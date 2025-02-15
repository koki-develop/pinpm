import { sh } from "./sh";

export const listNpmDependencies = async (): Promise<
  Record<string, string>
> => {
  const stdout = await sh("npm", [
    "list",
    "--package-lock-only",
    "--json",
    "--depth=0",
  ]);

  const parsed = JSON.parse(stdout);

  return Object.entries(parsed.dependencies).reduce(
    (acc, [name, info]) => {
      acc[name] = (info as { version: string }).version;
      return acc;
    },
    {} as Record<string, string>,
  );
};
