## think 对象

框架中内置 `think` 全局对象，方便在项目中随时随地使用。

### API

#### think.app

`think.app` 为 Koa [Application](https://github.com/koajs/koa/blob/master/lib/application.js#L61) 对象的实例，系统启动时生成。

此外为 app 扩展了更多的属性。

* `think.app.think` 等同于 think 对象，方便有些地方传入了 app 对象，同时要使用 think 对象上的其他方法
* `think.app.modules` 模块列表，单模块项目下为空数组
* `think.app.controllers` 存放项目下的 controller 文件，便于后续快速调用
* `think.app.logics` 存放项目下的 logic 文件
* `think.app.models` 存放项目下的模型文件
* `think.app.services` 存放 service 文件
* `think.app.routers` 存放自定义路由配置
* `think.app.validators` 存放校验配置

如果想要查下这些属性具体的值，可以在 `appReady` 事件中进行。

```js
think.app.on('appReady', () => {
  console.log(think.app.controllers)
})
```

#### think.ROOT_PATH

项目的根目录，其他目录可以通过该目录来生成，如：

```js
const runtimePath = path.join(think.ROOT_PATH, 'runtime/');
const viewPath = path.join(think.ROOT_PATH, 'view/');
```

#### think.APP_PATH

APP 根目录，默认为 `${think.ROOT_PATH}/app`，如果项目不需要转译的话，那么默认路径为：`${think.ROOT_PATH}/src`。


#### think.env

当前运行环境，等同于 `think.app.env`，值在 `development.js` 之类的入口文件中定义。

#### think.version

当前 ThinkJS 的版本号。

#### think.config(name, value, m)

* `name` {String} 配置名
* `value` {Mixed} 配置值
* `m` {String} 模块名，多模块项目下使用

读取或者设置配置，该功能由 [think-config](https://github.com/thinkjs/think-config) 模块实现。在 context、controller、logic 上可以直接通过 `this.config` 方法来操作配置。

```js
// 获取配置
const value1 = think.config('name');
// 指定模块获取配置，多模块项目下有效
const value2 = think.config('name', undefined, 'admin');

// 设置配置
think.config('name', 'value');
// 指定模块设置配置值
think.config('name', 'value', 'admin');
```

#### think.Controller

控制器基类。

#### think.Logic

Logic 基类，继承 `think.Controller`。


#### think.beforeStartServer(fn)

* `fn` {Function} 要注册的函数名

服务启动之前要注册执行的函数，如果有异步操作，fn 需要返回 Promise。

#### think.isArray(array)

* `array` {any} 判断输入是否是数组
* `return` {Boolean}

判断是否是数组，等同于 `Array.isArray`。

```js
think.isArray([]); // true
think.isArray({}); // false
```

#### think.isBoolean(boolean)

* `boolean` {any} 

判断输入是否是布尔值

```js
think.isBoolean(false); // true
```

#### think.isNull(any)

* `any` {any} 

判断输入是 `null`，也可以直接通过 `xxx === null` 来判断。

#### think.isNullOrUndefined(any)

* `any` {any} 

判断输入是 `null` 或者 `undefined`

#### think.isNumber(number)

* `number` {any} 

判断输入是否是数字

```js
think.isNumber(1); // true
```

#### think.isString(str)

* `str` {any} 

判断输入是是否是字符串

#### think.isSymbol(any)

* `any` {any} 

判断输入是是否是 Symbol 类型

#### think.isUndefined(any)

* `any` {any} 

判断输入是是否是 undefined，也可以直接通过 `xxx === undefined` 来判断。

#### think.isRegExp(reg)

* `reg` {any} 

判断输入是是否是正则对象

#### think.isDate(date)

* `date` {any} 

判断输入是是否是日期对象

#### think.isError(error)

* `error` {any} 

判断输入是是否是Error类型

#### think.isFunction(any)

* `any` {any} 

判断输入是是否是函数类型

#### think.isPrimitive(any)

* `any` {any} 

判断输入是是否是原始类型，包含：`null`、`string`、`boolean`、`number`、`symbol`、`undefined`。

#### think.isIP(ip)

* `ip` {String} 

判断一个字符串是否是 ip 地址，IP v4 或者 IP v6，等同于 `net.isIP`。

#### think.isBuffer(buffer)

* `buffer` {any} 

判断输入是否是一个Buffer对象，等同于 `Buffer.isBuffer`。

#### think.isIPv4(ip)

* `ip` {String} 

判断一个字符串是否是 IP v4 地址，等同于 `net.isIPv4`。

#### think.isIPv6(ip)

* `ip` {String} 

判断一个字符串是否是 IP v6 地址，等同于 `net.isIPv6`

#### think.isMaster

判断当前进程是否为主进程，等同于 `cluster.isMaster`

#### think.isObject(obj)

* `obj` {any} 

判断一个输入是否为 Object，通过 Object.prototype.toString.call(obj) 是否为 `[object Object]` 判断

```js
think.isObject({}); // true
think.isObject([]); // false
think.isObject(null); // false
```

#### think.promisify(fn, receiver)

* `fn` {Function} 要包装的函数
* `receiver` {Object} 要绑定作用域的对象

此方法把一个 callback 函数包装 成Promise

```js
let fn = think.promisify(fs.readFile, fs);
let data = await fn(__filename);
```

#### think.extend(target,...any)

* `target` {Object} 要extend的目标对象
* `...any` {Object} 可以有任意多个对象

深拷贝对象，如果 key 相同，那么后面的值会覆盖前面的值。

```js
think.extend({a: 1}, {b: 2});
// return {a:1,b:2};

think.extend({a: 1}, {a: 2});
// return {a: 2}
```

#### think.camelCase(str)

* `str` {String}

把字符串转成驼峰表示法

```js
think.camelCase('index_index');
// return 'indexIndex'
```

#### think.snakeCase(str)

* `str` {String}

把驼峰写法转化为蛇形写法

```js
think.snakeCase('indexIndex');
// return 'index_index'
```

#### think.isNumberString(str)

* `str` {String}

判断输入是不是一个字符串类型的数字

```js
think.isNumberString('419');
// return true 
```

#### think.isTrueEmpty(any)

* `any` {any}

判断是否是真正的空，`undefined`、`null`、`''`、`NaN` 为 true，其他为 false。

```js
think.isTrueEmpty(null); 
// return true 
```

#### think.isEmpty(any)

* `any` {any}

判断对象是否为空， `undefined`, `null` ,`''`, `NaN`, `[]`, `{}`, `0`, `false` 为 true，其他为 false。

```js
think.isEmpty(null);
// return true 
```

#### think.defer()

生成一个 Deferred 对象。

```js
function test() {
  const defer = think.defer();
  setTimeout(function() {
    defer.reslove('1');
  },1000)
  return defer
}

test().then((result)=>{
  resut === '1'
})
```

#### think.md5(str)

* `str` {String}

计算字符串的 md5 值。

#### think.timeout(num)

* `num`{Number} 时间，单位为毫秒

将 setTimeout 包装为 Promise

```js
think.timeout(1000).then(()=>{
  ...
})
```


#### think.escapeHtml(str)

* `str` {String}

对字符串进行 HTML 转义，转义 `<`、`>`、`"`、`'` 字符。

#### think.datetime(date, format)

* `data` {Date}
* `format` {String} default 'YYYY-MM-DD HH:mm:ss'

返回一个格式化日期

```js
think.datetime(1501406894849)
// return "2017-07-30 17:28:14"
```
#### think.uuid(version)

* `version` {String} v1|v4
* `return` {String}

生成 uuid 字符串，符合 [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) 规范，基于 [uuid](https://github.com/kelektiv/node-uuid) 模块。

#### think.ms(str)

* `str` {String} 
* `return` {Number}

把一个语义化的时间转成毫秒，如果转换失败则抛异常，使用 [ms](https://github.com/zeit/ms) 库转换。

```js
think.ms('2 days')  // 1d,10h,1y
// return 172800000
```

#### think.isExist(path)

* `path` {String}

检测路径是否存在

```js
think.isExist('/usr/local/bin/node')
// return true
```

#### think.isFile(filepath)

* `filepath` {String}

检测是否是一个文件路径

```js
think.isFile('/usr/local/bin/node')
// return true
```

#### think.isDirectory(filepath)

* `filepath` {String}

检测是否是一个文件夹路径

```js
think.isDirectory('/usr/local/bin')
// return true
```

#### think.chmod(path, mode)

* `path` {String}
* `mode` {String} default '0777'

改变文件或文件夹的权限

```js
think.chmod('/usr/local/bin', '0775')
```

#### think.mkdir(path, mode)

* `path` {String} 要创建的目录
* `mode` {String} 文件夹权限，默认为 `0777`
* `return` {Boolean} 

创建文件夹。创建成功返回 true, 失败返回 false。

```js
think.mkdir('/usr/local/bin/thinkjs', '0775')
```

#### think.getdirFiles(dir, prefix)

* `dir` {String} 文件夹路径
* `prefix` {String} 路径前缀
* `return` {Array} 包含所有文件的数组

获取文件夹下的所有文件。

```js
think.getdirFiles('/usr/local/bin')
// return []
```

#### think.rmdir(path, reserve)

* `path` {String}
* `reserve` {Boolean} 是否保留当前的文件夹，只删除文件夹下的文件

删除文件夹和文件夹下的文件，异步操作。

```js
think.rmdir('/usr/local/bin/thinkjs', true).then(()=>{
  console.log('删除完成')
})
```

### 常见问题

#### think 对象是否推荐在插件里使用？

不建议在插件里（middleware、adapter、extend）里直接使用 think 对象，那样会让插件代码不方便单元测试。如果非要使用的话可以传入 `app` 对象，然后通过 `app.think.xxx` 来使用 think 对象上的属性或者方法。

```js
// src/config/middleware.js
module.exports = [
  {
    handle: xxx
  }
];


// xxx middleware
module.exports = (options, app) => {
  return (ctx, next) => {
    // 通过 app.think.modules 获取项目的模块列表
    const modules = app.think.modules;
    // 如果是多模块项目下（单模块项目长度始终为 0）
    if(modules.length) {

    }
  }
}
```

