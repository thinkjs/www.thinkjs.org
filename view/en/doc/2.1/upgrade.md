## Upgrading Guide

This documentation is a guide about how to update ThinkJS from 2.0 to 2.1, look at [here](/doc/2.0/upgrade.html) if you want to update from 1.x to 2.0.

The version 2.1 is compatible with version 2.0. The new version has appended more functions and changed something lightly, you can reference it's [ChangeLog](/changelog.html) to know what has changed.

### Updating From 2.0 to 2.1

#### Update ThinkJS Dependency Versions

Change Thinkjs's version to `2.1.x` in package.json.

#### Updating Babel to version 6

ThinkJS has used Babel 5 for compiling, and now it has updated to 6 in the ThinkJS 2.1, so we need to modify Babel's version.

You can remove all dependencies about Babel in `package.json`, and append the following dependencies:

```js
  "dependencies": {
    "babel-runtime": "6.x.x"
  },
  "devDependencies": {
    "babel-cli": "6.x.x",
    "babel-preset-es2015-loose": "6.x.x",
    "babel-preset-stage-1": "6.x.x",
    "babel-plugin-transform-runtime": "6.x.x",
    "babel-core": "6.x.x"
  }
```

Then, run `npm install` to install new dependencies. Delete `app/` folder and run `npm start` to start project.

#### Change Compiling Command

Change compiling command in `package.json` to `babel --presets es2015-loose,stage-1 --plugins transform-runtime src/ --out-dir app/ --retain-lines`。


### Upgrading Projects To Use TypeScript

You can see [here](./typescript.html#toc-600) to study how to change your development language to typescript.
