import { Command } from "commander";
import { name, version, description } from "../package.json";
import { type Options, main } from "./main";

const program = new Command();

program
  .name(name)
  .version(version)
  .description(description)
  .option("-l, --lockfile <lockfile>", "lockfile to use")
  .parse(process.argv);

main(program.opts<Options>()).catch((error) => {
  console.error(`${error}`);
  process.exit(1);
});
