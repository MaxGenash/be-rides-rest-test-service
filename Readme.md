# Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at the company. Please follow the instructions below to complete the assessment.

## Setup

1. Ensure `node (>=16 <17)` and `npm (>=6 <9)` are installed.
   If you have [Node Version Manager](https://github.com/nvm-sh/nvm), just run `nvm use` in the root folder of the project.
2. Run `npm install`
3. Run `npm test`
4. Run `npm start`
5. Hit the server to test health `curl localhost:8010/health` and expect a `200` response
6. The full list of available endpoints with detailed descriptions is available at `localhost:8010/api-docs`

## Tasks

Below will be your set of tasks to accomplish. Please work on each of these tasks in order. Success criteria will be defined clearly for each task

1. [Documentation](#documentation)
2. [Implement Tooling](#implement-tooling)
3. [Refactoring](#refactoring)
4. [Security](#security)
5. [Load Testing](#load-testing)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API response that is expected.

#### Success Criteria

1. Commit to `master` with a clear description of the change and purpose and merge it
2. **[BONUS]** Create an easy way to deploy and view the documentation in a web format and include instructions to do so

### Implement Tooling

Please implement the following tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

#### Success Criteria

1. Create commit to `master` with the new tooling and merge it
    1. `eslint` should have an opinionated format
    2. `nyc` should aim for test coverage of `80%` across lines, statements, and branches
    3. `pre-push` should run the tests before allowing pushing using `git`
    4. `winston` should be used to replace console logs and all errors should be logged as well. Logs should go to disk.
2. Ensure that tooling is connected to `npm test`
3. Create a separate commit to `master` with the linter fixes and merge it
4. Create a separate commit to `master` to increase code coverage to acceptable thresholds and merge it
5. **[BONUS]** Add integration to CI such as Travis or Circle
6. **[BONUS]** Add Typescript support

### Refactoring

Please implement the following refactors of the code:

1. Convert callback style code to use `async/await`
2. Reduce complexity at top level control flow logic and move logic down and test independently
3. **[BONUS]** Split between functional and imperative function and test independently

#### Success Criteria

1. Commit to `master` for each of the refactors above with:
    1. Code changes
    2. Tests

### Security

Please implement the following security controls for your system:

1. Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. Commit to `master` with:
    1. Changes to the code
    2. Tests ensuring the vulnerability is addressed

### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. Implement load testing using `artillery`
    1. Create a PR against `master` including artillery
    2. Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
    3. Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`

## Implementation notes:

I avoided breaking changes to the API since in real-world apps it should be done only after upgrading
the API version. So I left only the improvement ideas about what to fix there.

I implemented a layered architecture based on Controllers, Services and Repos. Controllers work with
"DTO" objects (=request/response data), Services work with "Entity" objects, Repos work with "Record"
objects. If we had some business logic (not only CRUD operations) it would make sense to also add
UseCase (aka Interactor) classes to coordinate other classes.

Implemented extra improvements (since they weren't forbidden by the task :D):

1. Added .nvmrc to lock Node.js version for people that use nvm (node version manager).
2. Specified supported Node.js and NPM versions in package.json engines.
3. Upgraded Node.js to 16x since 8x and 10x are deprecated and were dropped by some dependencies.
4. Replaced mocha and nyc with jest since it has them out-of-the-box under the hood and is more convenient (at least for me :D).

Improvement ideas:

1. Add versions to the API, e.g. ‘/api/v1/rides’ instead of ‘/rides’.
2. API request and response data for /rides should be in the same format; now request fields use snake case (e.g. rider_name), but response fields use camel case (e.g. riderName). Also, in SQL it’s more common to use snake case for field names (now we use camel case).
3. Return proper HTTP status codes for errors (e.g. 500, not 200). Return 201 for created records.
4. Requests to one entity (e.g. /rides/7) should return one entity, but now it returns an array of them.
5. Use a better back-end framework like Nest.js or Fastify depending on planned project size.
6. Add a dependency injection container, e.g. Inversify if we choose Fastify or Express (Nest.js has an own DI container).
7. Consider moving API to GraphQL if we are gonna communicate with front-end, or gRPC if we are gonna communicate with other internal microservices.
8. Use a proper ORM to build DB requests.
