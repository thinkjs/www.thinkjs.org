## Mysql

ThinkJS 对 Mysql 操作有很好的支持，底层使用的库为 <https://www.npmjs.com/package/mysql>。

### 连接池

默认连接 Mysql 始终只有一个连接，如果想要多个连接，可以使用连接池的功能。修改配置 `src/config/adapter/model.js`，如：

```js
module.exports = {
  common: {
    connectionLimit: 10 //建立 10 个连接
  }
}
```

### socketPath

默认情况下是通过 host 和 port 来连接 Mysql 的，如果想通过 unix domain socket 来连接 Mysql，可以设置下面的配置：

```js
module.exports = {
  common: {
    socketPath: '/tmp/mysql.socket'
  }
}
  
```

### SSL options

可以通过下面的配置来指定通过 SSL 来连接：

```js
const fs = require('fs');
module.exports = {
  common: {
    ssl: {
      ca: fs.readFileSync(__dirname + '/mysql-ca.crt')
    }
  }
}
```

### 数据库支持 emoji 表情

数据库的编码一般会设置为 `utf8`，但 utf8 并不支持 emoji 表情，如果需要数据库支持 emoji 表情，需要将数据库编码设置为 `utf8mb4`。

同时需要将 `src/config/adapter/model.js` 里的 `encoding` 配置值修改为 `utf8mb4`。如：

```js
module.exports = {
  common: {
    encoding: 'utf8mb4'
  }
}
```