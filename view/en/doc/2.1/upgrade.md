## Upgrade guide

It's a tutorial of how to update from 2.0 to 2.1, watch [here](/doc/2.0/upgrade.html) if you want to update from 1.x to 2.0.

The version 2.1 is compatible with 2.0 version. New version append more functions and change something lightly, you can watch [ChangeLog](/changelog.html) to know what has changed.

### Update from 2.0 to 2.1

#### Update ThinkJS dependency version

Change Thinkjs's version to `2.1.x` in package.json.

#### Update Babel to version 6

ThinkJS is compiled base on Babel 5, and it's update to 6 in the ThinkJS 2.1, so we need to modify Babel's version.

You can clear all dependencies about Babel in `package.json`, and append follow dependencies:

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

Then you should run `npm install` to install new dependencies. Delete `app/` folder and run `npm start` to start project.

#### Change compile command

change compile command in `package.json` to `babel --presets es2015-loose,stage-1 --plugins transform-runtime src/ --out-dir app/ --retain-lines`。


### Change to TypeScript in project

You can see [here](./typescript.html#toc-600) to study how to change to typescript in your project.
