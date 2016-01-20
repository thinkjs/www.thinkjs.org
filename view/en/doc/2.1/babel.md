## Babel

We upgrade Babel from 5 to 6 in ThinkJS 2.1. Because Babel 6 is a refactoring version that all functions build by modules，some modules will be used in different plugins. That's will lead to some problem like:

- The node_modules directory is too big, and will very slow at first time.
- Windows may have error with deep path.

The best answer is to upgrade your npm to version 3. Use following command to upgrade:

```sh
npm install -g npm@3
```

### Change compile parameters

Babel 6 default compile parameters are:

```js
{
  presets: ['es2015-loose', 'stage-1'],
  plugins: ['transform-runtime']
}
```
If this configure doesn't satisfy with your requirements，you can modify in file `www/development.js`:

```js
instance.compile({
  retainLines: true,
  log: true,
  presets: [], //append presets list
  plugins: [] //append plugins list
});
```

Then you can run `npm run compile` to use `compile` script in `package.json` before project publish online。If we set `presets` or `plugins` list, we should change `compile` command at the same time.
