## Common question

### Why develop to ES6/7 grammar

It supports large of new feature to bring great convenience and efficiency while developing in ES6/7. For example, we use ES6 `*/yield` and ES7 `async/await` feature to resolve async callback hell problem. And use arrow function to resolve `this` scope problem. Or use `class` grammar to resolve class inherit problem.

Although Node.js hasn't support all those features, we can use them in Node.js stable environment in advance with the help of Babel. It's so good that enjoy convenience and efficiency because of new features.

### Why npm run watch-compile can't stop process

Program which created with `--es6` command must be compiled before you run it. ThinkJS has `npm run watch-compile` command to real-time compile. This command will start a daemon and won't close itself after end. If you want run other command, you may open new tab or window.

### Do we need restart service when we modified in development 

It must restart to effective after modified because of Node.js mechanism by default. It's so inconvenience to us. New ThinkJS supports auto update file mechanism to effect modified without restart.

Auto update will consume performance, so this feature turns on only in `development`. Online we advise that use `pm2` module to manage project.

### How to change view folder structure

View file path is `view/[module]/[controller]_[action].html` by default. In this path controller and action was join by `_`. If you want change joiner to `/`, you can change configuration file `src/common/config/view.js` like this:

```js
export default {
  file_depr: '/', //change joiner to /
}
```

