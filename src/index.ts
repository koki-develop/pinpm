import { Command } from "commander";
import { type Options, main } from "./main";
import { version } from "../package.json";

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
