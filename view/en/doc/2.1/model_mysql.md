## Mysql

ThinkJS supports Mysql well, the underlying library is [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql).

### Connections Pool

Mysql default has only one connection, if you want to use multiple connections, you can use connections pool. Modify `src/common/config/db.js`, such as:

```js
export default {
  connectionLimit: 10 //create 10 connections
}
```

### socketPath

Default host and port will used to connect Mysql, if you want to use unix domain socket, see the below configuration:

```js
export default {
  socketPath: "/tmp/mysql.socket"
}
```

### SSL options

Use below configuration to set SSL connection:

```js
export default {
  ssl: {
    ca: fs.readFileSync(__dirname + "/mysql-ca.crt")
  }
}
```

### Database Support Emoji

The encoding of database usually is `utf8`, but it doesn't support emoji. If you want database to support emoji, set database encoding to `utf8mb4`.

Besides, you have to modify `encoding` in `src/common/config/db.js` to `utf8mb4`:

```js
export default {
  encoding: "utf8mb4"
}
```

### Error: Handshake inactivity timeout

In some Node.js version(like 4.2.0), connect Mysql will throw this error:

```js
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

To solve this, just update Node.js to the latest version.

This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_mysql.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_mysql.md).