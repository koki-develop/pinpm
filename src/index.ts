import { Command } from "commander";
import { type Options, main } from "./main";

const program = new Command();

// TODO: version

program.parse(process.argv);

main(program.opts<Options>()).catch((error) => {
  console.error(`${error}`);
  process.exit(1);
});
