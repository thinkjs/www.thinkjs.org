## Common question

### Why We Recommend You Use ES6/7 Grammar

ES6/7 support a mass of new features that bring us great convenience and efficiency. For example, we use ES6 `*/yield` and ES7 `async/await` feature to resolve async callback hell problem. And use arrow function to resolve `this` scope problem. Or use `class` grammar to resolve class inherit problem.

Although Node.js hasn't support all of those features, we can use them in Node.js stable environment in advance with the help of Babel. It's so good that we can enjoy the convenience and efficiency because of those new features.

### Why Run `npm run watch-compile` Can't Stop the Process

Version 2.0.6 has removed this command, beacause this version has supported auto-compile featrue, so all you need to do is to start the service by run `npm start`.

### Do We Need Restart Service After We Modified Something

Due to the working manner of Node.js, you must restart the service to make the modification to ta effect by default. It's so inconvenience to us. New version of ThinkJS supports auto update file mechanism to apply modification without restart.

Auto update may influence performance, so this feature turns on only in `development` mode. For online code, we advise you use `pm2` module.

### How to Change the Structure of View Folder

By default, view files' path is `view/[module]/[controller]_[action].html`. In this example, controller and action was join by `_`. If you want change joiner to `/`, you can change configuration file `src/common/config/view.js` like this:

```js
export default {
  file_depr: '/', //change joiner to /
}
```

### How To Open Multiple Threads

For online code, you can improve its performance by make use of multi-core CPU to heighten concurrence computing.

You can open `src/common/config/env/production.js`, and add the following option to it:

```js
export default {
  cluster_on: true //开启 cluster
}
```
### How To Modify Request Timeout

The default timeout in ThinkJS is 120 seconds, you can modify it by open `src/common/config/config.js`, and add the following option:

```js
export default {
  timeout: 30, // Change timeout to 30 seconds
}
```
