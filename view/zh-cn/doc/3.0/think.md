## think 对象

框架中内置 `think` 全局对象，方便在项目中随时随地使用。

### think.app

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

### API

think 对象上集成了 [think-helper](https://github.com/thinkjs/think-helper) 上的所有方法，所以可以通过 `think.xxx` 来使用这些方法。

#### think.env

当前运行环境，等同于 `think.app.env`，值在 `development.js` 之类的入口文件中定义。

#### think.version

当前 ThinkJS 的版本号。

#### think.Controller

控制器基类。

#### think.Logic

logic 基类，继承 `think.Controller`。

<!-- #### think.controller(name, ctx, m)

* `name` {String} 控制器名称
* `ctx` {Object} Koa ctx 对象
* `m` {String} 模块名，多模块项目下使用

获取控制器的实例，不存在则报错。 -->

#### think.beforeStartServer(fn)

* `fn` {Function} 要注册的函数名

服务启动之前要注册执行的函数，如果有异步操作，fn 需要返回 Promise。

#### think.isArray(array)
* `array` {any} 判断输入是否是数组
#### think.isBoolean(boolean)
* `boolean` {any} 判断输入是否是布尔值
#### think.isNull(any)
* `any` {any} 判断输入是 `null`
#### think.isNullOrUndefined(any)
* `any` {any} 判断输入是 `null` 或者 `undefined`
#### think.isNumber(number)
* `number` {any} 判断输入是否是数字
#### think.isString(str)
* `str` {any} 判断输入是是否是字符串
#### think.isSymbol(any)
* `any` {any} 判断输入是是否是Symbol类型
#### think.isUndefined(any)
* `any` {any} 判断输入是是否是undefined
#### think.isRegExp(reg)
* `reg` {any} 判断输入是是否是正则对象
#### think.isObject(obj)
* `obj` {any} 判断输入是是否是Object对象
#### think.isDate(date)
* `date` {any} 判断输入是是否是日期对象
#### think.isError(error)
* `error` {any} 判断输入是是否是Error类型
#### think.isFunction(any)
* `any` {any} 判断输入是是否是函数类型
#### think.isPrimitive(any)
* `any` {any} 判断输入是是否是原始类型
#### think.isIP(ip)
* `ip` {String} 判断一个字符串是否是ip地址
#### think.isBuffer(buffer)
* `buffer` {any} 判断输入是否是一个Buffer对象

#### think.isIPv4(ip)
* `ip` {String} 判断一个字符串是否是ipv4地址

#### think.isIPv6(ip)
* `ip` {String} 判断一个字符串是否是ipv6地址

#### think.isMaster
* return `Boolean` 静态属性，返回当前进程是否为主进程

#### think.isObject(obj)
* `obj` {any} 判断一个输入是否为object

#### think.promisify(fn, receiver)
* 此方法把一个函数包装成Promise 返回一个Promise对象
* `fn` {Function} 要包装的函数
* `receiver` {Object} 要绑定作用域的对象

```js
let fn = think.promisify(fs.readFile, fs);
let data = await fn(__filename);
```

#### think.extend(target,...any)
* 深拷贝
* `target` {Object} 要extend的目标对象
* `...any` {Object} 可以有任意多个对象
```js
think.extend({a:1}, {b:2});
return {a:1,b:2};
```

#### think.camelCase(str)
* 把index_index 转成驼峰表示法
* `str` {String}
```js
think.camelCase('index_index');
return 'indexIndex'
```

#### think.snakeCase(str)
* 把驼峰写法转化为蛇形写法
* `str` {String}
```js
think.snakeCase('indexIndex');
return 'index_index'
```

#### think.isNumberString(str)
* 判断输入是不是一个字符串类型的数字
* `str` {String}
```js
think.isNumberString('419');
return true 
```

#### think.isTrueEmpty(any)
* 判断是否是真正的空
* `any` {any}
```js
think.isTrueEmpty(null); //undefined,null,'',NaN
return true 
```

#### think.isTrueEmpty(any)
* 判断是否能转义成空
* `any` {any}
```js
think.isEmpty(null); //undefined,null,'',NaN,[],{},0,false
return true 
```

#### think.defer()
* 返回一个defer
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
* 返回一个32为小写md5值
* `str` {String}

#### think.timeout(num)
* 返回一个Promise包装的timeout
* `num`{Number}
```js
think.timeout(1000).then(()=>{
  ...
})
```
#### think.escapeHtml(str)
* 把html里的尖括号、双引号、\ 进行转义
* `str` {String}

#### think.datetime(date, format)
* 返回一个格式化日期
* `data` {Date}
* `format` {String} default 'YYYY-MM-DD HH:mm:ss'
```js
think.datetime(1501406894849)
return "2017-07-30 17:28:14"
```
#### think.uuid(version)
* 返回一个唯一的 uuid字符串
* version {String} v1|v4

#### think.ms(str)
* 把一个语义化的时间转成毫秒
* `str` {String} 
```js
think.ms('2 days')  // 1d,10h,1y
return 172800000
```

#### think.isExist(path)
* 检测路径是否存在
* `path` {String}
```js
think.isExist('/usr/local/bin/node')
return true
```

#### think.isFile(filepath)
* 检测是否是一个文件路径
* `filepath` {String}
```js
think.isFile('/usr/local/bin/node')
return true
```

#### think.isDirectory(filepath)
* 检测是否是一个文件夹路径
* `filepath` {String}
```js
think.isDirectory('/usr/local/bin')
return true
```

#### think.chmod(path, mode)
* 改变文件或文件夹的权限
* `path` {String}
* `mode` {String} default '0777'
```js
think.chmod('/usr/local/bin', '0775')
```

#### think.mkdir(path, mode)
* 创建文件夹
* `path` {String}
* `mode` {String} default '0777'
```js
think.mkdir('/usr/local/bin/thinkjs', '0775')
```

#### think.getdirFiles(dir, prefix)
* 获取文件夹下的所有文件
* `dir` {String}
* `prefix` {String} 别名 defalut `""`
```js
think.getdirFiles('/usr/local/bin')
```

#### think.rmdir(path, reserve)
* 删除文件夹
* `path` {String}
* `reserve` {Boolean} 是否需要返回一个Promise
```js
think.rmdir('/usr/local/bin/thinkjs', true).then(()=>{
  console.log('删除完成')
})
```


