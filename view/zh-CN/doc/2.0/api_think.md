## think

`think`是一个全局对象，该对象里包含了大量有用的属性和方法。这些方法在应用的任何地方都可以直接使用，无需再 require。

### 属性

#### think.startTime

服务启动时间，是个`unix`时间戳。

#### think.env

当前项目运行的环境，默认支持下面3个值，可以在项目启动时指定：

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
  runtime: 'runtime', //运行时目录
  common: 'common', //通用目录
  bootstrap: 'bootstrap', //启动目录 
  locale: 'locale' //本土化目录
}
```

#### think.port

项目运行的端口，可以在项目启动时指定。如果指定，则忽略配置文件里的端口。

#### think.cli

是否是命令行模式在运行项目，默认为`false`。如果是命令行模式，则该值为传递的参数，可以通过下面的方式启动命令行模式。

```
node www/index.js /home/index/test
```

#### think.lang

系统当前的语言，从环境变量中读取，在`windows`下可能为空。

#### think.mode

项目当前的模式，框架支持3中项目模式：

* `think.mode_mini` 单模块模式，整个项目只有一个模块
* `think.mode_normal` 多模块模式，目录结构只有`Controller`，`View`，`Logic`等分模块
* `think.mode_module` 多模块模式，严格按照模块来划分目录结构

#### think.version

ThinkJS当前的版本

#### think.module

当前项目下的模块列表，如果项目模式是`think.mode_mini`，那么值为空数组。

#### think.THINK_PATH

ThinkJS代码的路径

#### think.THINK_LIB_PATH

ThinkJS代码`lib/`的具体路径

#### think.ROOT_PATH

项目的根目录，在`www/index.js`中定义

#### think.APP_PATH

项目的`app`目录，在`www/index.js`中定义

#### think.RESOURCE_PATH

项目的静态资源根目录，在`www/index.js`中定义




### 方法


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

#### think.isRegexp(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是正则

```js
think.isRegexp(/\w+/); //true
think.isRegexp(new RegExp("/\\w+/")); //true
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

检测是否是个 promise

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
* `reserve` {Boolean} 是否保留该目录。如果为true，则只删除子目录
* `return` {Promise}

递归的删除目录，如果目录不存在则直接返回。返回是个Promise，后续操作要在`then`里执行

```js
function rmTmp(){
  think.rmdir('/foo/bar').then(function(){
    //后续其他操作
  })
}
```

如果使用`Generator Function`，则可以使用`yield`

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

创建一个`Deferred`对象，`new Promise`的一种快捷方式。虽然不建议使用`Deferred`这种方式，但有时候不得不使用。如：`setTimeout`, `event`。

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

使用`Deferred`方式比直接使用`new Promise`的方法代码更加简洁。

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

注： 异步`callback`的操作不要使用`Deferred`方式，可以用`think.promisify`方法快速把`callback`包装成`Promise`。

#### think.promisify(fn, receiver)

* `fn` {Function} 要转化的函数
* `receiver` {Object} this指向

将异步方法快速包装成Promise，异步方法必须符合最后一个参数为回调函数，且回调函数的第一个参数为`err`的原则。

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

返回一个 reject promise，与`Promise.reject`不同的是，该方法会自动打印错误信息。避免需要调用 catch 方法手工打印错误信息。

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

`co`模块的别名 <https://github.com/tj/co>


### 类

#### think.base