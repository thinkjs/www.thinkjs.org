## WebSocket

项目里经常要要使用 WebSocket 来实现聊天等功能，ThinkJS 支持多种 WebSocket 库，如：`socket.io`，`sockjs` 等，并对这些库进行了一些简单的包装，让使用的接口一致。

### 开启 WebSocket

WebSocket 功能默认是关闭的，项目如果需要开启，可以修改配置文件 `src/common/config/websocket.js`：

```js
export default {
  on: false, //是否开启 WebSocket
  type: 'socket.io', //使用的 WebSocket 库类型，默认为 socket.io
  allow_origin: '', //允许的 origin
  adapter: undefined, // socket 存储的 adapter，socket.io 下使用
  path: '', //url path for websocket
  messages: {
    // open: 'home/websocket/open',
  }
};
```

需要将配置 `on` 的值修改为 true，并重启 Node.js 服务。

### 事件到 Action 的映射

ThinkJS 里对 WebSocket 的包装遵循了 `socket.io` 的机制，服务端和客户端之间通过事件来交互，这样服务端需要将事件名映射到对应的 Action，才能响应具体的事件。配置在 `messages` 字段，具体如下：

```js
export default {
  messages: {
    open: 'home/socketio/open', // WebSocket 建立连接时处理的 Action
    close: 'home/socketio/close', // WebSocket 关闭时处理的 Action
    adduser: 'home/socketio/adduser', //adduser 事件处理的 Action
  }
}
```

其中 `open` 和 `close` 事件名固定，表示建立连接和断开连接的事件，其他事件均为自定义，项目里可以根据需要添加。

### Action 处理

通过上面配置事件到 Action 的映射后，就可以在对应的 Action 作相应的处理。如：

```js
export default class extends think.controller.base {
  /**
   * WebSocket 建立连接时处理
   * @param  {} self []
   * @return {}      []
   */
  openAction(self){
    var socket = self.http.socket;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  }
}
```

#### emit

Action 里可以通过 `this.emit` 方法给当前 socket 发送事件，如：

```js
export default class extends think.controller.base {
  /**
   * WebSocket 建立连接时处理
   * @param  {} self []
   * @return {}      []
   */
  openAction(self){
    var socket = self.http.socket;
    this.emit('new message', 'connected');
  }
}
```

#### broadcast

Action 里可以通过 `this.broadcast` 方法给所有的 socket 广播事件，如：

```js
export default class extends think.controller.base {
  chatAction(self){
    var socket = self.http.socket;
    //广播给除当前 socket 之外的所有 sockets
    this.broadcast('new message', {msg: 'message', username: 'xxx'});
  }
}
```

`注`：broadcast 方法默认是給除去当前 socket 的所有 sockets 发送事件，如果想包含当前的 socket，可以设置第三个参数值为 `true`。

```js
export default class extends think.controller.base {
  chatAction(self){
    var socket = self.http.socket;
    //广播给所有的 sockets，包含当前的 socket
    this.broadcast('new message', {msg: 'message', username: 'xxx'}, true);
  }
}
```

#### socket 对象

Action 里可以通过 `this.http.socket` 拿到当前的 socket 对象。

#### 事件数据

Action 里可以通过 `this.http.data` 拿到发送过来事件的数据。



### socket.io

`socket.io` 对 WebSocket 前后端都有封装，使用起来非常方便。


#### io 对象

在 Action 里可以通过 `this.http.io` 来获取 `io` 对象，该对象为 socket.io 的一个实例。

io 对象包含的方法请见 <http://socket.io/docs/server-api/#server()>。

#### 设置 path

设置被 socket.io 处理的路径，默认为 `/socket.io`。如果需要修改，可以修改下面的配置：

```js
export default {
  path: '/other_path'
}
```

`注`：服务端修改了处理的路径后，客户端也要作对应的修改。

#### 设置 adapter

使用多节点来部署 WebSocket 时，多节点之间可以借助 Redis 进行通信，这时可以设置 adapter 来实现。

```js
import redis from 'socket.io-redis';

export default {
  adapter: function(){
    return redis({ host: 'localhost', port: 6379 });
  }
}
```

具体请见 <http://socket.io/docs/using-multiple-nodes/>。

#### socket.io client

浏览器端需要引入 socket.io client，下载地址为：<http://socket.io/download/>。

```js
var socket = io('http://localhost:8360');
//发送事件
socket.emit('name', 'data');
//监听事件
socket.on('name', function(data){

})
```

也可以直接引入一个 CDN 地址：<http://s4.qhimg.com/static/535dde855bc726e2/socket.io-1.2.0.js>。

#### 校验用户登录

WebSocket 建立连接时可以拿到 cookie，所以可以在 `open` 对应的 Action 里校验用户是否登录。如：

```js
export default class extends think.controller.base {
  async openAction(){
    let userInfo = await this.session('userInfo');
    if(think.isEmpty(userInfo)){

    }
  }
}
```

#### 聊天代码示例

聊天示例代码请见：<https://github.com/75team/thinkjs2-demos/tree/master/websocket-socket.io>。

### SockJS

#### 配置

使用 SockJS 库，需要将配置里的 type 修改为 `sockjs`，如：

```js
export default {
  type: 'sockjs'
}
```

#### sockjs 对象

Action 里可以通过 `this.http.sockjs` 拿到 sockjs 对象，该对象为 SockJS 类的一个实例。

#### 设置 path

设置被 SockJS 处理的路径，默认为 `/sockjs`，可以通过下面的配置修改：

```js
export default {
  path: '/websocket'
}
```

#### SockJS client

浏览器端需要引入 SockJS client，下载地址为：<https://github.com/sockjs/sockjs-client>。

SockJS client 并没有做什么封装，所以需要额外做一层包装，变成事件的方式，以便跟包装后的服务端对应。包装方式参考如下：

```js
SockJS.prototype.emit = function(event, data){
    this.send(JSON.stringify({event: event, data: data}));
  }
SockJS.prototype.events = {};
SockJS.prototype.on = function(event, callback){
  if(!(event in this.events)){
    this.events[event] = [];
  }
  this.events[event].push(callback);
}
SockJS.prototype.onmessage = function(e) {
  var data = JSON.parse(e.data);
  var callbacks = this.events[data.event] || [];
  callbacks.forEach(function(callback){
    callback && callback(data.data);
  })
};
SockJS.prototype.onopen    = function()  {
  this.onmessage(JSON.stringify({data: {event: 'open'}}));
};
SockJS.prototype.onclose   = function()  {
  this.onmessage(JSON.stringify({data: {event: 'close'}}));
};
```

通过上面的包装后就可以通过事件的方式来接收和发送消息了，如：

```js
var socket = new SockJS('/sockjs'); //这里的路径必须和配置里相同，如果没有配置则为 /sockjs
//监听事件
socket.on('add user', function(data){

});
//发送事件
socket.emit('new message', 'xxx');
```

#### 校验用户登录

SockJS 为了安全，在建立连接时不提供相关的 cookie，所以无法通过 cookie 来校验用户是否登录。可以先在页面里输出一个 token，建立连接时将该 token 发送用来校验是否已经登录。具体请见：<https://github.com/sockjs/sockjs-node#authorisation>。

#### 聊天代码示例

聊天示例代码请见：<https://github.com/75team/thinkjs2-demos/tree/master/websocket-sockjs>。

### nginx 反向代理

nginx 从 `1.3.13` 版本开始支持反向代理 WebSocket 请求，如果在项目中使用，需要在 nginx 配置文件中添加如下的配置：

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

`注`： 使用 `thinkjs` 命令创建项目时，会自动创建 nginx 配置文件，并且配置文件已经包含了上面 2 个配置，可以直接使用。

nginx 代理 WebSocket 请求的文档请见 <http://nginx.org/en/docs/http/websocket.html>。
