## Mysql

ThinkJS 对 Mysql 操作有很好的支持，底层使用的库为 <https://www.npmjs.com/package/mysql>。

### 连接池

默认连接 Mysql 始终只有一个连接，如果想要多个连接，可以使用连接池的功能。修改配置 `src/common/config/db.js`，如：

```js
export default {
  connectionLimit: 10 //建立 10 个连接
}
```

### socketPath

默认情况下是通过 host 和 port 来连接 Mysql 的，如果想通过 unix domain socket 来连接 Mysql，可以设置下面的配置：

```js
export default {
  socketPath: '/tmp/mysql.socket'
}
```

### SSL options

可以通过下面的配置来指定通过 SSL 来连接：

```js
export default {
  ssl: {
    ca: fs.readFileSync(__dirname + '/mysql-ca.crt')
  }
}
```

### 数据库支持 emoji 表情

数据库的编码一般会设置为 `utf8`，但 utf8 并不支持 emoji 表情，如果需要数据库支持 emoji 表情，需要将数据库编码设置为 `utf8mb4`。

同时需要将 `src/common/config/db.js` 里的 `encoding` 配置值修改为 `utf8mb4`。如：

```js
export default {
  encoding: 'utf8mb4'
}
```


### Error: Handshake inactivity timeout

在某些 Node.js 版本下（如：4.2.0）连接 Mysql 时会出现下面的错误：

```text
Error: Handshake inactivity timeout
at Handshake.sequence.on.on.on.on.on.self._connection._startTLS.err.code (/home/***/node_modules/mysql/lib/protocol/Protocol.js:154:17)
at Handshake.emit (events.js:92:17)
at Handshake._onTimeout (/home/***/node_modules/mysql/lib/protocol/sequences/Sequence.js:116:8)
at Timer.listOnTimeout [as ontimeout] (timers.js:112:15)
    --------------------
    at Protocol._enqueue (/home/***/node_modules/mysql/lib/protocol/Protocol.js:135:48)
    at Protocol.handshake (/home/***/node_modules/mysql/lib/protocol/Protocol.js:52:41)
    at PoolConnection.connect (/home/***/node_modules/mysql/lib/Connection.js:119:18)
    at Pool.getConnection (/home/***/node_modules/mysql/lib/Pool.js:45:23)
    at Object.exports.register (/home/***/node_modules/hapi-plugin-mysql/lib/index.js:40:27)
    at /home/***/node_modules/hapi/lib/plugin.js:242:14
    at iterate (/home/***/node_modules/hapi/node_modules/items/lib/index.js:35:13)
    at done (/home/***/node_modules/hapi/node_modules/items/lib/index.js:27:25)
    at Object.exports.register (/home/***/node_modules/lout/lib/index.js:95:5)
    at /home/***/node_modules/hapi/lib/plugin.js:242:14
```

`解决方案：` 将 Node.js 升级到最新版本即可解决。


