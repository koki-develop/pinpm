# pinpm

Pin dependency versions in package.json

```console
$ pinpm
```

```diff
 // package.json
 {
   "dependencies": {
-    "@aws-sdk/core": "^3.0.0",
-    "aws-cdk": "~2"
+    "@aws-sdk/core": "3.749.0",
+    "aws-cdk": "2.178.2"
   },
   "devDependencies": {
-    "eslint": ">=9.0.0",
-    "prettier": "latest"
+    "eslint": "9.20.1",
+    "prettier": "3.5.1"
   }
 }
```

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
  -h, --help                 display help for command
```

Supported package managers:

- npm (`package-lock.json`)
- pnpm (`pnpm-lock.yaml`)

## LICENSE

[MIT](./LICENSE)
