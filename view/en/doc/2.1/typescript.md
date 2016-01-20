## TypeScript

[TypeScript](http://www.typescriptlang.org/) is an free and open source programming language designed by Microsoft. TypeScript is a typed superset of JavaScript that it has some useful function in large project such as optional static type.

ThinkJS 2.1 has support TypeScript, we can auto compile and update in our project.

### Create TypeScript project

We can create typescript project by using `--ts`:

```sh
thinkjs new thinkjs_demo --ts
```

TypeScript's file extension is `.ts`. If you want to create typescript file manually, it should be `.ts` too, other wise it will catch error in `tsc` compile.

### .d.ts file

`.d.ts` files are the description file of third party library. When we create our project, file named `typings/thinkjs/think.d.ts` will be created to describe ThinkJS. You can load this description file by following:

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

This code will set on the front of file, and the path must be correct. If your file has `use strict`, this code should set after `use strict`.

If you depend on other third party library in your project, you should have their own description file. You can install by  [tsd](http://definitelytyped.org/tsd/).

You can find description file of some third party library in <https://github.com/DefinitelyTyped/DefinitelyTyped>.

### TypeScript compile

Because of some fault when compiling TypeScript, you can compile TypeScript `.ts` file to ES6, then compile to ES5 using Babel 6.

If you find any problem about TypeScript, you can open issue to TypeScript on <https://github.com/Microsoft/TypeScript>。

### Change exist project to TypeScript

ThinkJS also support change exist project to TypeScript:

#### Change index file

Change index file `www/development.js` with following:

```js
//compile src/ to app/
instance.compile({
  log: true,
  type: 'ts' //TypeScript
});
```

#### Modify package.json

Clear all dependencies about `Babel` and `ThinkJS` and append following dependencies:

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

If there has some used module in `dependencies` and `devDependencies`, they should be merged together.

Then run `npm install` to install all dependencies.

#### Modify .thinkjsrc

Change project config file `.thinkjsrc` to following:

```json
{
  "createAt": "2016-01-13 17:27:19",
  "mode": "module",
  "ts": true
}
```

#### Download `think.d.ts` description file

Download file <https://github.com/75team/thinkjs/blob/master/template/think.d.ts> and save as `typings/thinkjs/think.d.ts`。

#### Modify file extension

Modify all `.js` files in `src` to `.ts`.

#### Add `bin/compile.js` file

Download file <https://github.com/75team/thinkjs/blob/master/template/bin/compile.ts> and save as `bin/compile.js`。

#### Modify compile command

Change compile command in `package.json` to `node bin/compile.js`.

#### Add description file in project description

All files in `src/` must add following code in top, releative path should be correct:

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

You shoud run `npm start` to start service after all modify.
