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
  cluster_on: true //turn on cluster
}
```
### How To Modify Request Timeout

The default timeout in ThinkJS is 120 seconds, you can modify it by open `src/common/config/config.js`, and add the following option:

```js
export default {
  timeout: 30, // Change timeout to 30 seconds
}
```
### How to catch exception

JS can't using `try/catch` to catch exception originally, but after using `async/await` you can use it:

```js
export default class extends think.controller.base {
  async indexAction(){
    try{  
      await this.getFromAPI1();
      await this.getFromAPI2();
      await this.getFromAPI3();
    }catch(err){
      //err.message is error message
      return this.fail(err.message);
    }
  }
}
```

Although you can using `try/catch` to catch exception, you can't know what code made this exception.

It's not convenient to use `try/catch` integrally because you ofen give error message to user by different error.

you can judge by result return in single async request:

```js
export default class extends think.controller.base {
  async indexAction(){
    //ignore this error 
    await this.getFromAPI1().catch(() => {});
    //Judge by exception returning specific value like false
    let result = await this.getFromAPI2().catch(() => false);
    if(result === false){
      return this.fail('API2 ERROR');
    }
  }
}
```

You can return specific value to know what exactly code make exception easily, and can return different error message by different error.

### How to ignore exception

If Promise return rejected Promise by using `async/await`, it will throw exception. If this exception is not import and can be ignored, you can add catch function and return a resolve Promise:

```js
export default class extends think.controller.base {
  async indexAction(){
    //catch function returns undefined to ignore exception
    await this.getAPI().catch(() => {});
  }
}
```

### PREVENT_NEXT_PROCESS

After call some function such as success you will find there has a message named `PREVENT_NEXT_PROCESS` error in console. This error is to prevent continue function adding in new ThinkJS. If you want to decide whether error is `PREVENT_NEXT_PROCESS`, you can use `think.isPrevent`:

```js
module.exports = think.controller({
  indexAction(self){
    return self.getData().then(function(data){
      return self.success(data);
    }).catch(function(err){
      //ignore PREVENT_NEXT_PROCESS error
      if(think.isPrevent(err)){
        return;
      }
      console.log(err.stack);
    })
  }
})
```

Other handle type: don't use `return` before function like `success`, then there has no this type error in `catch`.

### parallel processing

While using `sync/await`, your code is excuted serially. But mostly you want to excute parallely to have higher execution efficiency. You can use `Promise.all` to implement it.

```js
export default class extends think.controller.base {
  async indexAction(){
    let p1 = this.getServiceData1();
    let p2 = this.getAPIData2();
    let [p1Data, p2Data] = await Promise.all([p1, p2]);
  }
}
```

`p1` and `p2` are parallel process and then get both data by using `Promise.all`.

### How to output image

If your project need to output data like image and other type, you can using following type:

```js
export default class extends think.controller.base {
  imageAction(){
    //image buffer data, you can read from local or distance
    let imageBuffer = new Buffer();
    this.type('image/png');
    this.end(imageBuffer);
  }
}
```

### How to use different configuration in different environment

You usually use different configuration in different environment, such as: development environment and production environment will use different database configuration. You can modify `src/common/config/env/[env].js` to implement this function. Default `[env]` has `development`, `testing` and `production`.

If you want to config production environment database, you can modify `src/common/config/env/production.js`:

```js
export default {
  db: { //there has one level named db
    type: 'mysql',
    adapter: {
      mysql: {
        host: '',
        port: ''
      }
    }
  }
}
```

You can know more configuration in [here](./config.html#db)。

### How to extend template in nunjucks

Because of `root_path` setting in nunjucks, you should using relative path when you want to extend template:

```html
{% extends "./parent.html" %}  //same level parent.html file
{% extends "../layout.html" %} //parent level layout.html file
```

### How to allow Action call in cli only

Action can be excuted by user request or cli call. You can use `isCli` to judge when you want to allow Action call in cli only:

```js
export default class extends think.controller.base {
  indexAction(){
    //ban URL request this Action
    if(!this.isCli()){
      this.fail('only allow invoked in cli mode');
    }
    ...
  }
}
```

### How to call controller/action/model across module

You may have some requests about calling function across module when your project is complicated.

#### How to call controller

You can call controller in other module by using `this.controller` and pass second parameter to it:

```js
export default class extends think.controller.base {
  indexAction(){
    //get user controller instance in admin module
    let controllerInstance = this.controller('user', 'admin');
    //then you can use user controller function after getting instance
    let bar = controllerInstance.foo();
  }
  index2Action(){
    // or use this simple way
    let controllerInstance = this.controller('admin/user');
    let bar = controllerInstance.foo();
  }
}
```

#### How to call action

You can call action in other module by using `this.action`:

```js
export default class extends think.controller.base {
  async indexAction(){
    //get user controller instance in admin module
    let controllerInstance = this.controller('user', 'admin');
    //call test action in controller, it will also call `__before` and `__after` magic function automatically.
    let data = await this.action(controllerInstance, 'test')
  }
  async index2Action(){
    //you can also assign controller by string
    let data = await this.action('admin/user', 'test')
  }
}
```

`tip`: all action will return an Promise object, and it won't call logic when you call action alone.

#### How to call model

You can call model in other module by using `this.model`:

```js
export default class extends think.controller.base {
  indexAction(){
    //get user model instance in admin module
    let modelInstance1 = this.model('user', {}, 'admin');
    // or use this simple type
    let modelInstance2 = this.model('admin/user');
  }
}
```
