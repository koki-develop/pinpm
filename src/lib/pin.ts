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
