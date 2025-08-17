import { Command } from "commander";
import { description, name, version } from "../package.json";
import { main, type Options } from "./main";

const program = new Command();

program
  .name(name)
  .version(version)
  .description(description)
  .option("-l, --lockfile <lockfile>", "lockfile to use")
  .option("-i, --install", "run install command")
  .parse(process.argv);

main(program.opts<Options>()).catch((error) => {
  console.error(`${error}`);
  process.exit(1);
});
