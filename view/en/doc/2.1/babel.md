## Babel

We upgraded Babel from 5 to 6 in ThinkJS 2.1. Because Babel 6 is a refactored version that all functions build by plug-ins, and many modules of it relied on different plug-ins. That will leads to some problems:

- The node_modules directory will be too big, and be very slow at the first run.
- On Windows hosts, some errors may be reported because of the deep path.

The best solution is to upgrade your npm to version 3. Use following command to upgrade:

```sh
npm install -g npm@3
```

### Change compile parameters

The default compile parameters of Babel 6 are:

```js
{
  presets: ['es2015-loose', 'stage-1'],
  plugins: ['transform-runtime']
}
```
If the configure here doesn't satisfy with your requirements，you can modify it in file `www/development.js`:

```js
instance.compile({
  retainLines: true,
  log: true,
  presets: [], //appended presets list
  plugins: [] //appended plugins list
});
```

At some point, before your deploy, you want to run `npm run compile`, this will actually call the `compile` script in `package.json`. So, if you have set `presets` or `plugins` list, then you should change the `compile` command accordingly.
