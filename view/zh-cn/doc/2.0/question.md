## 常见问题

### 为什么推荐 ES6/7 语法开发项目

ES6/7 里提供了大量的新特性，这些特性会带来巨大的开发便利和效率上的提升。如：ES6 里的 `*/yield` 和 ES7 里的 `async/await` 特性解决异步回调的问题；箭头函数解决 `this` 作用域的问题；`class` 语法糖解决类继承的问题。

虽然现在 Node.js 环境还没有完全支持这些新的特性，但借助 Babel 编译，可以稳定运行在现在的 Node.js 环境中。所以我们尽可以享受这些新特性带来的便利。    

### 开发时，修改文件需要重启服务么？

默认情况下，由于 Node.js 的机制，文件修改必须重启才能生效。

这种方式下给开发带来了很大的不变，ThinkJS 提供了一种文件自动更新的机制，文件修改后可以立即生效，无需重启服务。

自动更新的机制会消耗一定的性能，所以默认只在 `development` 项目环境下开启。线上代码更新还是建议使用 `pm2` 模块来管理。

### 怎么修改视图文件目录结构

默认情况下，视图文件路径为 `view/[module]/[controller]_[action].html`。其中控制器和操作之间是用 `_` 来连接的，如果想将连接符修改为 `/`，可以修改配置文件 `src/common/config/view.js`：

```js
export default {
  file_depr: '/', //将控制器和操作之间的连接符修改为 /
}
```

### 如何开启多进程

线上可以开启 cluster 功能达到利用多核 CPU 来提升性能，提高并发处理能力。

可以在配置文件 `src/common/config/env/production.js` 中加入如下的配置：

```js
export default {
  cluster_on: true //开启 cluster
}
```

### 修改请求超时时间

默认请求的超时时间是 120s，可以通过修改配置文件 `src/common/config/config.js` 里 `timeout` 配置值。

```js
export default {
  timeout: 30, //将超时时间修改为 30s
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
