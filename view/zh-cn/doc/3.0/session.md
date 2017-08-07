## Session

Thinkjs 内置了 Session 功能。框架已经为 controller 和 context 添加了`session`方法。我们支持用多种方式存储 session，包括：cookie，mysql，file，redis 等。

### 支持的Session存储方式

* `cookie` Cookie方式
* `mysql` Mysql数据库方式
* `file` 文件方式
* `redis` Redis方式

#### Mysql session

使用`mysql`类型的 Session 需要创建对应的数据表，可以用下面的 SQL 语句创建

```
  DROP TABLE IF EXISTS `think_session`;
  CREATE TABLE `think_session` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `cookie` varchar(255) NOT NULL DEFAULT '',
    `data` text,
    `expire` bigint(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cookie` (`cookie`),
    KEY `expire` (`expire`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```
#### redis Session
使用`redis`类型的Session需要依赖`think-redis`模块。

### 如何配置Session

配置文件`src/config/adapter/session.js`，添加如下选项（假设你默认使用 Cookie 方式的 Session）：

```
const cookieSession = require('think-session-cookie');
const fileSession = require('think-session-file');

exports.session = {
  type: 'cookie',
  common: {
    cookie: {
      name: 'ThinkJS',
      keys: ['signature key2', 'signature key1'],
      signed: true
    }
  },
  cookie: {
    handle: cookieSession,
    cookie: {
      maxAge: 1009990 * 1000,
      keys: ['signature key2', 'signature key1'],
      encrypt: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
```
接下来解释一下这个配置文件的各种参数：
* `type`：默认使用的 Session 类型，具体调用时可以传递参数改写（见“使用`session`方法”一节）
* `common`：配置通用的一些参数，会跟具体的 Adapter 参数合并
* `cookie,file,mysql`：配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并后的结果。我们注意到，在这几个配置里面都有一个`handle`参数。
* `handle`：对应类型的处理函数，一般为一个类。

具体看一下 Cookie 方式的参数。`handle`上面已经介绍过，略过不表。
* `maxAge`：该 session 要在 cookie 中保留多长时间
* `keys`：当`encrypt`参数为`true`时，需要提供`keys`数组。该数组充当了加解密的密钥。
* `encrypt`：为`true`表示需要加密存储 session。

接着看一下file方式的参数：
* `sessionPath`：存储 session 的文件的路径。在本例中，如果使用文件方式，会将 session 存储*'/path_of_your_project/runtime/session'*下。

### 使用`session`方法：

#### 读取Session
* `this.session()`获取所有的 session 数据
* `this.session(name)`获取`name`对应的 session 数据

#### 设置Session
* `this.session(name, value)`设置 session 数据。

#### 清除Session
* `this.session(null)`删除所有的 session 数据。

#### 在读取／设置／清除时，改写默认配置
例如：

* `this.session(name, undefined, options)`以`options`配置项来获取 session 数据。

`options`配置项会与 adapter 中的默认配置合并。如果有相同的配置属性，对每个 ctx，首次调用`this.session`时，将以`options`的配置属性为准。

*注意：对于每个 ctx，session 只会初始化一次。*
