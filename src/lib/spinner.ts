const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export const withSpinner = async <T>(
  message: {
    start: string;
    result?: (result: T) => string | string[];
  },
  fn: () => Promise<T>,
): Promise<T> => {
  let i = 0;
  const interval = setInterval(() => {
    process.stderr.write(`\r\x1b[36m${spinner[i]}\x1b[0m ${message.start}`);
    i = (i + 1) % spinner.length;
  }, 75);

  return fn()
    .then((result) => {
      process.stderr.write(`\r\x1b[32m\x1b[1m✓\x1b[0m ${message.start}\n`);
      if (message.result) {
        const resultString = message.result(result);
        if (Array.isArray(resultString)) {
          resultString.forEach((line, i) => {
            if (i === resultString.length - 1) {
              process.stderr.write(`  └─ ${line}\n`);
            } else {
              process.stderr.write(`  ├─ ${line}\n`);
            }
          });
        } else {
          process.stderr.write(`  └─ ${resultString}\n`);
        }
      }
      return result;
    })
    .catch((error) => {
      process.stderr.write(`\r\x1b[31m\x1b[1m✗\x1b[0m ${message.start}\n`);
      throw error;
    })
    .finally(() => {
      clearInterval(interval);
    });
};
