## 启动自定义

当通过 `npm start` 或者 `node production.js` 来启动项目时，虽然可以在这些入口文件里添加其他的逻辑代码，但并不推荐这么做。系统给出了其他启动自定义的入口。

### bootstrap

系统启动时会加载 `src/boostrap/` 目录下的文件，具体为：

* Master 进程下时加载 `src/bootstrap/master.js`
* Worker 进程下时加载 `src/bootstrap/worker.js`

所以可以将一些需要在系统启动时就需要执行的逻辑放在对应的文件里执行。

如果有一些代码需要在 Master 和 Worker 进程下都调用，那么可以放在一个单独的文件里，然后 master.js 和 worker.js 去 required。

```js
// src/bootstrap/common.js
global.commonFn = function(){

}

// src/bootstrap/master.js
require('./common.js')


// src/boostrap/worker.js
require('./common.js')

```

### 启动服务前执行

有时候需要在 node 启动 http 服务之前做一些特殊的逻辑处理，如：从数据库中读取配置并设置，从远程还在一些数据设置到缓存中。

这时候可以借助 `think.beforeStartServer` 方法来处理，如：

```js
think.beforeStartServer(async () => {
  const data = await getDataFromApi();
  think.config(key, data);
})
```
可以通过 `think.beforeStartServer` 注册多个需要执行的逻辑，如果逻辑函数中有异步的操作，需要返回 Promise。

系统会等待注册的多个逻辑执行完成后才启动服务，当然也不会无限制的等待，会有个超时时间。超时时间可以通过配置 `startServerTimeout` 修改，默认为 3 秒。

```js
//src/config/config.js
module.exports = {
  startServerTimeout: 5000 // 将超时时间改为 5s
}
```

### 自定义创建 http 服务

系统默认是通过 Koa 里的 listen 方法来创建 http 服务的，如果想要创建 https 服务，此时需要自定义创建服务，可以通过 `createServer` 配置来完成。

```js
//src/config/config.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

module.exports = {
  // app 为 Koa app 对象
  createServer: function(app, ...args){
    https.createServer(options, app.callback()).listen(...args);
  }
}
```

### think.app.server 对象

创建完  http 服务后，会将 server 对象赋值给 `think.app.server`，以便于在其他地方使用。

### appReady 事件

http 服务创建完成后，会触发 `appReady` 事件，其他地方可以通过 `think.app.on("appReady")` 来捕获该事件。

```js
think.app.on("appReady", () => {
  const server = think.app.server;
})
```