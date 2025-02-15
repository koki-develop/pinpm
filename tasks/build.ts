await Bun.build({
  banner: "#!/usr/bin/env node",
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  packages: "external",
});
