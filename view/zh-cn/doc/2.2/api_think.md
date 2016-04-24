## think

`think` 是一个全局对象，该对象里包含了大量有用的属性和方法。这些方法在应用的任何地方都可以直接使用，无需再 require。

### 属性

#### think.startTime

服务启动时间，是个 `unix` 时间戳。

#### think.env

当前项目运行的环境，默认支持下面 3 个值，可以在项目启动时指定：

* `development` 开发环境，会自动更新修改的文件
* `testing` 测试环境
* `production` 线上环境，代码上线时使用

#### think.dirname

项目的文件夹名称，可以在项目启动时指定，默认值如下：

```js
think.dirname = {
  config: 'config', //配置文件目录
  controller: 'controller', //控制器目录
  model: 'model', //模型目录
  adapter: 'adapter', //适配器目录
  logic: 'logic', //逻辑目录
  service: 'service', //服务目录
  view: 'view', //视图目录
  middleware: 'middleware', //中间件目录
  common: 'common', //通用目录
  bootstrap: 'bootstrap', //启动目录 
  locale: 'locale' //本土化目录
}
```

#### think.port

项目运行的端口，可以在项目启动时指定。如果指定，则忽略配置文件里的端口。

#### think.sep

目录分隔符，等同于 `path.sep`。

#### think.isMaster

是否是 master 进程。

#### think.cli

是否是命令行模式在运行项目，默认为 `false`。如果是命令行模式，则该值为传递的参数，可以通过下面的方式启动命令行模式。

```
node www/index.js /home/index/test
```

#### think.lang

系统当前的语言，从环境变量中读取，在 `Windows` 下可能为空。

#### think.mode

项目当前的模式，框架支持 2 中项目模式：

* `think.mode_normal` 多模块模式，目录结构只有 `Controller`，`View`，`Logic` 等分模块
* `think.mode_module` 多模块模式，严格按照模块来划分目录结构

#### think.version

ThinkJS当前的版本

#### think.module

当前项目下的模块列表。

#### think.THINK_PATH

ThinkJS代码的路径

#### think.THINK_LIB_PATH

ThinkJS代码 `lib/` 的具体路径

#### think.ROOT_PATH

项目的根目录，在 `www/index.js` 中定义

#### think.APP_PATH

项目的 `app` 目录，在 `www/index.js` 中定义

#### think.RESOURCE_PATH

项目的静态资源根目录，在 `www/index.js` 中定义

#### think.RUNTIME_PATH

Runtime 目录，默认为当前项目下的 `runtime/` 目录。

### 方法

#### think.Class(methods, clean)

动态的创建一个类，默认继承自 think.base 。 如果使用 ES6 特性进行开发的话，可以直接使用 ES6 里的 class 来创建类。

```js
//继承自 think.base
var Cls1 = think.Class({
  getName: function(){

  }
})
```


##### 不继承 think.base ##### 

```js
var Cls2 = think.Class({
  getName: function(){

  }
}, true);
```


##### 继承一个类

```js
//继承自 Cls2
var Cls3 = think.Class(Cls2, {
  init: function(name){
    this.name = name;
  },
  getName: function(){

  }
})
```


##### 实例化类

```js
//获取类的实例，自动调用 init 方法
var instance = new Cls3('thinkjs');
```

#### think.extend(target, source1, source2, ...)

* `target` {Object} 目录对象
* `source1`  {Mixed} 源对象1
* `return`  {Object} 目录对象

将 source1, source2 等对象上的属性或方法复制到 target 对象上，类似于 jQuery 里的 $.extend 方法。

默认为深度复制，可以将第一个参数传 `false` 进行浅度复制。  

```js
think.extend({}, {name: 'foo'}, {value: 'bar'});
// returns 
{name: 'foo', value: 'bar'}
```

#### think.isBoolean(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测一个对象是否是布尔值。

```js
think.isBoolean(true); //true
think.isBoolean(false); //true
think.isBoolean('string'); //false
```


#### think.isNumber(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测一个对象是否是数字。

```js
think.isNumber(1); //true
think.isNumber(1.21); //true
```

#### think.isObject(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是对象

```js
think.isObject({}); //true
think.isObject({name: "welefen"}); //true
think.isObject(new Buffer('welefen')); //false
```

#### think.isString(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是字符串

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


#### think.isFileAsync(file)

* `file` {Mixed} 要检测的文件路径
* `return` {Boolean}

异步检测是否是文件，返回一个 Promise。该方法在 `2.1.5` 版本中添加。

#### think.isDir(dir)

* `dir` {Mixed} 要检测的路径
* `return` {Boolean}

检测是否是目录，如果不存在则返回 false

```js
think.isDir("/home/welefen/dirname"); //true
```

#### think.isDirAsync(dir)

* `dir` {Mixed} 要检测的路径
* `return` {Boolean}

异步检测是否是目录，返回 Promise。该方法在 `2.1.5` 版本中添加。

#### think.datetime(date)

* `date` {Date} 
* `return` {String}

返回一个格式化的日期，格式为：`YYYY-MM-DD HH:ii:ss`，如：

```js
let str = think.datetime();
//str is 2016-02-01 10:00:00
```

该方法在 `2.1.5` 版本中添加。

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

判断是否是个阻止类型的 Promise。通过 think.prevent() 会生成该 Promise 。

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

* `str` {String} 要计算的字符串
* `return` {String} 返回字符串的 md5 值

计算字符串的 md5 值

```js
think.md5('thinkjs'); 
// returns 7821eb623e0b1138a47db6a88c3f56bc
```


#### think.camelCase(sr)

* `str` {String} 要转换的字符串
* `return` {String}

转换为驼峰方式

```js
think.camelCase('a_bbb_ccc');
//returns aBbbCcc
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

将异步方法快速包装成 Promise，异步方法必须符合最后一个参数为回调函数，且回调函数的第一个参数为 `err` 的原则。

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
    return http.getPayload().then(function(payload){
      var data = xmlParse.parse(payload); //使用一个xml解析，这里 xmlParse 是示例
      http._post = data; //将解析后的数据赋值给 http._post，后续可以通过 http.post('xxx') 获取 
    });
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

#### think.parseConfig(...args)

解析配置里的 `adapter` 和 `parser`，如：

```js
let config = think.parseConfig({prefix: 'think_'}, {
  type: 'mysql',
  adapter: {
    mysql: {
      prefix: 'test_',
      host: ['10.0.0.1', '10.0.0.2'],
      parser: options => {
        return {
          host: '10.0.0.1'
        }
      }
    }
  }
});
// config value is {prefix: 'test_', host: '10.0.0.1'}
```

如果只想解析 `adapter`，而不解析 `parser`，可以通过传递第一个参数为 `true`，如：

```js
let config = think.parseConfig(true, {prefix: 'think_'}, {
  type: 'mysql',
  adapter: {
    mysql: {
      prefix: 'test_',
      host: ['10.0.0.1', '10.0.0.2'],
      parser: options => {
        return {
          host: '10.0.0.1'
        }
      }
    }
  }
});
// config value is {prefix: 'test_', ['10.0.0.1', '10.0.0.2'], parser: function(){...}}
```

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

创建或者获取 model

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

创建或者获取 service

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

执行等待，避免一个耗时的操作多次被执行。 callback 需要返回一个 Promise 。

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

#### think.parallelLimit(dataList, callback, options)

* `dataList` {Array} 要处理的数据列表
* `callback` {Function} 处理函数，会将每条数据传递进去，需要返回 Promise
* `options` {Object} 额外选项
* `return` {Promise}

`options` 包含一下选项：

* `limit` {Number} 并发限制数，默认为 10 条
* `ignoreError` {Boolean} 是否忽略错误，默认情况下一个错误后会停止后续执行

并发限制处理方法。如：有 10000 条网络数据需要处理，如果同时处理会会网络 IO 错误，此时可以对并发处理进行限制。该方法在 `2.0.6` 版本中添加。

##### 一个请求下多条数据同时处理场景

```js
import superagent from 'superagent';

export default class extends think.controller.base {
  async indexAction(){
    let dataList = [...];
    //result 为每条处理结果集合
    //如果某些条数据处理异常，那么对应的数据为 undefined，处理时需要过滤下
    let result = await think.parallelLimit(dataList, item => {
      let url = item.url;
      let req = superagent.get(url);
      let fn = think.promisify(req.end, req); //将 end 方法包装成 Promise
      return fn();
    }, {
      limit: 20, //一次执行 20 条
      ignoreError: true
    })
  }
}
```

##### 单条数据在多个请求下处理场景

有些数据处理虽在一个情况下只用处理一次，但单次处理比较耗时，如果同时请求很多的话可能会导致报错。这个时候也要进行限制，如果当前同时处理数目较多，后续请求则进行等待。

这个需求可以通过传入一个相同的 key 将任务分组，如：

```js
import gm from 'gm';

export default class extends think.controller.base {
  async indexAction(){
    let result = await think.parallelLimit('clip_image', () => {
      let imageFile = this.file('image').path;
      let instance = gm(imageFile).resize(240, 240).noProfile();
      let fn = think.promisify(instance.write, instance);
      return fn('/path/to/save/image.png');
    }, {
      limit: 20 //一次执行 20 条
    })
  }
}
```


### 类

#### think.base

think.base 详细介绍请见 [这里](./api_think_base.html)

#### think.http.base

think.http.base 详细介绍请见 [这里](./api_think_http_base.html)