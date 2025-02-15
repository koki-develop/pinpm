declare module "@npmcli/package-json" {
  export default class PackageJson {
    constructor();
    content: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    load(path: string): Promise<void>;
    update(object: Record<string, unknown>): Promise<void>;
    save(): Promise<void>;
  }
}
