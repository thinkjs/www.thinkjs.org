## WebSocket

WebSocket is usually used to implement various functions such as chatroom. ThinkJS supports a lot of WebSocket libraries, for instance, `socket.io`，`sockjs` etc. Further more, by give a simple encapsulation to these libraries, ThinkJS provided us consistent interfaces.

### Open WebSocket

WebSocket is closed by default. You can edit `src/common/config/websocket.js` to open it：

```js
export default {
  on: false, // whether open WebSocket
  type: 'socket.io', // the WebSocket library name, defaults to socket.io
  allow_origin: '', //  origin allowed
  adp: undefined, // store adapter for socket，used in socket.io
  path: '', // url path for websocket
  messages: {
    // open: 'home/websocket/open',
  }
};
```

Change the `on` field to `true`, and restart Node.js.

### Map Event to Action

The encapsulation to WebSocket obeyed to the `socket.io` mechanism. The server and client communicate each other through events. So the server need map events to actions in order to response correctly.The configuration is specified in `messages` field as following: 

```js
export default {
  messages: {
    open: 'home/socketio/open', // works on Websocket connected.
    close: 'home/socketio/close', // works on Websocket closed.
    adduser: 'home/socketio/adduser', // works when adduser.
  }
}
```

The events name `open`, `close` are immutable, representing a connection or disconnection. Others can be custom, you can add according to your need.

### Work With Action

Then, you can work with action like following code after finished above configuration.

```js
export default class extends think.controller.base {
  /**
   * works on Websocket connected
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

You can emit event to the current socket in Action through `this.emit`:

```js
export default class extends think.controller.base {
  /**
   * works on Websocket connected
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

You can broadcast event to all sockets in Action through method `this.broadcast`:

```js
export default class extends think.controller.base {
  chatAction(self){
    var socket = self.http.socket;
    // broadcast to all sockets excepting the current.
    this.broadcast('new message', {msg: 'message', username: 'xxx'});
  }
}
```

`Note`: the broadcase method broadcast to all sockets except current one. You can set the third parameter to `true` to include current one.

```js
export default class extends think.controller.base {
  chatAction(self){
    var socket = self.http.socket;
    // broadcast to all sockets including the current. 
    this.broadcast('new message', {msg: 'message', username: 'xxx'}, true);
  }
}
```

#### Socket Object

You can get socket object in Action through `this.http.socket`.

#### Event Data

You can get the event data in Action through `this.http.data`.

### socket.io

The `socket.io` library encapsulates socket both front end and back end, it is very convenient to use.

#### io Object

You can get the `io` object in Action through `this.http.io`.It is an instance of `socket.io` 

To know methods in io object, please see also <http://socket.io/docs/server-api/#server()>。

#### Set Path

The socket.io process path is `/socket.io` by default. You can edit the folloing configuration if you need.

```js
/* src/common/config/websocket.js */
export default {
  type: 'socket.io',
  adapter: {
    'socket.io': {
      path: '/other_path'
    }
  }
}
```

`Note`：After the server has modified the path, the client also should make the corresponding modification

#### Set Adapter

When using multiple nodes to deploy WebSocket, multiple nodes can communicate with Redis. You can get things done by set up adapter.

```js
/* src/common/config/websocket.js */

import redis from 'socket.io-redis';
export default {
  type: 'socket.io',
  adapter: {
    'socket.io': {
      adp: function(){
        return redis({ host: 'localhost', port: 6379 });
      }
    }
  }
}
```

See also <http://socket.io/docs/using-multiple-nodes/> for more detail.

#### socket.io Client

In browser end, you should introduce socket.io client. The download path is：<http://socket.io/download/>。

```js
var socket = io('http://localhost:8360');
// emit event
socket.emit('name', 'data');
// listen event
socket.on('name', function(data){

})
```

This CDN url is available：<http://s4.qhimg.com/static/535dde855bc726e2/socket.io-1.2.0.js>。

#### Check User Login

Websocket can get cookie when connected. So, you can check if the user is logged in in the `open` Action. For example:

```js
export default class extends think.controller.base {
  async openAction(){
    let userInfo = await this.session('userInfo');
    if(think.isEmpty(userInfo)){

    }
  }
}
```

#### Code Sample: Chat

See also <https://github.com/75team/thinkjs2-demos/tree/master/websocket-socket.io> for more detailed chat code.

### SockJS

#### Configuration

You should edit the `type` field in the configuration to `sockjs`:

```js
export default {
  type: 'sockjs'
}
```

#### Sockjs Object

You can get sockjs object through `this.http.sockjs` in Action. The object is an instance of SocketJS.


#### Set path

The SocketJS process path is `/sockjs` by default.You can edit the folloing configuration if you need change.

```js
export default {
  path: '/websocket'
}
```

#### SockJS Client

In Browser end, you should introduce SockJS client. The download path is：<https://github.com/sockjs/sockjs-client>。

SockJS client does not do too much encapsulation, so you need encapsulate it by yourself, change it to the event way, in order to follow the server side. The encapsulate method is as follows:

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

After do above, we can receive and emit message, for example:

```js
var socket = new SockJS('/sockjs'); // this path must be same with configuration.Defaults to /sockjs
// listen event
socket.on('add user', function(data){

});
// emit event
socket.emit('new message', 'xxx');
```

#### Check User Login

For the safety reason, the SockJS doesn't supply cookie. So you can't check if the user is logined through cookie. You can output a token in your page, then send the token when connected to check.See also <https://github.com/sockjs/sockjs-node#authorisation> for more details.

#### Code Sample: Chat

See also <https://github.com/75team/thinkjs2-demos/tree/master/websocket-sockjs>for more detailed chat code

### Nginx Reverse Proxy Setting

From the `1.3.13` version, Nginx supports reverse proxy WebSocket request, if used in the project, you need to add the following configuration in the nginx configuration file:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

`Note`： when using `thinkjs` command to create project, ThinkJS creats nginx configuration file ，including these two configuration fields. You can use it directly.

Please visit <http://nginx.org/en/docs/http/websocket.html> to read the reverse proxy WebSocket request document.

### How to get current WebSocket connecting object

You can get an array of WebSocket connecting objects by using `thinkCache(thinkCache.WEBSOCKET)`.

### How to achieve private chat

ThinkJS has not supported private chat yet, you can implement it by first find all of the WebSocket connections, and then match the corresponding connections.
