import { sh } from "./sh";

export const listBunDependencies = async (): Promise<
  Record<string, string>
> => {
  // $ bun pm ls
  // <path> node_modules (<number>)
  // ├── <name>@<version>
  // ├── ...
  // └── <name>@<version>
  const tree = await sh("bun", ["pm", "ls"]);

  const lines = tree.trim().split("\n").slice(1);

  const dependencies = lines.reduce<Record<string, string>>((acc, line) => {
    const [, dependency] = line.split("── ");
    const [name, version] = dependency.trim().split("@");
    acc[name] = version;
    return acc;
  }, {});

  return dependencies;
};
