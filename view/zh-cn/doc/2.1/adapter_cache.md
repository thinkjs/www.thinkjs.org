## Cache

在项目中，合理使用缓存对性能有很大的帮助。ThinkJS 提供了多种的缓存方式，包括：内存缓存、文件缓存、Memcache 缓存、Redis 缓存等。

### 缓存类型

系统默认支持的缓存类型如下：

* `memory` 内存缓存
* `file` 文件缓存
* `memcache` Memcache 缓存
* `redis` Redis 缓存

如果使用 `memcache` 缓存，需要设置 Memcache 配置信息，见 [配置](./config.html#memcache)。

如果使用 `redis` 缓存，需要设置 Redis 配置信息，见 [配置](./config.html#redis)。

### 缓存配置

默认缓存配置如下，可以在配置文件 `src/common/config/cache.js` 中进行修改：

```js
export default {
  type: 'file', //缓存类型
  timeout: 6 * 3600, //失效时间，单位：秒
  adapter: { //不同 adapter 下的配置
    file: {
      path: think.getPath(undefined, think.dirname.runtime) + '/cache', //缓存文件的根目录
      path_depth: 2, //缓存文件生成子目录的深度
      file_ext: '.json' //缓存文件的扩展名
    },
    redis: {
      prefix: 'thinkjs_'
    },
    memcache: {
      prefix: 'thinkjs_'
    }
  }
};
```

`注`：`2.0.6` 版本开始添加了 adapter 配置。

其中 `prefix` 在 `memcache` 和 `redis` 类型中使用，存储时会将缓存 key + prefix 作为新的 key 来存储，用于防止跟其他地方使用的缓存 key 冲突。如果不想设置 prefix，可以将 prefix 设置为空字符串，如：

```js
export default {
  prefix: '' //将缓存 key 前缀设置为空
}
```


### 使用缓存

可以通过 `think.cache` 方法对缓存进行增删改查操作，具体请见 [API -> think](./api_think.html#toc-7d7)。

如果当前使用场景在继承自 think.http.base 的类下，可以通过 `this.cache` 方法来操作缓存，具体请见 [API -> think.http.base](.//api_think_http_base.html#cache-name-value-options)。


### 扩展缓存

可以通过下面的命令创建一个名为 `foo` 缓存类：

```sh
thinkjs adapter cache/foo
```

执行完成后，会创建文件 `src/common/adapter/cache/foo.js`。扩展缓存类需要实现如下的方法：

```js
export default class extends think.cache.base {
  /**
   * 初始化方法
   * @param  {Object} options []
   * @return {}         []
   */
  init(options){
    //set gc type & start gc
    this.gcType = 'cache_foo';
    think.gc(this);
  }
  /**
   * 获取缓存
   * @param  {String} name []
   * @return {Promise}      []
   */
  get(name){

  }
  /**
   * 设置缓存
   * @param {String} name    []
   * @param {Mixed} value   []
   * @param {Number} timeout []
   * @return {Promise}
   */
  set(name, value, timeout){

  }
  /**
   * 删除缓存
   * @param  {String} name []
   * @return {Promise}      []
   */
  delete(name){

  }
  /**
   * 缓存垃圾回收
   * @return {Promise} []
   */
  gc(){

  }
}
```

框架里的 Cache 实现请见 <https://github.com/75team/thinkjs/tree/master/src/adapter/cache>。

### 使用第三方缓存 Adapter

如何使用第三方的缓存 Adapter 请参见 [Adapter -> 介绍](./adapter_intro.html#toc-e7c)。
