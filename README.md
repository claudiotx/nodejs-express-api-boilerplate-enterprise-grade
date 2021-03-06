# Enterprise Grade Node.js Boilerplate
The main purpose of this repository is to provide a solid boilerplate base project to startups that want to have a quality and solid API backend in Node.js (without views).
This project is biased on my vision of how an enterprise grade app should be, it may not be aligned with yours.
This boilerplate assumes an explicit separation between frontend and backend.
I try my best to keep the repository up to date.
Community contributions are most welcome. (Open an Issue or fork/clone and PR against #master)
Powered by: coderecipes.org

## TLDR; DO NOT SKIP THIS!
- Dev: `npm run watch`
- Deploy: `npm run build`
- Tests: `npm run test`
- Do NOT bypass TypeScript Lint;
- Do NOT use plain JS files;
- Avoid using `any` for type assignment;
- Write E2E and Unit Tests in TS
- Do NOT store sensitive information in your `env` Folder! Use environment variables on the host, process manager or container which is running your app. If you do need to store sensitive info there, please do not track that file.

## Standards Compliance
https://www.coderecipes.org/blog/5c69b7e399453f09094d661b
Find the scripts at: `./quality-control`
- Signal the load-balancer as quickly as possible that a node server has a long list of lagging requests
- Flame profilling executed across all Endpoints to flag functions that may be blocking the event-loop
- Liveness and Healthiness Probes
- LHealthiness probs running at all times: whilst programming, running Unit Tests, UAT or End 2 End Tests
- Node Process Manager Enabled (PM2)

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
* StackTrace Leak Client Protection
* Kubernetes Tooling Ready

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
If you want to use a TDD/BDD approach, please create your `test.ts` files in `/test/unit` and force them to fail, then implement the correct logic to make the tests pass.
If you want to run only unit tests: `npm run test-unit`

### Running tests
Simply run `npm run test`.
Note this will also generate a coverage report.

## Deploying via Kubernetes
Please check `./kubernetes/*` for bash scripts and yaml templates.
The templates assume that your K8s cluster is using an NGiNX based Ingress Router to enable inbound connections to the cluster, allowing external traffic to reach the correct Pod.
Please note that the Ingress will enable externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting for the Kubernetes cluster.
