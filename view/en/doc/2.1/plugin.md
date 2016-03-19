
## Developing Plugins

ThinkJS 2.0 supports two kinds of plugins: Middleware and Adapter.

### Creating Plugins

Run the following command to create a plugin, and the plugin name begin with `think-` is suggested:

```
thinkjs plugin think-xxx
```

After runing, the `think-xxx` directory will be created, and it may includes the following content:

```
  create : think-xxx/
  create : think-xxx/src
  create : think-xxx/src/index.js
  create : think-xxx/test
  create : think-xxx/test/index.js
  create : think-xxx/.eslintrc
  create : think-xxx/.npmignore
  create : think-xxx/.travis.yml
  create : think-xxx/package.json
  create : think-xxx/README.md

  enter path:
  $ cd think-xxx/

  install dependencies:
  $ npm install

  watch compile:
  $ npm run watch-compile

  run test:
  $ npm run test-cov
```

###  Directory Structure

- `src/` place the source code, using ES6/7 features
- `test/` for unit testing
- `.eslintrc` configuration file eslint needed
- `.npmignore` files to ignore when npm launching
- `.travis.yml` configuration file for travis continuous integration 
- `package.json` npm configuration file
- `README.md` ReadMe


### Installing Dependencies

```
npm install --verbose
```

### Developing

The code file is`src/index.js`, the generated file by default only contain a basic class, has not inherited any other class yet.

If it is Middleware, you may want to inherit `think.middleware.base`, if it is Adapter, you may want to inherit `think.adapter.base`.

Before developing, run `npm run watch-compile` to make the edited files be compiled in real time.

### Unit Testing

Unit Testing code should be written in `test/index.js`, the test framework is mocha, and run the following command to view the unit testing result:

```
npm run test-cov
```

### About README

After developing and testing, please write the notes in the README.md.


### Publishing

Run `npm publish` to publish the plugin into the npm repository (you may be asked to create account and password if it is your very first publish).

Then, you can inform ThinkJS team. After confirmed, your plugins will be added into the offical plugin list and you can get the gift.
