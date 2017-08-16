## Cache / 缓存

在项目中，我们经常用到缓存的功能，并且可能要用到不同类型的缓存。框架通过 [think-cache](https://github.com/thinkjs/think-cache) 扩展和对应的 Adapter 来操作缓存。

### 配置扩展和 Adapter

修改扩展配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加下面的配置：

```js
const cache = require('think-cache');
module.exports = [
  cache
]
```

修改 Adapter 配置文件 `src/config/adapter.js`（多模块项目为 `src/common/config/adapter.js`），添加下面的配置：

```js
const fileCache = require('think-cache-file');

exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // 单位：毫秒
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // 缓存文件存放的路径
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // 清理过期缓存定时时间
  }
}
```
支持的缓存类型列表见：<https://github.com/thinkjs/think-awesome#cache>。

### 注入的方法

添加 think-cache 扩展后，会注入 `think.cache`、`ctx.cache` 和 `controller.cache` 方法，其中 ctx.cache 和 controller.cache 都是 think.cache 方法的包装，会读取当前请求下对应的缓存配置。

#### 获取缓存

```js
module.exports = class extends think.Controller {
  // 获取缓存
  async indexAction() {
    const data = await this.cache('name');
  }
  // 指定缓存类型获取，从 redis 里获取缓存，需要配置对应的 adapter
  async index2Action() {
    const data = await this.cache('name', undefined, 'redis');
  }
}
```

操作缓存的时候一般都是先读取缓存，如果不存在，再从对应的地方获取然后再写入缓存，如果每次都这么操作会导致代码写起来很麻烦。支持 value 为函数的方式来读取缓存。

```js
module.exports = class extends think.Controller {
  // 如果缓存存在，直接读取缓存
  // 如果缓存不存在，则执行 value 函数，然后将返回值设置到缓存中并返回。
  // 如果 value 函数里有异步操作，需要返回 Promise
  async indexAction() {
    const data = await this.cache('name', () => {
      return getDataFromApi();
    });
  }
}
```

#### 设置缓存

```js
module.exports = class extends think.Controller {
  // 设置缓存
  async indexAction() {
     await this.cache('name', 'value');
  }
  // 设置缓存，切换类型
  async index2Action() {
    await this.cache('name', 'value', 'redis');
  }
}
```

#### 删除缓存

```js
module.exports = class extends think.Controller {
  // 删除缓存
  async indexAction() {
    await this.cache('name', null);
  }
  // 删除缓存，切换类型
  async index2Action() {
    await this.cache('name', null, 'redis');
  }
}
```

### 缓存 gc

有些缓存容器在设置值的时候可以设置超时时间，如：Memcache、Redis，这样数据会自动过期然后删除。但有些缓存容器是没有自动删除的功能的，如：File、Db 等，这个时候就需要处理缓存过期后的清理。

缓存过期清理添加了 `gcInterval` 配置用来配置清理的时间间隔，最小为一个小时。表示为：一个小时执行一次缓存容器的 `gc` 方法，具体的清理逻辑在缓存的 gc 方法中定义，由 [think-gc](https://github.com/thinkjs/think-gc) 模块负责调度。

### 常见问题

#### 数据可以缓存在 Node.js 的内存中么？

理论上是可以的，但并不建议这么做。当缓存数据量暴涨时会导致内存占用量过大，进而影响用户请求的处理，得不偿失。
