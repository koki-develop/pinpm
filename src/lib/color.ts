export class Color {
  constructor(private readonly text: string) {}

  public bold(): Color {
    return new Color(`\x1b[1m${this.text}`);
  }

  public red(): Color {
    return new Color(`\x1b[31m${this.text}`);
  }

  public green(): Color {
    return new Color(`\x1b[32m${this.text}`);
  }

  public cyan(): Color {
    return new Color(`\x1b[36m${this.text}`);
  }

  public toString(): string {
    return `${this.text}\x1b[0m`;
  }
}
