## Session

Thinkjs内置了Session功能。框架已经为controller和context添加了`session`方法。我们支持用多种方式存储session，包括：cookie，mysql，file，redis等。

### 支持的Session存储方式

* `cookie`Cookie方式
* `mysql`Mysql数据库方式
* `file`文件方式
* `redis`Redis方式

#### Mysql session

使用`mysql`类型的Session需要创建对应的数据表，可以用下面的SQL语句创建

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

配置文件`src/config/adapter.js`，添加如下选项（假设你默认使用Cookie方式的Session）：

```
const cookieSession = require('think-session-cookie');
const fileSession = require('think-session-file');

exports.session = {
  type: 'mysql',
  common: {
    cookie: {
      name: 'test',
      keys: ['werwer', 'werwer'],
      signed: true
    }
  },
  cookie: {
    handle: cookieSession,
    cookie: {
      maxAge: 1009990 * 1000,
      keys: ['welefen', 'suredy'],
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
* `type`：默认使用的Session类型，具体调用时可以传递参数改写（见“使用`session`方法”一节）
* `common`：配置通用的一些参数，会跟具体的 Adapter 参数合并
* `cookie,file,mysql`：配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并后的结果。我们注意到，在这几个配置里面都有一个`handle`参数。
* `handle`：对应类型的处理函数，一般为一个类。

具体看一下cookie方式的参数。`handle`上面已经介绍过，略过不表。
* `maxAge`：该session要在cookie中保留多长时间
* `keys`：当`encrypt`参数为`true`时，需要提供`keys`数组。该数组充当了加解密的密钥。
* `encrypt`：为`true`表示需要加密存储session。

接着看一下file方式的参数：
* `sessionPath`：存储session的文件的路径。在本例中，如果使用文件方式，会将session存储*'/path_of_your_project/runtime/session'*下。

### 使用`session`方法：

#### 读取Session
* `this.session()`获取所有的session数据
* `this.session(name)`获取`name`对应的session数据

#### 设置Session
* `this.session(name, value)`设置session数据。

#### 清除Session
* `this.session(null)`删除所有的session数据。

#### 在读取／设置／清除时，改写默认配置
例如：

* `this.session(name, undefined, options)`以`options`配置项来获取session数据。

`options`配置项会与adapter中的默认配置合并。如果有相同的配置属性，对每个ctx，首次调用`this.session`时，将以`options`的配置属性为准。

*注意：对于每个ctx，session只会初始化一次。*
