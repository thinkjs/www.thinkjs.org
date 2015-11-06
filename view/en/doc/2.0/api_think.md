## think

`think` is a global object  contains lots of useful methods and functions which can use without `require` in anywhere of your application.

### Method

#### think.startTime

The start time of service, it’s a unix timestamp.

#### think.env

The current environment of application, support three value below by default, you can set it when application start:

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

Whether application is run under command mode, false by default. if it is command mode, this variable return command arguments. You can use this way to start command mode:

```
node www/index.js /home/index/test
```

#### think.lang

The current language  of system, it read from the environment, which maybe empty in windows system.

#### think.mode

The current mode of application, framework support three mode in project:

* `think.mode_mini` single module mode, all of project is one module.
* `think.mode_normal` multiple modules mode, directory of project is separated to Controller, View, Logic and some other modules.
* `think.mode_module` multiple modules mode, but more stringent separate project with modules than normal mode.

#### think.version

The current version of ThinkJS.

#### think.module

The list of modules of project, if current mode is `mode_mini`, this variable return a empty array.

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




### 方法

#### think.Class(methods, clean)

This function will automatically create a class, which inherit from `think.base` by default. you can use `class` to create class in ES6 if project is using ES6.

```js
// inherit from think.base
var Cls1 = think.Class({
  getName: function(){

  }
})
```


##### didnot inherit think.base ##### 

```js
var Cls2 = think.Class({
  getName: function(){

  }
}, true);
```


##### Inherit from an other class

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


##### Instance a class

```js
// instance a class which will call `init` function automatically
var instance = new Cls3('thinkjs');
```

#### think.extend(target, source1, source2, ...)

* `target` {Object} directory object
* `source1`  {Mixed} source object
* `return`  {Object} directory object

It will copy methods or functions from source1, source2 and some other object to `target` object, it looks like `$.extend` in `jQuery`.

Deep copy by default, you can assign the first arugment to `false` if you want shallow copy.

```js
think.extend({}, {name: 'foo'}, {value: 'bar'});
// returns 
{name: 'foo', value: 'bar'}
```

#### think.isBoolean(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check this object is Boolean type or not.

```js
think.isBoolean(true); //true
think.isBoolean(false); //true
think.isBoolean('string'); //false
```


#### think.isNumber(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check this object is Number type or not.

```js
think.isNumber(1); //true
think.isNumber(1.21); //true
```

#### think.isObject(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check this object is object type or not.

```js
think.isObject({}); //true
think.isObject({name: "welefen"}); //true
think.isObject(new Buffer('welefen')); //false
```

#### think.isString(obj)

* `obj` {Mixed} object which need to check
* `return` {Boolean}

Check this object is string type or not.

```js
think.isString("xxx"); // true
think.isString(new String("xxx")); //true
```

#### think.isFunction(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是函数

```js
think.isFunction(function(){}); //true
think.isFunction(new Function("")); //true
```

#### think.isDate(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是日期对象

```js
think.isDate(new Date()); //true
```

#### think.isRegExp(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是正则

```js
think.isRegExp(/\w+/); //true
think.isRegExp(new RegExp("/\\w+/")); //true
```

#### think.isError(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是个错误

```js
think.isError(new Error("xxx")); //true
```

#### think.isEmpty(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否为空

```js
// 检测是否为空
think.isEmpty({}); //true
think.isEmpty([]); //true
think.isEmpty(""); //true
think.isEmpty(0); //true
think.isEmpty(null); //true
think.isEmpty(undefined); //true
think.isEmpty(false); //true
```


#### think.isArray(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是数组

```js
think.isArray([]); //true
think.isArray([1, 2]); //true
think.isArray(new Array(10)); //true
```


#### think.isIP4(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP4

```js
think.isIP4("10.0.0.1"); //true
think.isIP4("192.168.1.1"); //true
```


#### think.isIP6(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP6

```js
think.isIP6("2031:0000:130f:0000:0000:09c0:876a:130b"); //true
think.isIP6("2031:0000:130f::09c0:876a:130b"); //true
```

#### think.isIP(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP

```js
think.isIP("10.0.0.1"); //true
think.isIP("192.168.1.1"); //true
think.isIP("2031:0000:130f:0000:0000:09c0:876a:130b"); //true ip6
```

#### think.isFile(file)

* `file` {Mixed} 要检测的文件路径
* `return` {Boolean}

检测是否是文件，如果在不存在则返回 false

```js
think.isFile("/home/welefen/a.txt"); //true
think.isFile("/home/welefen/dirname"); //false
```

#### think.isDir(dir)

* `dir` {Mixed} 要检测的路径
* `return` {Boolean}

检测是否是目录，如果不存在则返回 false

```js
think.isDir("/home/welefen/dirname"); //true
```

#### think.isBuffer(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 Buffer

```js
think.isBuffer(new Buffer(20)); //true
```

#### think.isNumberString(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

是否是字符串类型的数字

```js
think.isNumberString(1); //true
think.isNumberString("1"); //true
think.isNumberString("1.23"); //true
```

#### think.isPromise(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是个 Promise

```js
think.isPromise(new Promise(function(){})); //true
think.isPromise(getPromise()); //true
```

#### think.isHttp(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是包装的 http 对象

```js
think.isHttp(http); // true
```

#### think.isWritable(path)

* `path` {String} 要写的目录
* `return` {Boolean}

判断文件或者目录是否可写，如果不存在则返回 false


#### think.isPrevent(obj)

* `obj` {Mixed}
* `return` {Boolean}

判断是否是个阻止类型的Ppromise。通过 think.prevent() 会生成该 Promise 。

#### think.mkdir(p, mode)

* `p` {String} 要创建的目录
* `mode` {Number} 要创建的目录权限，默认为 `0777`

递归的创建目录，如果目录已经存在，那么修改目录的权限。

```js
// 假设 /home/welefen/a/b/ 不存在
think.mkdir("/home/welefen/a/b");
think.mkdir("home/welefne/a/b/c/d/e"); // 递归创建子目录
```

#### think.rmdir(p, reserve)

* `p` {String} 要删除的目录
* `reserve` {Boolean} 是否保留该目录。如果为 true，则只删除子目录
* `return` {Promise}

递归的删除目录，如果目录不存在则直接返回。返回是个 Promise，后续操作要在 `then` 里执行

```js
function rmTmp(){
  think.rmdir('/foo/bar').then(function(){
    //后续其他操作
  })
}
```

如果使用 `Generator Function`，则可以使用 `yield`

```js
function * rmTmp(){
  yield think.rmdir('/foo/bar');
  //后续其他操作
}
```

#### think.chmod(p, mode)

* `p` {String} 要修改的目录
* `mode` {Number} 目录权限，默认为`0777`

修改目录权限，如果目录不存在则直接返回

```js
think.chmod("/home/welefen/a", 0777);
```


#### think.md5(str)

* `str` {String} 要计算md5值的字符串
* `return` {String} md5值

计算字符串的md5值

```js
think.md5('thinkjs'); 
// returns
7821eb623e0b1138a47db6a88c3f56bc
```


#### think.defer()

* `return` {Object} Deferred对象

创建一个 `Deferred` 对象，`new Promise` 的一种快捷方式。虽然不建议使用 `Deferred`这种方式，但有时候不得不使用。如：`setTimeout`, `event`。

```js
//使用Deferred的方式
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

使用 `Deferred` 方式比直接使用 `new Promise` 的方法代码更加简洁。

```js
//直接使用new Promise的方式
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

注： 异步 `callback` 的操作不要使用 `Deferred` 方式，可以用 `think.promisify` 方法快速把 `callback` 包装成 `Promise`。

#### think.promisify(fn, receiver)

* `fn` {Function} 要转化的函数
* `receiver` {Object} this指向

将异步方法快速包装成Promise，异步方法必须符合最后一个参数为回调函数，且回调函数的第一个参数为 `err`的原则。

```js
var fs = require('fs');

//获取文件内容
var getContent = function(filePath){
  //将readFile方法包装成Promise
  var readFilePromise = think.promisify(fs.readFile, fs);
  //读取文件内容
  return readFilePromise(filePath, 'utf8');
}

//获取具体的文件内容
getContent('/foo/bar/file.txt').then(function(content){
  console.log(content);
}).catch(function(err){
  console.error(err.stack);
})
```


#### think.reject(err)

* `err` {Error} Error对象
* `return` {Promise} reject promise

返回一个 reject promise，与 `Promise.reject`不同的是，该方法会自动打印错误信息。避免需要调用 catch 方法手工打印错误信息。

```js
//使用Promise.reject
var fn = function(){
  return Promise.reject(new Error('xxx'));
}
//需要手工调用catch方法打印错误信息
fn().catch(function(err){
  console.error(err.stack);
})
``` 

```js
//使用think.reject
var fn = function(){
  return think.reject(new Error('xxx'));
}
//会自动打印格式化后的错误信息
fn();
```

#### think.co

`co` 模块的别名 <https://github.com/tj/co>

#### think.lookClass(name, type, module, base)

* `name` {String} 类名
* `type` {String} 类型 (controller | model | logic ...)
* `module` {String} 模块名
* `base` {String} 找不到时找对应的基类

根据类型，名称来查找类。如果找不到会到 common 模块下查找，如果还是找不到，则查找对应类型的基类。

```js
//查找 home 模块下 user controller
//如果找不到，会找 common 模块下 user controller
//如果还是找不到，会找 base controller
think.lookClass('user', 'controller', 'home'); 

//查找 admin 模块下 user controller
think.lookClass('admin/user', 'controller');
```

#### think.getPath(module, type, prefix)

* `module` {String} 模块名
* `type` {String} 类型，如： controller, model, logic
* `prefix` {String} 前缀

根据当前项目类型获取对应类型的目录。

```js
let path = think.getPath('home', 'controller');
```

假如当前项目的根目录是`/foo/bar`，那么获取到的目录为：

* 项目模式`think.mode_mini` 下路径为 `/foo/bar/app/controller`
* 项目模式`think.mode_normal` 下路径为 `/foo/bar/app/controller/home`
* 项目模式`think.mode_module` 下路径为 `/foo/bar/app/home/controller`

#### think.require(name, flag)

* `name` {String} 
* `flag` {Boolean}

#### think.safeRequire(file)

* `file` {String} 要加载的文件

安全的加载一个文件，如果文件不存在，则返回 null，并打印错误信息。

#### think.prevent()

返回一个特殊的 reject promise 。该 Promise 可以阻止后续的行为且不会报错。

#### think.log(msg, type, showTime)

* `msg` {String | Error} 信息
* `type` {String} 类型
* `showTime` {Number | Boolean} 是否显示时间

打印日志，该方法打印出来的日志会有时间，类型等信息，方便查看和后续处理。

```js
think.log('WebSocket Status: closed', 'THINK');
//writes '[2015-09-23 17:43:00] [THINK] WebSocket Status: closed'
```

##### 打印错误信息
```js
think.log(new Error('error'), 'ERROR');
//writes '[2015-09-23 17:50:17] [Error] Error: error'
```

##### 显示执行时间

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', startTime);
//writes '[2015-09-23 17:52:13] [HTTP] /static/module/jquery/1.9.1/jquery.js 10ms'
```

##### 不显示时间

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', null);
//writes '[HTTP] /static/module/jquery/1.9.1/jquery.js'
```

##### 自定义 ##### 

```js
think.log(function(colors){
  return colors.yellow('[WARNING]') + ' test';
});
//writes '[WARNING] test'
```

其中 `colors` 为 npm 模块 colors，<https://github.com/Marak/colors.js> 。

#### think.config(name, value, data)

* `name` {String} 配置名称
* `value` {Mixed} 配置值
* `data` {Object} 配置对象

读取或者设置配置，可以指定总的配置对象。

```js
//获取配置
let value = think.config('name');
//获取 admin 模块下的配置
let value = think.config('name', undefined, 'admin');

// 写入配置
think.config('name', 'value');
```

#### think.getModuleConfig(module)

* `module` {String} 模块名称
* `return` {Object}

获取模块的所有配置。该配置包含模块的配置，通用模块的配置，框架默认的配置。

```js
//获取 admin 模块的所有配置
let configs = think.getModuleConfig('admin');
```

#### think.hook()

注册、获取和执行 hook，项目中可以根据需要追加或者修改。

##### 获取事件对应的 middleware 列表

```js
think.hook('view_template');
//returns
['locate_template']
```

##### 设置 hook

```js
//替换原有的 hook
think.hook('view_template', ['locate_template1']);

//将原有的之前追加
think.hook('view_template', ['locate_template1'], 'prepend');

//将原有的之后追加
think.hook('view_template', ['locate_template1'], 'append');

```

##### 删除 hook

```js
think.hook('view_template', null);
```

##### 执行 hook

```js
let result = think.hook('view_template', http, data);
//result is a promise
```

#### think.middleware()

注册、创建、获取和执行 middleware。

##### 创建 middleware

```js
//解析 XML 示例
var ParseXML = think.middleware({
  run: function(){
    var http = this.http;
    var payload = http.payload; //payload为上传的post数据
    var data = xmlParse.parse(payload); //使用一个xml解析，这里 xmlParse 是示例
    http._post = data; //将解析后的数据赋值给 http._post，后续可以通过 http.post('xxx') 获取
  }
});
```

使用 ES6 创建 middleware。

```js
let Cls1 = class extends think.middleware.base {
  run(){
    let http = this.http;
  }
}
```

##### 注册 middleware

middleware 可以是个简单的 function，也可以是较为复杂的 class。

```js
//注册 middleware 为 function
think.middleware('parse_xml', http => {
  
})
```

```js
//注册 middleware 为 class
//会自动调用 run 执行
let Cls = think.middleware({
  run: function(){
    let http = this.http;

  }
});
think.middleware('parse_xml', Cls);
```

##### 获取 middleware

```js
let middleware = think.middleware('parse_xml');
```

##### 执行 middleware

```js
let result = think.middleware('parse_xml', http);
//result is a promise
```


#### think.adapter()

创建、注册、获取和执行 adapter。

##### 创建 adapter

```js
//创建一个 adapter
var Cls = think.adapter({

});

//创建一个 session adapter，继承自 session base 类
var Cls = think.adapter('session', 'base', {
  
})
```

```js
//使用 ES6 创建一个 session adapter
let Cls = class extends think.adapter.session {

}
```

##### 注册 adapter

```js
//注册一个 xxx 类型的 session adapter
think.adapter('session', 'xxx', Cls);
```

##### 获取 adapter

```js
//获取 file 类型的 session adapter
let Cls = think.adapter('session', 'file');
```

##### 执行 adapter

```js
let Adapter = think.adapter('session', 'file');
let instance = new Adapter(options);
```


#### think.gc(instance)

* `instance` {Object} 类的实例

注册实例到 gc 队列中。instance 必须含有属性 `gcType` 和方法 `gc`。

像 cache, session 这些功能一般都是有过期时间，过期后需要要进行清除工作。框架提供了一套机制方便清除过期的文件等。

```js
let Cls = class extends think.adapter.cache {
  init(options){
    super.init(options);
    this.gcType = 'xFileCache';
    think.gc(this);
  }
  gc(){
    //寻找过期的内容并清除
  }
}
```

#### think.http(req, res)

* `req` {Object} request 对象
* `res` {Object} response 对象
* `return` {Promise}

根据 req 和 res 包装成 http 对象。req 和 res 可以自定义。

```js
//根据一个 url 生成一个 http 对象，方便命令行下调用
think.http('/index/test').then(http => {
  
});
```

#### think.uuid(length)

* `length` {Number} 生成字符串的长度，默认为 32

生成一个随机字符串。


#### think.session(http)

* `http` {Object} http对象

生成 session，并写到 http 对象上。如果已经存在，则直接返回。

#### think.controller()

创建、执行 controller

##### 创建 controller

```js
//创建 controller, 继承 think.controller.base
let Cls = think.controller({
  
})
//创建 controller, 继承 think.controller.rest
let Cls = think.controller('rest', {
  
})
```

```js
//使用 ES6 创建 controller
let Cls1 = class extends think.controller.base {
  
}
```

##### 实例化 controller

```js
//实例化 home 模块下 user controller
let instance = think.controller('user', http, 'home');
```


#### think.logic()

创建、执行 logic

##### 创建 logic

```js
//创建 logic, 继承 think.logic.base
let Cls = think.logic({
  
})
```

```js
//使用 ES6 创建 logic
let Cls1 = class extends think.logic.base {
  
}
```

##### 实例化 logic

```js
//实例化 home 模块下 user logic
let instance = think.logic('user', http, 'home');
```


#### think.model()

创建或者获取 model。

##### 创建 model

```js
//创建一个 model
let model = think.model({
  getList: function(){

  }
});

//ES6 里直接继承 think.model.base 类
let model = class extends think.model.base {
  getList(){

  }
}


//创建一个 model 继承自 mongo model
let model = think.model('mongo', {
  getList: function(){

  }
});
//ES6 里直接继承 think.model.mongo 类
let model = class extends think.model.mongo {
  getList(){

  }
}
```


##### 获取 model 实例

```js
let configs = {
  host: '127.0.0.1',
  name: 'user'
}
//获取 home 模块下 user model
let instance = think.model('user', configs, 'home');
```

#### think.service()

创建或者获取 service。

##### 创建 service ##### 

```js
//创建一个 service 类
let service = think.service({
  
})

//ES6 里直接继承 think.service.base 类
let service = class extends think.service.base {

}
```

service 基类继承自 [think.base](./api_think_base.html)，所以可以用 think.base 里的方法。

如果 serivce 不想写成类，那就没必要通过这种方法创建。


##### 获取 service

```js
//获取 home 模块下 post service，并传递参数 {} 
//如果获取到的 service 是个类，则自动实例化
think.service('post', {}, 'home');
```


#### think.cache(name, value, options)

* `name` {String} 缓存 key
* `value` {Mixed} 缓存值
* `options` {Object} 缓存选项
* `return` {Promise} 操作都是返回 Promise

获取、设置或者删除缓存， value 是 `undefined` 表示读取缓存。 value 是 `null` 时删除缓存。

value 为 `Function` 时表示获取缓存，如果获取不到，则调用该函数，然后将返回值设置到缓存中并返回。

```js
//获取缓存
think.cache('name').then(data => {});

//指定缓存类型获取，从 redis 里获取缓存
think.cache('name', undefined, {type: 'redis'});

//如果缓存 userList 不存在，则查询数据库，并将值设置到缓存中
think.cache('userList', () => {
  return think.model('user').select();
});

//设置缓存
think.cache('name', 'value');

//删除缓存
think.cache('name', null);
```

#### think.locale(key, ...data)

* `key` {String} 要获取的 key
* `data` {Array} 参数

根据语言获取对应的值，当前语言通过 `think.lang` 方法来获取，可以在系统启动时指定。

```js
think.locale('CONTROLLER_NOT_FOUND', 'test', '/index/test');
//returns 
'controller `test` not found. url is `/index/test`.'
```


#### think.validate()

注册、获取或执行检测。

##### 注册检测方法

```js
//注册检测类型为 not_number
think.validate('not_number', value => {
  return !(/^\d+$/.test(value));
})
```

##### 获取检测方法

```js
let fn = think.validate('not_number');
```

##### 检测数据

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
//如果 result 是 isEmpty，表示数据都正常
if(think.isEmpty(result)){

}
```

#### think.await(key, callback)

* `key` {String} 
* `callback` {Function}

执行等待，避免一个耗时的操作多次被执行。 callback 需要返回一个 promise 。

如：用户访问时，要请求一个远程的接口数据。如果不处理，每个用户请求都会触发这个远程接口的访问，导致有很大的资源浪费。可以让这些用户公用一个远程接口的请求。

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

* `pkg` {String} 模块名

加载模块。如果模块不存在，则自动安装。这样可以做到动态安装模块。

```js
//如果mysql模块，则通过npm安装
let mysql = think.npm('mysql');
```

```js
//指定版本加载一个模块
let mysql = think.npm('mysql@2.0.0')
```

#### think.error(err, addon)

* `err` {Error | Promise | String} 错误信息
* `addon` {Error | String} 追加的错误信息

格式化错误信息，将部分系统的错误信息描述完整化。

```js
let error = think.error(new Error('xxx'));
```

##### 捕获 promise 的错误信息

```js
let promise = Project.reject(new Error('xxx'));
promise = think.error(promise)
```

自动给 promise 追加 catch，捕获错误信息。

#### think.statusAction(status, http, log)

* `status` {Number} 状态码
* `http` {Object} 包装的http对象
* `log` {Boolean} 是否打印错误信息

当系统出现异常时（系统错误，页面找不到，没权限等），显示对应的错误页面。

创建项目时，会在 common 模块下生成文件 `src/common/controller/error.js`，专门用来处理错误情况。

默认支持的错误类型有：`400`, `403`, `404`, `500`, `503`。

项目里可以根据需要修改错误页面或者扩展。

```js
export default class extends think.controller.base {
  indexAction(){
    if(xxxx){
      let error = new Error('not found');
      //将错误信息写到 http 对象上，用于模版里显示
      this.http.error = error;
      return think.statusAction(404, this.http);
    }
  }
}
```

### 类

#### think.base

think.base 详细介绍请见 [这里](./api_think_base.html)

#### think.http.base

think.http.base 详细介绍请见 [这里](./api_think_http_base.html)