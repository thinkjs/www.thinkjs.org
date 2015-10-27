## 配置

ThinkJS 提供了灵活的全局配置功能，这些配置值随着服务启动而生效，并且在后续所有的 http 请求中都有效。

系统支持默认配置、公共配置、调试配置、模式配置等多种配置方式。

<div class='alert alert-danger'>
    注意：不可将一个 http 请求中的私有值设置到配置中，这将会被下一个 http 设置的值给冲掉。
</div> 


### 配置格式

```js
// 配置格式
module.exports = {
    'port': 1234,
    'db_host': '127.0.0.1', // 服务器地址
    'db_name': 'think_web', // 数据库名
    'db_user': 'root', // 用户名
    'db_pwd': '', // 密码
    'use_websocket': true, // 使用 websocket
}
```

` 注意：` 配置参数的 key 不区分大小写（key 会强制转为小写）。建议使用小写，便于阅读。

配置值除了是简单的数据外，也可以是数组、对象、函数等。

```js
// 配置
module.exports = {
    'list': ['1', '2'],
    'fn': function(){
        //do something
    }
}
```

### 配置加载

配置加载遵循下面的加载顺序，且后面加载的配置值覆盖前面加载的值。

`系统默认配置 -> 应用配置 -> 调试配置 -> 模式配置`

#### 系统默认配置

系统默认配置包含了所有的 ThinkJS 中用到的配置，并给出了默认值。该文件在 ThinkJS 的 `lib/Conf/config.js`，你可以在 [附录 -> 默认配置 ](/doc/appendix.html#appendix_config) 中查看详细的配置。

系统配置文件会在服务启动时自动调用。

#### 应用配置

应用配置文件在 `App/Conf/config.js` 里，服务启动时会自动调用。

#### 调试配置

如果在入口文件将 APP_DEBUG 设置为 true, 那么会自动读取调试配置，配置文件为 `App/Conf/debug.js`。

如果该文件不存，则不加载。

#### 模式配置

ThinkJS 除了默认的启 http 服务运行，也可以命令行下运行，命令行下对应的模式为 cli。

模式配置文件为 `App/Conf/mode.js`，该文件内容格式如下：

```js
// 配置
module.exports = {
    'cli': {  // 命令行模式下的配置
       'use_cluster': false
    },
    'cli_debug': {// 命令行模式开启了 debug 的配置

    }  
}

```

### 配置读取

无论何种配置文件，定义了配置后，都统一使用函数 `C` 来获取配置值。如：

```js
var dbHost = C('db_host');
```

### 配置写入

配置写入除了默认加载预订的配置文件外，也可以通过函数 `C` 写入配置，如：

```js
// 设置配置
C('name', 'welefen');
// 设置二级配置
C('cache.db_time', 60);
// 也可以批量设置配置
C({
    'name': 'welefen',
    'use_cluster': false
})
```

` 注意：` 如果是一级配置，则配置名中不能含有字符 `.`，含有 `.` 会自动当作二级配置。


### 扩展配置

如果配置项比较多的话，这时候可能就需要考虑将配置分类了，并且存放在不同的配置文件里。可以通过如下的方式进行：

```js
// 配置文件写入这个配置，表示额外加载 cache.js 和 db.js 2 个配置文件，配置文件也在 Conf 目录下
'load_ext_config': ['cache', 'db']
```

有这个配置后，系统启动时会自动加载 `App/Conf/cache.js` 和 `App/Conf/db.js` 2 个配置文件。
