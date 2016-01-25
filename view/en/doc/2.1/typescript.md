## TypeScript

[TypeScript](http://www.typescriptlang.org/) is a free and open source programming language designed by Microsoft. TypeScript is a typed superset of JavaScript that it has some useful function in large project such as optional static type.

ThinkJS 2.1 has support TypeScript, you can auto-compile and auto-update in your projects.

### Create TypeScript Projects

We can create Typescript projects by using `--ts`:

```sh
thinkjs new thinkjs_demo --ts
```

TypeScript's file extension is `.ts`. If you want to create Typescript file manually, the postfix should be `.ts` too, or it will trigger error when calling `tsc` to compile.

### .d.ts file

`.d.ts` files are the description file of third party libraries. When we create our projects, the file named `typings/thinkjs/think.d.ts` will be created as ThinkJS's description file. You can include this description file in your project files as the following:

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

This code must be placed on the first line in the file, and the path must be correct. If your file has `use strict`, this code should set after `use strict`.

If your projects rely on other third party libraries, you should install their description files respectively. You can finish installation by use the [tsd](http://definitelytyped.org/tsd/).

You can find description file of some third party libraries in <https://github.com/DefinitelyTyped/DefinitelyTyped>.

### TypeScript Compiling

Because of there are some faults in compiling TypeScript, we have chosen to compile TypeScript `.ts` files to ES6 code first, then we compile the ES6 code to ES5 code using Babel 6.

If you find any problem about TypeScript, you can open an issue on <https://github.com/Microsoft/TypeScript>。

### Change Existing Projects To Using TypeScript

For projects that have used the ES6/7 features, ThinkJS could also supports to update them to use TypeScript.

#### Change Entry File

Change entry file `www/development.js` as following:

```js
//compile src/ to app/
instance.compile({
  log: true,
  type: 'ts' //TypeScript
});
```

#### Modify package.json

Clear all dependencies related to `Babel` and `ThinkJS` and append following dependencies:

```
{
  "dependencies": {
    "thinkjs": "2.1.x",
    "babel-runtime": "6.x.x"
  },
  "devDependencies": {
    "typescript": "next",
    "babel-cli": "6.x.x",
    "babel-preset-es2015-loose": "6.x.x",
    "babel-preset-stage-1": "6.x.x",
    "babel-plugin-transform-runtime": "6.x.x",
    "babel-core": "6.x.x"
  }
}
```

If some modules in `dependencies` and `devDependencies` have been used, they should be merged together.

After modifying, run `npm install` to install all dependencies.

#### Modify .thinkjsrc

Change project's configration file `.thinkjsrc` to:

```json
{
  "createAt": "2016-01-13 17:27:19",
  "mode": "module",
  "ts": true
}
```

#### Downloading `think.d.ts` Description File

Downloads file <https://github.com/75team/thinkjs/blob/master/template/think.d.ts> and save it as `typings/thinkjs/think.d.ts`。

#### Modify File Extension

Modify all `.js` files in `src` to `.ts` files.

#### Add `bin/compile.js` File

Downloads file <https://github.com/75team/thinkjs/blob/master/template/bin/compile.ts> and save it as `bin/compile.js`。

#### Modify Compiling Command

Change compiling command in `package.json` to `node bin/compile.js`.

#### Add Description File In Project's Discription File

All files in `src/` must add the following code in its first line, releative path should be correct:

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

Run `npm start` to start service after finished all modifying.
