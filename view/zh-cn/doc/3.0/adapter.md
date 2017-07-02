## Adapter

Adapter 是用来解决一类功能的多种实现，这些实现提供一套相同的接口。如：支持多种数据库，支持多种模版引擎等。通过这种方式，可以很方便的再不同的类型中进行切换。

框架提供了多种 Adapter，如： View，Model，Cache，Session，Websocket 等。

### Adapter 配置

Adapter 的配置文件为 `src/config/adapter.js`，格式如下：

```js
const nunjucks = require('think-view-nunjucks');
const ejs = require('think-view-ejs');
const path = require('path');

exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  },
  ejs: {
    handle: ejs,
    viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
  }
}

exports.cache = {
  ...
}
```

* `type` 默认使用 Adapter 的类型，具体调用时可以传递参数改写
* `common` 配置通用的一些参数
* `nunjucks,ejs` 配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并
* `handle` 对应类型的处理函数，一般为一个类


实际项目中，一般一个 Adapter 的配置比较多，并且项目里也会用到多个 Adapter，这样 adapter.js 配置文件就会比较长，这时候可以根据功能进行分拆。

比如：创建目录 `src/config/adapter/`，将每一个功能作为一个独立文件来配置，`adapter/view.js`、`adapter/model.js`。

然后 `src/config/adapter.js` 里的内容可以为：

```
exports.view = require('./adapter/view.js');
exports.model = require('./adapter/model.js');
```

### 项目中创建 Adapter

除了引入外部的 Adapter 外，项目内也可以创建 Adapter 来使用。

Adapter 文件放在 `src/adapter/` 目录下，如：`src/adapter/cache/xcache.js`，表示加了一个名为 `xcache` 的 cache Adapter 类型，然后该文件实现 cache 类型一样的接口即可。

实现完成后，就可以直接通过字符串引用这个 Adapter 了，如：

```js
exports.cache = {
  type: 'file',
  xcache: {
    handle: 'xcache', //这里配置字符串，项目启动时会自动在 src/adapter 目录下查找
    ...
  }
}
```

### 支持的 Adapter

框架支持的 Adapter 为 <https://github.com/thinkjs/think-awesome#adapters>。