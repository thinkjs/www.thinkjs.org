## 异步处理

Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，很多接口都是异步的，如：文件操作、网络请求。虽然提供了文件操作的同步接口，但这些接口是阻塞式的，非特殊情况下不要使用它。

对于异步接口，官方的 API 都是 callback 形式的，如：

```js
const fs = require('fs');
fs.readFile(filepath, 'utf8', (err, content) => {
  if(err) return ;
  ...
})
```
这种方式下，当业务逻辑复杂后，很容易出现 [callback hell](http://callbackhell.com/) 的问题。为了解决这个问题，相继出现了 event、thunk、Promise、Generator function、Async functions 等解决方案，最终 `Async functions` 方案胜出，ThinkJS 也直接选用这种方式来解决异步问题。

### Async functions

Async functions 使用 async/await 语法定义函数，如：

```js
async function fn() {
  const value = await getFromApi();
  doSomethimgWithValue();
}
```

* 有 await 时必须要有 async，但有 async 不一定非要有 await
* Async functions 可以是普通函数的方式，也可以是 Arrow functions 的方式
* await 后面需要接 Promise，如果不是 Promise，则不会等待处理
* 返回值肯定为 Promise

返回值和 await 后面接的表达式均为 Promise，也就是 Async functions 以 Promise 为基础。如果 await 后面的表达式返回值不是 Promime，那么需要通过一些方式将其包装为 Promise。

#### 项目中使用

ThinkJS 3.0 直接推荐大家使用 Async functions 来解决异步的问题，并且框架提供的所有异步接口都是 Promise 的方式，方便开发者直接使用 Async functions 调用。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    // select 接口返回 Promise，方便 await 使用
    const list = await this.model('user').select();
    return this.success(list);
  }
}
```

虽然使用 Async functions 解决异步问题时比较优雅，但需要 Node.js 的版本 `>=7.6.0` 才支持，如果在之前的版本中使用，需要借助 Babel 进行转译（由于框架只是要求 Node.js 版本大于 6.0，所以默认创建的项目是带 Babel 转译的，将 Async functions 转译为 Generator functions + co 的方式）。

`ThinkJS 3.0 项目中不再支持 Generator，需要使用 Async functions`

#### 和 Generator 区别

虽然 Async functions 和 Generator 从语法糖上看起来很相似，但其实还是有很多的区别，具体为：

* 为解决异步而生，`async/await` 更加语义化。而 Generator 本身是个迭代器，发现可以用来解决异步问题
* 要求 await 后面必须是 Promise 接口，而 yield 后面没有任何限制
* 不需要额外的执行器，Generator 需要借助 [co](https://github.com/tj/co) 这样的执行器
* 可以定义为 Arrow functions 的方式，而 Generator function 不能
* 没有类似 yield 和 yield * 的问题

### promisify

Async functions 需要 await 后面接的表达式返回值为 Promise，但很多接口并不是返回 Promise，如：Node.js 原生提供异步都是 callback 的方式，这个时候就需要将 callback 方式的接口转换为 Promise 方式的接口。

由于 callback 方式的接口都是 `fn(aa, bb, callback(err, data))` 的方式，这样就不需要每次都手工将 callback 接口包装为 Promise 接口，框架提供了 `think.promisify` 用来快速转换，如：

```js
const fs = require('fs');
const readFile = think.promisify(fs.readFile, fs);

const parseFile = async (filepath) => {
  const content = await readFile(filepath, 'utf8'); // readFile 返回 Promise
  doSomethingWithContent();
}
```

由于 Promise resolve 时只能有一个参数，如果有的 callback 接口返回多个值，那么就不能用 `think.promisify` 快速包装了，这时候需要手工处理，如：

```js
const exec = require('child_process').exec;
return new Promise((resolve, reject) => {
  // exec 的回调函数有多个参数
  exec(filepath, (err, stdout, stderr) => {
    if(err) return reject(err);
    if(stderr) return reject(stderr);
    resolve(stdout);
  })
})
```

### 错误处理

在 Node.js 中，错误处理是个很麻烦的事情，稍不注意，请求可能就不能正常结束。对 callback 接口来说，需要在每个 callback 里进行判断处理，非常麻烦。

采用 Async functions 后，错误会自动转换为 Rejected Promise，当 await 后面是个 Rejected Promise 时会自动中断后续的执行，所以只需要捕获 Rejected Promise 就可以了。

#### try/catch

一种捕获错误的方式是使用 `try/catch`，像同步方式的代码里加 try/catch 一样，如：

```js
module.exports = class extends think.Contoller {
  indexAction() {
    try {
      await getDataFromApi1();
      await getDataFromApi2();
      await getDataFromApi3();
    } catch(e) {
      // capture error
    }
  }
}
```
通过在外层添加 `try/catch`，可以捕获到错误。但这种方式有个问题，在 catch 里捕获到的错误并不知道是哪个接口触发的，如果要根据不同的接口错误返回不同的错误信息就比较困难了，难不成在每个接口都单独加个 try/catch？那样的话会让代码非常难看。这种情况下可以用 `then/catch` 来处理。

#### then/catch

对于 Promise，我们知道有 then 和 catch 方法，用来处理 resolve 和 reject 下的行为。由于 await 后面跟的是 Promise，那么就可以对 Rejected Promise 进行处理来规避错误的发生。可以把 Rejected Promise 转换为 Resolved Promise 防止触发错误，然后我们在手工处理对应的错误信息就可以了。

```js
module.exports = class extends think.Controller {
  indexAction() {
    // 通过 catch 将 rejected promise 转换为 resolved promise
    const result = await getDataFromApi1().catch(err => {
      return think.isError(err) ? err : new Error(err)
    });
    // 这里判断如果返回值是转换后的错误对象，然后对其处理。
    // 接口正常情况下不会返回 Error 对象
    if (think.isError(result)) {
      // 这里将错误信息返回，或者返回格式化后的错误信息也都可以
      return this.fail(1000, result.message);
    }

    const result2 = await getDataFromApi2().catch(err => {
      return think.isError(err) ? err : new Error(err)
    });
    if(think.isError(result2)) {
      return this.fail(1001, result.message);
    }

    // 如果不需要错误信息，可以在 catch 里返回 false
    // 前提是接口正常情况下不返回 false，如果可能返回 false 的话，可以替换为其他特殊的值
    const result3 = await getDataFromApi3().catch(() => false);
    if(result3 === false) {
      return this.fail(1002, 'error message');
    }
  }
}
```

通过 Promise 后面接 catch 将 Rejected Promise 转化为 Resolved Promise 的方式，可以轻松定制要输出的错误信息。

#### trace

有些情况下，并不方便在外层添加 try/catch，也不太方便在每个 Promise 后面加上 catch 将 Rejected Promise 转换为 Resolved Promise，这时候系统提供 [trace](https://github.com/thinkjs/think-trace) 中间件来处理错误信息。

```js
// src/config/middleware.js

module.exports = [
  ...
  {
    handle: 'trace', 
    options: {
      sourceMap: false,
      debug: true, // 是否打印详细的错误信息
      error(err) {
        return console.error(err);
      }
    }
  }
  ...
];
```

当出现错误后，trace 模块会自动捕获错误，debug 模式下会显示详细的错误信息，并根据请求类型输出对应的数据返回。

![](https://camo.githubusercontent.com/7fc4d8401b0bae26bae354f70da39e7ad0812af2/68747470733a2f2f70312e73736c2e7168696d672e636f6d2f743031303539383661633764666331633139372e706e67)

### timeout

有时候需要延迟处理一些事务，最常见的办法就是通过 `setTimeout` 函数来处理，但 setTimeout 本身并不返回 Promise，这个时候我们就需要把其包装成 Promise。

框架提供了 `think.timeout` 方法可以快速包装成 Promise，如：

```js
return think.timeout(3000).then(() => {
  // 3s 后执行到这里
})
```

或者是：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    await think.timeout(3000);// 等待 3s 执行后续的逻辑
    return this.success();
  }
}
```

### 常见问题

#### 项目中是不是不能使用 Generator？

是的，ThinkJS 3.x 中不再支持 Generator，异步都用 Async functions 来处理，配合 Promise，是一种目前最优雅的解决异步问题的方式。