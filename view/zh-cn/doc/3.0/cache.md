## Cache
在项目中，我们需要使用缓存来优化性能。Thinkjs 提供了多种方式的缓存方式，包括：文件缓存，Memcache 缓存，Redis 缓存。

### 缓存类型
系统默认支持的缓存类型如下：

* `file`文件缓存
* `memcache`Memcache 缓存
* `redis`Redis 缓存

### 缓存配置
配置文件`src/config/adapter.js`，添加如下选项（假设你默认使用 file 类型的 Cache）：

```js
const fileCache = require('think-cache-file');
const redisCache = require('think-cache-redis');
const memcacheCache = require('think-cache-memcache');
const path = require('path');

exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000, // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // 必须是绝对路径
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: '127.0.0.1',
    password: ''
  },
  memcache: {
    handle: memcacheCache,
    hosts: ['127.0.0.1:11211'],
    maxValueSize: 1048576,
    netTimeout: 5000,
    reconnect: true
  }
}

```
接下来解释一下这个配置文件的各种参数：
* `type`：默认使用的 Cache 类型，具体调用时可以传递参数改写（见“使用方法”一节）
* `common`：配置通用的一些参数，会跟具体的 Adapter 参数合并
* `file`：配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并后的结果。注意，需要提供一个`handle`参数。
* `handle`：对应类型的处理函数，一般为一个类。

具体看一下 file 方式的参数。`handle`上面已经介绍过了，看其它参数。
* `cachePath`：缓存文件的根目录（绝对路径）。
* `pathDepth`：缓存文件路径的深度，这是为了避免在根目录下创建太多文件，从而超过操作系统的限制以及降低查找效率。
* `gcInterval`：缓存的垃圾回收时间间隔。

redis 方式的参数，参考 [https://github.com/luin/ioredis/blob/master/lib/redis.js](https://github.com/luin/ioredis/blob/master/lib/redis.js)。
memcache 方式的参数，参考 [http://memcache-plus.com/](http://memcache-plus.com/)。

### 使用方法
在 controller 或 logic 中，使用`this.cache(name, value, options)`来操作缓存。

* `name` {String} 缓存的键
* `value` {Mixed} 缓存值
* `options` {Object} 缓存选项
* `return` {Promise} 操作返回 Promise 对象

当`value`是`undefined`时表示读取缓存。
当`value`是`null`时表示删除缓存。
当`value`是函数时，表示获取缓存，如果获取不到，则调用该函数取得返回值，然后将返回值设置到缓存中并返回该值。

```js
//获取缓存
this.cache('name').then(data => {});

//指定缓存类型获取，从 redis 里获取缓存
this.cache('name', undefined, {type: 'redis'});

//如果缓存 userList 不存在，则查询数据库，并将值设置到缓存中
this.cache('userList', () => {
  return this.model('user').select();
});

//设置缓存
this.cache('name', 'value');

//删除缓存
this.cache('name', null);

```
