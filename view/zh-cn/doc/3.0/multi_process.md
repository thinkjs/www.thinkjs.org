## 多进程

node 中提供了 `cluster` 模块来创建多进程应用，这样可以避免单一进程挂了导致服务异常的情况。框架是通过 [think-cluster](https://github.com/thinkjs/think-cluster) 模块来运行多进程模型的。

### 多进程配置

可以配置 `workers` 指定子进程的数量，默认为 `0`（当前 cpu 的个数）

```js
//src/config/config.js
module.exports = {
  workers: 0 // 可以根据实际情况修改，0 为 cpu 的个数
}
``` 

### 多进程模型

多进程模型下，Master 进程会根据 `workers` 的大小 `fork` 对应数量的 Worker 进程，由 Woker 进程来处理用户的请求。当 Worker 进程异常时会通知 Master 进程 Fork 一个新的 Worker 进程，并让当前 Worker 不再接收用户的请求。

### 进程间通信

多个 Worker 进程之间有时候需要进行通信，交换一些数据。但 Worker 进程之间并不能直接通信，而是需要借助 Master 进程来中转。

框架提供 `think.messenger` 来处理进程之间的通信，目前有下面几种方法：

* `think.messenger.broadcast` 将消息广播到所有 Worker 进程
  
  ```js
  //监听事件  src/bootstrap/worker.js
  think.messenger.on('test', data => {
    //所有进程都会捕获到该事件，包含当前的进程
  });

  // src/controller/xxx.js
  //发送广播事件
  think.messenger.broadcast('test', data);
  ```

* `think.messenger.consume` 任务消费，只在一个进程下执行（有时候系统启动下需要启动一些任务，但只希望任务只会在一个进程下执行一次）

  ```js
  // src/bootstrap/worker.js
  think.messenger.on('consumeEvent', () => {
    // 该回调函数只会在一个进程下执行
  });

  //调用事件，只会在一个进程下执行一次
  think.messenger.consume('consumeEvent');
  ```

* `think.messenger.map` 执行所有进程下的任务，并返回任务结果集（结果集需要通过 JSON.stringify 在进程间传递，结果集不能太大，如果太大的话可以通过其他的存储传递，如：文件）

  ```js
  // src/bootstrap/worker.js
  think.messenger.on('testMap', () => {
    return Math.random();
  });

  // src/controller/xxx.js
  if(xxx) {
    // 获取到所有子进程执行后的返回值，值为数组
    // 执行时只会取注册的第一个事件回调
    const data = await think.messenger.map('testMap');
  }
  ```

注：consume 和 map 方法需要 [think-cluster](https://github.com/thinkjs/think-cluster) 的版本 `>=1.3.0`。

### 自定义进程通信

有时候内置的一些通信方式还不能满足所有的需求，这时候可以自定义进程通信。由于 Master 进程执行时调用 `src/bootstrap/master.js`，Worker 进程执行时调用 `src/bootstrap/worker.js`，那么处理进程通信就比较简单。

```js
// src/bootstrap/master.js
const cluster = require('cluster');
cluster.on('message', (worker, message) => {
  // 接收到特定的消息进程处理
  if(message && message.act === 'xxx'){

  }
})

// src/bootstrap/worker.js
process.send({act: 'xxxx', ...args}); //发送数据到 Master 进程

```

### 常见问题

#### 子进程如何通知主进程重启服务？

有时候做一些通用的系统，需要有自动更新的功能（如：博客系统的更新功能），代码更新后，需要重启服务才能使其生效，如果每次都要手工重启服务必然不方便。框架提供了 `think-cluster-reload-workers` 指令让子进程可以通知主进程重启服务，这样就不用手工重启服务了。如：

```js
async upgrade() {
  await downloadCodeFromRemote(); // 从远程下载更新包
  await unzipCode(); // 解压缩代码
  await installDependencies(); // 重新安装依赖，可能有新的依赖
  process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
}
```