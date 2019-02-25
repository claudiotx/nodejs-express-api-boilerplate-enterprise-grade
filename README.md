# Enterprise Grade Node.js Boilerplate
The main purpose of this repository is to provide a solid boilerplate base project to startups that want to have a quality and solid API backend in Node.js (without views).
This boilerplate assumes an explicit separation between frontend and backend.
I try my best to keep the repository up to date.
Community contributions are most welcome.

## TLDR;
- Do NOT store sensitive information in your `env` Folder! Use environment variables on the host, process manager or container which is running your app.
- Do not bypass TypeScript Lint
- Do not use plain JS files
- Do not use `any` for type assignment
- Dev: npm run watch
- Deploy: npm run build

## Main Features
* TypeScript
* CORS Middleware
* Properly Handled Promises
* Liveness Probe Endpoint
* Safe Termination
* Local and Remote Logging
* Standard HTTP Security
* OAS Compliant
* Unit and E2E Tests
* Self Documented
* Ready to Use Decorators
* API Automated Swager Documentation via TSOA (relies on TypeScript type annotations to generate API metadata)
* TSLint Enabled
* Safe Await Async Protection

## Getting started
The build orchestration is managed by npm scripts, so there is no need for gulp or grunt orchestrators.
Node.js >= 10

- Clone the repository
```
git clone --depth=1 https://github.com/claudiotx/enterprise.git <project_name>
```
- Install dependencies
```
npm install
```
- Build and run the project
```
npm run watch
```
Finally, navigate to `http://localhost:7777` and you have your app running. Ping or curl it's health endpoint.

## Project Structure
Please note that a Typescript project will have a different project structure.
Now you have both src (ts) and dist (js).

> **Note!** Make sure you have already built the app either via `npm run build` or `npm run watch`.

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Generate Javascript files  |
| **src**                  | Source Typescript files |
| **src/config**            | Passport authentication strategies and other middleware configs.  |
| **src/services**         | Services define functions that respond to various http requests                            |
| **src/models**           | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/types**            | Holds .d.ts files not found on DefinitelyTyped.          |
| **src**/server.ts        | Entry point to your express app                                                               |
| **test**                 | Contains your tests.  |
| /env/.env.example        | API keys, tokens, passwords, database URI.  |
| .travis.yml              | Travis CI build                                                             |
| jest.config.js           | Used to configure Jest                                                                        |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tslint.json              | Config settings for TSLint code style checking                                                |
| ------------------------ | --------------------------------------------------------------------------------------------- |

## Avoid polluting the dependencies configuration
> Add `--save-dev` (or `-D`) to your `npm install`. `.d.ts`.

## Typescript
> After doing the first npm install, please use this library [typesync] (https://www.npmjs.com/package/typesync) to add the missing types
> We're using `"noImplicitAny": true`, we are required to have a `.d.ts` file for **every** library we use.
> Remember: the TS compiler scans first `d.ts` file in `node_modules/@types` and then `src/types`
I strongly recommend trying to use the tool [dts-gen](https://github.com/Microsoft/dts-gen) first.

A simple `d.ts` file:
```ts
declare module "<some-library>";
```

#### Typescript variable scopes
- `protected` properties will be accessible from deriving classes
- `private` properties are scoped to the class only

### Debugging
Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.
This has already been taken care of for you via `tsconfig.json`.

### Using the debugger in VS Code
it `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.
Now just set your breakpoints and go!

## Testing
For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.

### Running tests
Simply run `npm run test`.
Note this will also generate a coverage report.