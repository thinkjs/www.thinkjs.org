## Common question

### Why We Recommend You Use ES6/7 Grammar

ES6/7 support a mass of new features that bring us great convenience and efficiency. For example, we use ES6 `*/yield` and ES7 `async/await` feature to resolve async callback hell problem. And use arrow function to resolve `this` scope problem. Or use `class` grammar to resolve class inherit problem.

Although Node.js hasn't support all of those features, we can use them in Node.js stable environment in advance with the help of Babel. It's so good that we can enjoy the convenience and efficiency because of those new features.

### Why Run `npm run watch-compile` Can't Stop the Process

Version 2.0.6 has removed this command, beacause this version has supported auto-compile feature, so all you need to do is to start the service by run `npm start`.

### How to change server port

By default, Node.js server port is `8360`, you can change it in file `src/common/config/config.js`.

```js
export default {
  port: 1234 //Change server port to 1234
}
```

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
### How To Catch Exception

Using JS's `try/catch` can't catching exceptions come out of asynchronous code, but after using `async/await` you can use it:

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

Although you can catch the exception, but you can't know which code has triggered it.

In practice, this is not convenient because you ofen need to give error messages to users based on the errors.

At this time, you can check the specific error through single async request:

```js
export default class extends think.controller.base {
  async indexAction(){
    //ignore this error 
    await this.getFromAPI1().catch(() => {});
    //return false when exception occurs
    let result = await this.getFromAPI2().catch(() => false);
    if(result === false){
      return this.fail('API2 ERROR');
    }
  }
}
```

By returning different values for each exception, you can then return different error messages to users.

### Ignore Exception

When using `async/await`, if Promise returned a rejected Promise, an exception will be throwed. If it is not important and you want to ignore it, you can make the catch method to return a resolve Promise:

```js
export default class extends think.controller.base {
  async indexAction(){
    //returns undefined mean this exception will be ignore
    await this.getAPI().catch(() => {});
  }
}
```

### PREVENT_NEXT_PROCESS

After calling some methods such as `success`, you may find an error message named `PREVENT_NEXT_PROCESS` in console. This error is introduced by ThinkJS to prevent from the running of subsequent processes. If you want to check `PREVENT_NEXT_PROCESS` in catch method, you can use `think.isPrevent`:

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

Another handling method: don't use `return` before methond such as `success`, then there has no this error in `catch`.

### Parallel Processing


While using `sync/await`, your code is excuted serially. But mostly you want to excute parallely to have higher execution efficiency. For this, you can use `Promise.all` to implement it.

```js
export default class extends think.controller.base {
  async indexAction(){
    let p1 = this.getServiceData1();
    let p2 = this.getAPIData2();
    let [p1Data, p2Data] = await Promise.all([p1, p2]);
  }
}
```

`p1` and `p2` are processed parallelly and then get both data by using `Promise.all`.

### Output Images

If your projects need to output data like images and other file types, you can do it as following:

```js
export default class extends think.controller.base {
  imageAction(){
    //image buffer data, you can read it locally or remotely
    let imageBuffer = new Buffer();
    this.type('image/png');
    this.end(imageBuffer);
  }
}
```

### Using Different Configuration In Different Environments

Environments varies, the configuration may be vary too. For example, development environment and production environments should use different database configurations. You can modify `src/common/config/env/[env].js` to implement this. The option `[env]` has three default values: `development`, `testing` and `production`.

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

You can know more about configuration in [here](./config.html#db)。

### To Extend Template In nunjucks

Because of `root_path` setting in nunjucks, you should using relative path when you want to extend template:

```html
{% extends "./parent.html" %}  //same level parent.html file
{% extends "../layout.html" %} //parent level layout.html file
```

### To Allow Action Calls Only In CLI

Action can be excuted by user requests or CLI calls. You can use `isCli` to judge when you want to allow Action call in CLI only:

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

### Invokes Controller/Action/Model Across Modules

You may have some requests about calling function across modules when your projects is complicated.

#### Call Controllers

You can call controller in other modules by using `this.controller` and pass the second parameter in:

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

#### Call Actions

You can call actions in other modules by using `this.action`:

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

`tip`: All actions will return Promise object, and it won't call logic when you call action alone.

#### Call Models

You can call models in other modules by using `this.model`:

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

### How to request other api's data

It's common to request other api's data in our project. Of couse you can use `http` module to implement it. But `http` module only provides some basic function. We recommend to use `request` module or `superagent` module:

```js
import request from 'request';
/* Get API DATA */
let getApiData = () => {
  let deferred = think.defer();
  request.get({
    url: 'http://www.example.com/api/user',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36'
    }
  }, (err, response, body) => {
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(body);
    }
  });
}
```
To convert it to promise style, you should create an deferred object to resolve or reject in callback function. ThinkJS provides `think.promisify` function to convert function to promise quickly.


```js
import request from 'request';
/* 获取 API 接口数据 */
let getApiData = () => {
  let fn = think.promisify(request.get);
  return fn({
    url: 'http://www.example.com/api/user',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36'
    }
  });
}
```

### Normal in development environment and 502 error in production environment

Sometimes it's normal in development, but it comes 502 error in production by using pm2 and nginx. Think error is caused by abnormal with starting node service. You can see error info to check by `pm2 logs` command. Or you can close service and start service handly by `node www/production.js`, then watch error info.

### CORS setting

Morden browsers support cors by setting some request header. ThinkJS can setting quickly like following:

```js
export default class extends think.controller.base {
  indexAction(){
    let method = this.http.method.toLowerCase();
    if(method === 'options'){
      this.header('Access-Control-Allow-Origin', '*');
      this.header('Access-Control-Allow-Headers', 'x-requested-with');
      this.header('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
      this.end();
    }
  }
}
```
More CORS info can watch <https://www.w3.org/TR/cors>. 

If your project is REST API, you can add these codes in `__call` method.

```js
export default class extends think.controller.base {
  __call(){
    let method = this.http.method.toLowerCase();
    if(method === 'options'){
      this.header('Access-Control-Allow-Origin', '*');
      this.header('Access-Control-Allow-Headers', 'x-requested-with');
      this.header('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
      this.end();
    }
    return super.__call();
  }
}
```

### current path is not thinkjs project.

When you use thinkjs command to create adapter or model, cli will return error like `current path is not thinkjs project` sometime.

When we use `thinkjs new project` command to create project, it will auto create a file named `.thinkjsrc` to store some description for this project. And creating adapter and model are depends on this file. If you miss this file, ThinkJS will return `current path is not thinkjs project` error.

To resolve this problem, you can copy `.thinkjsrc` file from anohter same project.

`tip`：`.thinkjsrc` file needs version control or will display this error someday.
