# pinpm

[![NPM Version](https://img.shields.io/npm/v/pinpm)](https://www.npmjs.com/package/pinpm)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/koki-develop/pinpm/release-please.yml)](https://github.com/koki-develop/pinpm/actions/workflows/release-please.yml)
[![GitHub License](https://img.shields.io/github/license/koki-develop/pinpm)](./LICENSE)

Pin dependency versions in `package.json`.

![demo](./assets/demo.gif)

## Installation

```console
$ npm install -g pinpm
```

## Usage

```console
$ pinpm --help
Usage: pinpm [options]

Pin dependency versions in package.json

Options:
  -V, --version              output the version number
  -l, --lockfile <lockfile>  lockfile to use
  -i, --install              run install command
  -h, --help                 display help for command
```

Supported package managers:

- [npm](https://docs.npmjs.com/cli/commands/npm) (`package-lock.json`)
- [pnpm](https://pnpm.io) (`pnpm-lock.yaml`)
- [bun](https://bun.sh/package-manager) (`bun.lock`, `bun.lockb`)

## LICENSE

[MIT](./LICENSE)
