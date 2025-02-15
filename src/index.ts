import { Command } from "commander";
import { version } from "../package.json";
import { type Options, main } from "./main";

const program = new Command();

program
  .name("pinpm")
  .version(version)
  .option("-l, --lockfile <lockfile>", "lockfile to use")
  .parse(process.argv);

main(program.opts<Options>()).catch((error) => {
  console.error(`${error}`);
  process.exit(1);
});
