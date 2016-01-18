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
### 如何捕获异常

JS 本身是无法通过 try/catch 来捕获异步异常的，但使用 async/await 后则可以通过 try/catch 来捕获异常，如：

```js
export default class extends think.controller.base {
  async indexAction(){
    try{  
      await this.getFromAPI1();
      await this.getFromAPI2();
      await this.getFromAPI3();
    }catch(err){
      //通过 err.message 拿到具体的错误信息
      return this.fail(err.message);
    }
  }
}
```

上面的方式虽然可以通过 try/catch 来捕获异常，但在 catch 里并不知道异常是哪个触发的。

实际项目中，经常要根据不同的错误返回不同的错误信息给用户，这时用整体的 try/catch 就不太方便了。

此时可以通过单个异步接口返回特定值来判断，如：

```js
export default class extends think.controller.base {
  async indexAction(){
    //忽略该接口的错误（该接口的错误不重要，可以忽略）
    await this.getFromAPI1().catch(() => {});
    //异常时返回特定值 false 来判断
    let result = await this.getFromAPI2().catch(() => false);
    if(result === false){
      return this.fail('API2 ERROR');
    }
  }
}
```

如上面代码所述，通过返回特定值判断就可以方便的知道是哪个异步接口发生了错误，这样就可以针对不同的错误返回不同的错误信息。

### 如何忽略异常

使用 async/await 时，如果 Promise 返回了一个 rejected Promise，那么会抛出异常。如果这个异常不重要需要忽略的话，可以通过 catch 方法返回一个 resolve Promise 来完成。如：

```js
export default class extends think.controller.base {
  async indexAction(){
    //通过在 catch 里返回 undefined 来忽略异常
    await this.getAPI().catch(() => {});
  }
}
```

### PREVENT_NEXT_PROCESS

在调用有些方法后（如：success）后会发现有个 message 为 `PREVENT_NEXT_PROCESS` 的错误。这个错误是 ThinkJS 为了阻止后续执行添加的，如果要在 `catch` 里判断是否是该错误，可以通过 `think.isPrevent` 方法来判断。如：

```js
module.exports = think.controller({
  indexAction(self){
    return self.getData().then(function(data){
      return self.success(data);
    }).catch(function(err){
      //忽略 PREVENT_NEXT_PROCESS 错误
      if(think.isPrevent(err)){
        return;
      }
      console.log(err.stack);
    })
  }
})
```

另一种处理方式：对于 `success` 之类的方法前面不要添加 `return`，这样 `catch` 里就不会有此类的错误了。

### 并行处理

使用 `async/await` 来处理异步时，是串行执行的。但很多场景下我们需要并行处理，这样可以大大提高执行效率，此时可以结合 `Promise.all` 来处理。

```js
export default class extends think.controller.base {
  async indexAction(){
    let p1 = this.getServiceData1();
    let p2 = this.getAPIData2();
    let [p1Data, p2Data] = await Promise.all([p1, p2]);
  }
}
```

上面的代码 `p1` 和 `p2` 是并行处理的，然后用 `Promise.all` 来获取 2 个数据。这样一方面代码是同步书写的，同时又不失并行处理的性能。

### 如何输出图片

项目中有时候要输出图片等类型的数据，可以通过下面的方式进行：

```js
export default class extends think.controller.base {
  imageAction(){
    //图片 buffer 数据，读取本地文件或者从远程获取
    let imageBuffer = new Buffer();
    this.type('image/png');
    this.end(imageBuffer);
  }
}
```

### 如何在不同的环境下使用不同的配置

我们经常在不同的环境下使用不同的配置，如：开发环境和线上环境使用不同的数据库配置。这时可以通过 `src/common/config/env/[env].js` 来配置，`[env]` 默认有 `development`，`testing` 和 `production` 3 个值，分别对应开发环境、测试环境和线上环境。这时可以在对应的配置文件设定配置来用在不同的环境下。

如：配置线上环境下的数据库，那么可以在 `src/common/config/env/production.js` 中配置：

```js
export default {
  db: { //这里要有一级 db
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

详细的数据库配置请见[这里](./config.html#db)。

### nunjucks 模板继承路径怎么写

使用 nunjucks 的模板继承时，由于设置了 root_path，所以路径需要使用相对路径。如：

```html
{% extends "./parent.html" %}  //表示同级别目录下的 parent.html 文件
{% extends "../layout.html" %} //表示父级别下的 layout.html 文件
```

### 如何让 Action 只允许命令行调用

默认情况下，Action 既可以用户访问，也可以命令行调用。但有些 Action 我们希望只在命令行下调用，这时可以通过 `isCli` 来判断。如：

```js
export default class extends think.controller.base {
  indexAction(){
    //禁止 URL 访问该 Action
    if(!this.isCli()){
      this.fail('only allow invoked in cli mode');
    }
    ...
  }
}
```

### 如何跨模块调用

当项目比较复杂时，会有一些夸模块调用的需求。

#### 调用 controller

可以通过 `this.controller` 方法传递第二个参数模块名达到调用其他模块下 controller 的功能，如：

```js
export default class extends think.controller.base {
  indexAction(){
    //获取 admin 模块下 user controller 的实例
    let controllerInstance = this.controller('user', 'admin');
    //获取 controller 的实例下就可以调用下面的方法了
    let bar = controllerInstance.foo();
  }
  index2Action(){
    //也可以通过这种更简洁的方式获取
    let controllerInstance = this.controller('admin/user');
    let bar = controllerInstance.foo();
  }
}
```

#### 调用 action

可以通过 `this.action` 方法调用其他模块里 controller 下的 action 方法，如：

```js
export default class extends think.controller.base {
  async indexAction(){
    //获取 admin 模块下 user controller 的实例
    let controllerInstance = this.controller('user', 'admin');
    //调用 controller 里的 test action，会自动调用 __before 和 __after 魔术方法
    let data = await this.action(controllerInstance, 'test')
  }
  async index2Action(){
    //也可以通过字符串来指定 controller，这样会自动找对应的 controller
    let data = await this.action('admin/user', 'test')
  }
}
```

`注`：action 调用返回的始终为 Promise，调用 action 时不会调用对应的 logic。

#### 调用 model

可以通过 `this.model` 方法获取其他模块下的 model 实例，如：

```js
export default class extends think.controller.base {
  indexAction(){
    //获取 admin 模块下的 user model 实例
    let modelInstance1 = this.model('user', {}, 'admin');
    //也可以通过这种更简洁的方式
    let modelInstance2 = this.model('admin/user');
  }
}
```
