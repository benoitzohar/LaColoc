La Coloc
=========

[![Travis](https://img.shields.io/travis/benoitzohar/LaColoc.svg)](https://travis-ci.org/benoitzohar/LaColoc)
[![Coveralls](https://img.shields.io/coveralls/benoitzohar/LaColoc.svg)](https://coveralls.io/github/benoitzohar/LaColoc)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg)](http://opensource.org/licenses/MIT)


## Overview

A ES6 NodeJS app with a Angular2 client for your flat or your weekend/holidays.

The server part is heavily based on [Express & mongoose REST API Boilerplate in ES6 with Code Coverage](https://github.com/KunalKapadia/express-mongoose-es6-rest-api) boilerplate, feel free to check it's documentation before digging into the LaColoc's code.

## Getting Started

Clone the repo:
```sh
git clone git@github.com:BenoitZohar/LaColoc.git
cd LaColoc
```

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Set environment (vars):
```sh
cp .env.example .env
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=lacoloc:* yarn start
# or use the shortcut:
yarn debug

```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.


Tests:
```sh
# Run tests written in ES6
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

## License
This project is licensed under the [MIT License](https://github.com/benoitzohar/LaColoc/blob/master/LICENSE)
