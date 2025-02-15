import * as path from "node:path";
import PackageJson from "@npmcli/package-json";

export const pinDependencies = async (
  allDependencies: Record<string, string>,
) => {
  // load package.json
  const packageJson = new PackageJson();
  await packageJson.load(process.cwd());

  // pin dependencies
  if (packageJson.content.dependencies) {
    const dependencies: Record<string, string> = Object.keys(
      packageJson.content.dependencies,
    ).reduce(
      (acc, name) => {
        acc[name] = allDependencies[name];
        return acc;
      },
      {} as Record<string, string>,
    );

    packageJson.update({ dependencies });
  }

  // pin dev dependencies
  if (packageJson.content.devDependencies) {
    const devDependencies: Record<string, string> = Object.keys(
      packageJson.content.devDependencies,
    ).reduce(
      (acc, name) => {
        acc[name] = allDependencies[name];
        return acc;
      },
      {} as Record<string, string>,
    );

    packageJson.update({ devDependencies });
  }

  // save package.json
  await packageJson.save();
};
