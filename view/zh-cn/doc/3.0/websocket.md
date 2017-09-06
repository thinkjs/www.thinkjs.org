## WebSocket

对于 WebSocket 目前 ThinkJS 支持了 `socket.io`, 并对其进行了一些简单的包装，后续会增加 [socketjs](https://github.com/sockjs/sockjs-node), [ws](https://github.com/websockets/ws) 库的支持。

### 开启 WebSocket

在集群环境中，WebSocket 要求使用粘性会话，来确保给定客户端请求命中相同的 worker，否则其握手机制将无法正常工作。 为了实现这一点，需要开启 `stickyCluster` 配置。

为了保证性能，`stickyCluster` 功能默认是关闭的，项目如果需要开启，可以修改配置文件 `src/config/config.js`：

```js
module.exports = {
  stickyCluster: true,
  // ...
};
```

### 配置 WebSocket

WebSocket 是以 `extend` 的形式集成到 ThinkJS 的，首先要配置 `src/config/extend.js`:

```js
const websocket = require('think-websocket');

module.exports = [
  // ...
  websocket(think.app),
];
```

WebSocket 的各个实现是以 `adapter` 的形式存在的，以 `socket.io` 为例（使用 [think-websocket-socket.io](https://github.com/thinkjs/think-websocket-socket.io) 进行了封装），在 `src/config/adapter.js` 中配置如下：

```js
const socketio = require('think-websocket-socket.io');
exports.websocket = {
  type: 'socketio',
  common: {
    // common config
  },
  socketio: {
    handle: socketio,
    allowOrigin: '127.0.0.1:8360',  // 默认所有的域名都允许访问
    path: '/socket.io',             // 默认 '/socket.io'
    adapter: null,                  // 默认无 adapter
    messages: [{
      open: '/websocket/open',
      addUser: '/websocket/addUser'
    }]
  }
}
```

### 事件到 Action 的映射

以 `socket.io` 为例，ThinkJS 遵循了 `socket.io` 服务端和客户端之间通过事件来交互的机制，这样服务端需要将事件名映射到对应的 Action，才能响应具体的事件。事件的映射关系配置在 `messages` 字段，具体如下：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    messages: {
      open: '/websocket/open',       // 建立连接时处理对应到 websocket Controller 下的 open Action
      close: '/websocket/close',     // 关闭连接时处理的 Action
      addUser: '/websocket/addUser', // addUser 事件处理的 Action
    }
  }
}
```

其中 `open` 和 `close` 事件名固定，表示建立连接和断开连接的事件，其他事件均为自定义，项目里可以根据需要添加。

### 服务端 Action 处理

通过配置事件到 Action 的映射后，就可以在对应的 Action 作相应的处理。如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.emit('opend', 'This client opened successfully!')
    this.broadcast('joined', 'There is a new client joined successfully!')
  }

  addUserAction() {
    console.log('获取客户端 addUser 事件发送的数据', this.wsData);
    console.log('获取当前 WebSocket 对象', this.websocket);
    console.log('判断当前请求是否是 WebSocket 请求', this.isWebsocket);
  }
}
```

#### emit

Action 里可以通过 `this.emit` 方法给当前 `socket` 发送事件，如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.emit('opend', 'This client opened successfully!')
  }
}
```

#### broadcast

Action 里可以通过 `this.broadcast` 方法给所有的 `socket` 广播事件，如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.broadcast('joined', 'There is a new client joined successfully!')
  }
}
```

### 客户端示例

客户端示例代码如下：

```
<script src="http://lib.baomitu.com/socket.io/2.0.1/socket.io.js"></script>
<script type="text/javascript">
  var socket = io('http://localhost:8360');

  $('.send').on('click', function(evt) {
    var username = $.trim($('.usernameInput').val());
    if(username) {
      socket.emit('addUser', username);
    }
  });

  socket.on('opend', function(data) {
    console.log('opend:', data);
  });

  socket.on('joined', function(data) {
    console.log('joined:', data);
  });
</script>
```


### socket.io

`socket.io` 对 WebSocket 前后端都有封装，使用起来非常方便。

#### io 对象

在 Action 里可以通过 `this.ctx.io` 来获取 `io` 对象，该对象为 socket.io 的一个实例。

io 对象包含的方法参见文档 [https://socket.io/docs/server-api/#server](https://socket.io/docs/server-api/#server)。

#### 设置 path

设置被 socket.io 处理的路径，默认为 `/socket.io`。如果需要修改，可以修改 `src/config/adapter.js` 的配置：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    path: '/socket.io',
  }
}
```

[path](https://socket.io/docs/server-api/#server-path-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-path-value](https://socket.io/docs/server-api/#server-path-value)，需要注意的是：如果服务端修改了处理的路径后，客户端也要作对应的修改。

#### 设置 allowOrigin

默认情况下 `socket.io` 允许所有域名的访问。如果需要修改，可以修改 `src/config/adapter.js` 的配置：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    allowOrigin: '127.0.0.1:8360',
  }
}
```

[allowOrigin](https://socket.io/docs/server-api/#server-origins-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-origins-value](https://socket.io/docs/server-api/#server-origins-value)，需要注意的是：如果服务端修改了处理的路径后，客户端也要作对应的修改。

#### 设置 adapter

使用多节点来部署 WebSocket 时，多节点之间可以借助 Redis 进行通信，这时可以设置 adapter 来实现。

```js
const redis = require('socket.io-redis');
exports.websocket = {
  // ...
  socketio: {
    // ...
    adapter: redis,
  }
}
```
[adapter](https://socket.io/docs/server-api/#server-adapter-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-adapter-value](https://socket.io/docs/server-api/#server-adapter-value)。
