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

配置文件`src/config/adapter.js`，添加如下选项（假设你使用Cookie方式的Session）：

```
const cookie = require('think-session-cookie');
exports.session = {
  type: 'cookie',
  cookie: {

  }
}
```

### `session`方法：

#### 读取Session
* `this.session()`获取所有的session数据
* `this.session(name)`获取`name`对应的session数据
* `this.session(name, undefined, options)`以`options`配置项来获取session数据

#### 设置Session
* `this.session(name, value)`设置session数据

#### 清除Session
* `this.session(null)`删除所有的session数据

*注意：对于每个ctx，session只会初始化一次。*
