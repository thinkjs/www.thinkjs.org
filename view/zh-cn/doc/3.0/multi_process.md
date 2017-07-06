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
  //监听事件
  think.messenger.on('test', data => {
    //所有进程都会捕获到该事件，包含当前的进程
  });

  if(xxx){
    //发送广播事件
    think.messenger.broadcast('test', data)
  }
  ```