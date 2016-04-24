## think

`think` is a global object that contains lots of useful methods and functions which can use anywhere of your application without `require`.

### Properties

#### think.startTime

The start time of service, a unix timestamp.

#### think.env

The current environment of application, it may be one of the three possable values, you can set it when application start:

* `development` The development environment, application will automatically update itself with modified files.
* `testing` The testing environment.
* `production` The production environment, when application deploy online.

#### think.dirname

The name of project directory, you can set it when application start, the default value is:

```js
think.dirname = {
  config: 'config', // The config file directory
  controller: 'controller', // Directory of controller
  model: 'model', // Directory of model
  adapter: 'adapter', // Directory of adapter
  logic: 'logic', // Directory of logic
  service: 'service', // Directory of service
  view: 'view', // Directory of view
  middleware: 'middleware', // Directory of middleware
  runtime: 'runtime', // Directory of runtime
  common: 'common', // Directory of common functions
  bootstrap: 'bootstrap', // the start directory of application 
  locale: 'locale' // Directory of locale
}
```

#### think.port

The port of application runs, which can assign before application start, if assigned to some value, application will ignore the port value in the config file.

#### think.cli

Whether application is run under command line mode, false by default. if it is under command line mode, this variable return command arguments. You start command line mode by run:

```
node www/index.js /home/index/test
```

#### think.lang

The current language of system, it read from the environment, which maybe empty in windows system.

#### think.mode

The current mode of application, framework support two mode in project:

* `think.mode_normal` multiple modules mode, directory of project is separated to Controller, View, Logic and some other modules.
* `think.mode_module` multiple modules mode, but more stringent separate project with modules than normal mode.

#### think.version

The current version of ThinkJS.

#### think.module

The list of modules of project.

#### think.THINK_PATH

The path of ThinkJS code.

#### think.THINK_LIB_PATH

The path where `lib/` of ThinkJS is.

#### think.ROOT_PATH

The root path of project, which is defined in `www/index.js`

#### think.APP_PATH

The path of app directory, which is defined in `www/index.js`

#### think.RESOURCE_PATH

The path of static resource directory, which is defined in `www/index.js`




### Methods

#### think.Class(methods, clean)

Create a class dynamically, which inherit from `think.base` by default. you can use `class` to create class in ES6 if project is using ES6.

```js
// inherit from think.base
var Cls1 = think.Class({
  getName: function(){

  }
})
```


##### Did Not Inherit think.base

```js
var Cls2 = think.Class({
  getName: function(){

  }
}, true);
```


##### Inherit Other classes

```js
// inherit from Cls2
var Cls3 = think.Class(Cls2, {
  init: function(name){
    this.name = name;
  },
  getName: function(){

  }
})
```


##### Instantiate a Class

```js
// instantiate a class which will call `init` function automatically
var instance = new Cls3('thinkjs');
```

#### think.extend(target, source1, source2, ...)

* `target` {Object} directory object
* `source1`  {Mixed} source object
* `return`  {Object} directory object

It will copy methods or functions from source1, source2 and some other object to `target` object, it is similar to the `$.extend` in `jQuery`.

Deep copy by default, you can assign the first arugment to `false` if you want shallow copy.

```js
think.extend({}, {name: 'foo'}, {value: 'bar'});
// returns 
{name: 'foo', value: 'bar'}
```

#### think.isBoolean(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is Boolean type or not.

```js
think.isBoolean(true); //true
think.isBoolean(false); //true
think.isBoolean('string'); //false
```


#### think.isNumber(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is Number type or not.

```js
think.isNumber(1); //true
think.isNumber(1.21); //true
```

#### think.isObject(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is object type or not.

```js
think.isObject({}); //true
think.isObject({name: "welefen"}); //true
think.isObject(new Buffer('welefen')); //false
```

#### think.isString(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is string type or not.

```js
think.isString("xxx"); // true
think.isString(new String("xxx")); //true
```

#### think.isFunction(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is function type or not.

```js
think.isFunction(function(){}); //true
think.isFunction(new Function("")); //true
```

#### think.isDate(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is date type or not.

```js
think.isDate(new Date()); //true
```

#### think.isRegExp(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is regular expression or not.

```js
think.isRegExp(/\w+/); //true
think.isRegExp(new RegExp("/\\w+/")); //true
```

#### think.isError(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether whether this object is error type or not.

```js
think.isError(new Error("xxx")); //true
```

#### think.isEmpty(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is empty or not.

```js
// check is empty or not
think.isEmpty({}); //true
think.isEmpty([]); //true
think.isEmpty(""); //true
think.isEmpty(0); //true
think.isEmpty(null); //true
think.isEmpty(undefined); //true
think.isEmpty(false); //true
```


#### think.isArray(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is array or not.

```js
think.isArray([]); //true
think.isArray([1, 2]); //true
think.isArray(new Array(10)); //true
```


#### think.isIP4(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is IP4 or not.

```js
think.isIP4("10.0.0.1"); //true
think.isIP4("192.168.1.1"); //true
```


#### think.isIP6(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is IP6 or not.

```js
think.isIP6("2031:0000:130f:0000:0000:09c0:876a:130b"); //true
think.isIP6("2031:0000:130f::09c0:876a:130b"); //true
```

#### think.isIP(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is IP or not.

```js
think.isIP("10.0.0.1"); //true
think.isIP("192.168.1.1"); //true
think.isIP("2031:0000:130f:0000:0000:09c0:876a:130b"); //true ip6
```

#### think.isFile(file)

* `file` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is IP or not, if file did't exist, return false.

```js
think.isFile("/home/welefen/a.txt"); //true
think.isFile("/home/welefen/dirname"); //false
```

#### think.isDir(dir)

* `dir` {Mixed} the path to check
* `return` {Boolean}

Check whether this path is directory or not. if not, return false.

```js
think.isDir("/home/welefen/dirname"); //true
```

#### think.isBuffer(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is buffer object or not.

```js
think.isBuffer(new Buffer(20)); //true
```

#### think.isNumberString(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is string type of number or not.

```js
think.isNumberString(1); //true
think.isNumberString("1"); //true
think.isNumberString("1.23"); //true
```

#### think.isPromise(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is promise object or not.

```js
think.isPromise(new Promise(function(){})); //true
think.isPromise(getPromise()); //true
```

#### think.isHttp(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is http object or not.

```js
think.isHttp(http); // true
```

#### think.isWritable(path)

* `path` {String} the path of directory or file
* `return` {Boolean}

Check whether this file or directory can write or not. if not, return false.


#### think.isPrevent(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check whether this object is prevent type of promise or not, through `think.prevent()` will generate this type of promise.

#### think.mkdir(p, mode)

* `p` {String} the name of directory
* `mode` {Number} the permission of directory , 0777 by default.

Function will create directory recursively, if directory is exist. this function will modify the permission of the directory.

```js
// if /home/welefen/a/b/ didn't exist
think.mkdir("/home/welefen/a/b");
think.mkdir("home/welefne/a/b/c/d/e"); // create directory recursively
```

#### think.rmdir(p, reserve)

* `p` {String} the path of directory to delete.
* `reserve` {Boolean} whether to keep this directory or not, if value is true, this function will only delete subdirectory.
* `return` {Promise}

Function will delete directory recursively, if directory is not exist, this function will return directly. or this function will return a promise object, then you can use its `then` to operate.

```js
function rmTmp(){
  think.rmdir('/foo/bar').then(function(){
    // some operation
  })
}
```

if use `Generator Function`, you can use `yield`:

```js
function * rmTmp(){
  yield think.rmdir('/foo/bar');
  // some operation
}
```

#### think.chmod(p, mode)

* `p` {String} the path of directory
* `mode` {Number} the permission of directory , 0777 by default.

Change the permission of directory, if directory didn't exist, function will return null directly.

```js
think.chmod("/home/welefen/a", 0777);
```


#### think.md5(str)

* `str` {String} the string which need to generate md5.
* `return` {String} md5 value

Generate md5 value.

```js
think.md5('thinkjs'); 
// returns
7821eb623e0b1138a47db6a88c3f56bc
```


#### think.defer()

* `return` {Object} Deferred object

Create a `Deferred` object, which is a shortcut of `Promise`. Sometimes have to use this function with some operation like `setTimeout`, `event`, though this is not a recommend way.

```js
// the way using Deferred
var fn = function(){
  var deferred = think.defer();
  process.nextTick(function(){
    if(xxx){
      deferred.resolve(data);
    }else{
      deferred.reject(err);
    }
  })
  return deferred.promise;
}
```

The way using `Deferred` is much cleaner than the way using `new Promise`.

```js
// the way using new Promise
var fn = function(){
  return new Promise(function(resolve, reject){
    process.nextTick(function(){
      if(xxx){
        resolve(data);
      }else{
        reject(err);
      }
    })
  })
}
```

Notice: asynchronous callback operations DONT use the `Deferred` way, instead of encapsulate `callback` to `Promise` with using `think.promisify`.

#### think.promisify(fn, receiver)

* `fn` {Function} function which to be promisify
* `receiver` {Object} where is `this` point to.

Encapsulate asynchronous functions to Promise quickly, the last argument of asynchronous functions must be a callback, which has an error handler of first argument.

```js
var fs = require('fs');

// function which to get file content 
var getContent = function(filePath){
  // encapsulate readFile to Promise
  var readFilePromise = think.promisify(fs.readFile, fs);
  // read file content
  return readFilePromise(filePath, 'utf8');
}

// get file content
getContent('/foo/bar/file.txt').then(function(content){
  console.log(content);
}).catch(function(err){
  console.error(err.stack);
})
```


#### think.reject(err)

* `err` {Error} Error object
* `return` {Promise} reject promise

Return a reject promise, and the difference between this and `Promise.reject` is this function will print error message automaticallly, which can avoid calling `catch` function to print error message by hand.

```js
// use Promise.reject
var fn = function(){
  return Promise.reject(new Error('xxx'));
}
//but need to print error massage with `catch` by hand.
fn().catch(function(err){
  console.error(err.stack);
})
``` 

```js
// use think.reject
var fn = function(){
  return think.reject(new Error("xxx"));
}
// will print formatted error message automactically.
fn();
```

#### think.co

The alias of modules is [co](https://github.com/tj/co)

#### think.lookClass(name, type, module, base)

* `name` {String} class name
* `type` {String} type (controller | model | logic ...)
* `module` {String} module name
* `base` {String} find base class if cannot find module

Find class with type or name of class. if cannot find module, program will find module in common module, if still cannot find module, program will the baseclass.

```js
// find user controller in home module 
// if cannot find, will find in common module
// if still cannot find, will find in base controller
think.lookClass("user", "controller", "home"); 

// find user controller in admin module 
think.lookClass("admin/user", "controller");
```

#### think.getPath(module, type, prefix)

* `module` {String} module name
* `type` {String} type, like controller, model, logic
* `prefix` {String} prefix

Get the path of module based on current project mode.

```js
let path = think.getPath('home', 'controller');
```

If root path of current project is `/foo/bar`, then the return path is:

* project mode is `think.mode_normal` then the path is `/foo/bar/app/controller/home`
* project mode is `think.mode_module` then the path is `/foo/bar/app/home/controller`

#### think.require(name, flag)

* `name` {String} 
* `flag` {Boolean}

#### think.safeRequire(file)

* `file` {String} the file to load

To load a file safely, if file didn't exist, function will return null, and print error message at the same time.

#### think.prevent()

return a special `reject promise`, this promise can stop follow-up work, and not report error.

#### think.log(msg, type, showTime)

* `msg` {String | Error} message
* `type` {String} type
* `showTime` {Number | Boolean} whether show time or not.

Print logs, which contains time, type and some other information.

```js
think.log('WebSocket Status: closed', 'THINK');
//writes '[2015-09-23 17:43:00] [THINK] WebSocket Status: closed'
```

##### Print error message
```js
think.log(new Error('error'), 'ERROR');
//writes '[2015-09-23 17:50:17] [Error] Error: error'
```

##### Print execute time

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', startTime);
//writes '[2015-09-23 17:52:13] [HTTP] /static/module/jquery/1.9.1/jquery.js 10ms'
```

##### Don't show log time

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', null);
//writes '[HTTP] /static/module/jquery/1.9.1/jquery.js'
```

##### Log by custom ##### 

```js
think.log(function(colors){
  return colors.yellow('[WARNING]') + ' test';
});
//writes '[WARNING] test'
```

By the way, `colors` is a [module](https://github.com/Marak/colors.js) named `colors` in npm modules.

#### think.config(name, value, data)

* `name` {String} config name
* `value` {Mixed} config value
* `data` {Object} config object

Read or setup config, it could be the global config object.

```js
// get the config
let value = think.config('name');
// get config in admin module
let value = think.config('name', undefined, 'admin');

// write into config
think.config('name', 'value');
```

#### think.getModuleConfig(module)

* `module` {String} module name
* `return` {Object}

Get all config of module, which contains config of module, comon module and the framework default config.

```js
// get all config of admin module
let configs = think.getModuleConfig('admin');
```

#### think.hook()

Register, get and execute hook, what can be appended or modified if need.

##### Get event's middleware list

```js
think.hook('view_template');
//returns
['locate_template']
```

##### Setup hook

```js
// replace ex-hook
think.hook('view_template', ['locate_template1']);

// insert before old one
think.hook('view_template', ['locate_template1'], 'prepend');

// insert after old one
think.hook('view_template', ['locate_template1'], 'append');

```

##### Delete hook

```js
think.hook('view_template', null);
```

##### Execute hook

```js
let result = think.hook('view_template', http, data);
//result is a promise
```

#### think.middleware()

Register, create, get and execute middleware.

##### Create middleware

```js
// analyzing XML example
var ParseXML = think.middleware({
  run: function(){
    var http = this.http;
    return http.getPayload().then(function(payload){
      var data = xmlParse.parse(payload); // use a xml parser, this xmlParse here is an example
      http._post = data; // assign parsed data to http._post, then can get data from http._post('xxx')
    });
  }
});
```

##### Using ES6 to create middleware

```js
let Cls1 = class extends think.middleware.base {
  run(){
    let http = this.http;
  }
}
```

##### Register middleware

middleware can be sample function, or complex class.

```js
// register a functional middleware
think.middleware('parse_xml', http => {
  
})
```

```js
// redister a class middleware
// it will call run automatically
let Cls = think.middleware({
  run: function(){
    let http = this.http;

  }
});
think.middleware('parse_xml', Cls);
```

##### Get middleware

```js
let middleware = think.middleware('parse_xml');
```

##### Execute middleware

```js
let result = think.middleware('parse_xml', http);
//result is a promise
```


#### think.adapter()

Create, register, get and execute adapter.

##### Create adapter

```js
// create an adapter
var Cls = think.adapter({

});

// create a session adapter, which instance of session base class
var Cls = think.adapter('session', 'base', {
  
})
```

```js
// create a session adapter in ES6
let Cls = class extends think.adapter.session {

}
```

##### Register adapter

```js
// register some type of session adapter
think.adapter('session', 'xxx', Cls);
```

##### Get adapter

```js
// get file type of session adapter
let Cls = think.adapter('session', 'file');
```

##### Execute adapter

```js
let Adapter = think.adapter('session', 'file');
let instance = new Adapter(options);
```


#### think.gc(instance)

* `instance` {Object} instance of object

Register a instance object to garbage collection queue, the instance object must have `gcType` method and `gc` function.

Something like cache or session which have expiration time, when after expire need to clean up.framewokr offered some handlers to clean expired file.

```js
let Cls = class extends think.adapter.cache {
  init(options){
    super.init(options);
    this.gcType = 'xFileCache';
    think.gc(this);
  }
  gc(){
    // find expired content to clean.
  }
}
```

#### think.http(req, res)

* `req` {Object} request object
* `res` {Object} response object
* `return` {Promise}

Base on request and response packed into http object, by the way, req and res could be other obecjt by custom.

```js
// based on an url object packed into a http object, which is useful to command mode calling.
think.http('/index/test').then(http => {
  
});
```

#### think.uuid(length)

* `length` {Number} the length of generate string, 32 by default

Generate a random string.


#### think.session(http)

* `http` {Object} http object

Generate a session, and write it to http object, if exist, return directly.

#### think.controller()

Create and execute a controller

##### Create controller

```js
// create controller, instance of think.controller.base
let Cls = think.controller({
  
})
// create controller, instance of think.controller.rest
let Cls = think.controller('rest', {
  
})
```

```js
// create a controller by using ES6
let Cls1 = class extends think.controller.base {
  
}
```

##### Instance of controller

```js
// instance of user controller belong to home module
let instance = think.controller('user', http, 'home');
```


#### think.logic()

Create and execute logic

##### Create logic

```js
// create logic, which instance of think.logic.base
let Cls = think.logic({
  
})
```

```js
// create logic by using ES6
let Cls1 = class extends think.logic.base {
  
}
```

##### Instance of logic

```js
// instance of user logic which is belong to home 
let instance = think.logic('user', http, 'home');
```


#### think.model()

Create or get model。

##### Create model

```js
// Create a model
let model = think.model({
  getList: function(){

  }
});

// in ES6 , instance of think.model.base class directly
let model = class extends think.model.base {
  getList(){

  }
}


// create a model which instance of mongo model
let model = think.model('mongo', {
  getList: function(){

  }
});
// in ES6, instance of think.model.mongo class directly
let model = class extends think.model.mongo {
  getList(){

  }
}
```


##### get the instance of model 

```js
let configs = {
  host: '127.0.0.1',
  name: 'user'
}
// get user model which is belong to home module.
let instance = think.model('user', configs, 'home');
```

#### think.service()

Create or get service。

##### Create service ##### 

```js
// Create a service class
let service = think.service({
  
})

// in ES6 , instance of think.service.base class directly
let service = class extends think.service.base {

}
```

service base class based on [think.base](./api_think_base.html)，so can use functions in think.base.

if don't want to write serivce to class, so it's not necessary to create by using this way.


##### get service

```js
// get post service which belong to home module, passed a `{}` 
// if got service is a class, it will be instancing automatically
think.service('post', {}, 'home');
```


#### think.cache(name, value, options)

* `name` {String} cache key
* `value` {Mixed} cache value
* `options` {Object} cache options
* `return` {Promise} return a Promise

Get, setup or delete cache, value is `undefined` means read cache, value is `null` means delete cache.
if value assigned to `Function` means read cache but when cannot got a result, this function will be calling, then return the function return value which has been setup to cache.


```js
// get cache
think.cache('name').then(data => {});

// setup the type of cache, read cache from redis for example
think.cache('name', undefined, {type: 'redis'});

// if cache userList is not exist, then query the database, assign return value to cache
think.cache('userList', () => {
  return think.model('user').select();
});

// setup cache
think.cache('name', 'value');

// delete cache
think.cache('name', null);
```

#### think.locale(key, ...data)

* `key` {String} the key which need to get
* `data` {Array} arguments

Get the corresponding value based on language, the current language can get from `think.lang`, which can setup when system start.

```js
think.locale('CONTROLLER_NOT_FOUND', 'test', '/index/test');
//returns 
'controller `test` not found. url is `/index/test`.'
```


#### think.validate()

Register, get or execute validation.

##### register validate function

```js
// register the validate type is not_number
think.validate('not_number', value => {
  return !(/^\d+$/.test(value));
})
```

##### get validate function

```js
let fn = think.validate('not_number');
```

##### validate data

```js
let result = think.validate({
  name: {
    value: 'name',
    required: true,
    not_number: true
  },
  pwd: {
    value: 'xxx',
    required: true,
    minLength: 6
  }
});
// if result is isEmpty, it means result is expected.
if(think.isEmpty(result)){

}
```

#### think.await(key, callback)

* `key` {String} 
* `callback` {Function}

Execute await, to avoid a long-running operation has been called many times, 

For example, one user request that get data from a remote interface can not be processed in time will result in a large number of similar requests, it's a wasting of resources. So these users can share a common request to the remote interface.


```js

import superagent from 'superagent';

export default class extends think.controller.base {
  * indexAction(){
    let result = yield think.await('get_xxx_data', () => {
      let req = superagent.post('xxxx');
      let fn = think.promisify(req.end, req);
      return fn();
    });
    this.success(result);
  }
}
```


#### think.npm(pkg)

* `pkg` {String} module name

Load module, if module not exist, module will been install automatically.

```js
// if mysql module exist, project will install it with npm.
let mysql = think.npm('mysql');
```

```js
// load a specify version of mysql
let mysql = think.npm('mysql@2.0.0')
```

#### think.error(err, addon)

* `err` {Error | Promise | String} error information
* `addon` {Error | String} addon error meesage.


Formatting error message, make some system error message completely.

```js
let error = think.error(new Error('xxx'));
```

##### Catch promise error message

```js
let promise = Project.reject(new Error('xxx'));
promise = think.error(promise)
```

Add catch for promise automatically, to catch error message.

#### think.statusAction(status, http, log)

* `status` {Number} status number
* `http` {Object} contained http object
* `log` {Boolean} whether log error message or not

When system is abnormal like system error, page not found, permission denied, then render the right page.

while creating project, it will generate file `src/common/controller/error.js` in common module, which is specially use for handle error state.

Default support types of error are: `400`, `403`, `404`, `500`, `503`.

According to the project's need, it can be modified like error page or extension.

```js
export default class extends think.controller.base {
  indexAction(){
    if(xxxx){
      let error = new Error('not found');
      // assign error information to http object, to render with template
      this.http.error = error;
      return think.statusAction(404, this.http);
    }
  }
}
```

### Class

#### think.base

think.base: More information read [here](./api_think_base.html)

#### think.http.base

think.http.base: More information read [here](./api_think_http_base.html)
