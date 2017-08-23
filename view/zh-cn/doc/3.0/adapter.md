## Adapter / 适配器

Adapter 是用来解决一类功能的多种实现，这些实现提供一套相同的接口，类似设计模式里的工厂模式。如：支持多种数据库，支持多种模版引擎等。通过这种方式，可以很方便的在不同的类型中进行切换。Adapter 一般配合 Extend 一起使用。

框架默认提供了很多种 Adapter，如： View，Model，Cache，Session，Websocket，项目中也可以根据需要进行扩展，也可以引入第三方的 Adapter。

### Adapter 配置

Adapter 的配置文件为 `src/config/adapter.js`（多模块项目文件为 `src/common/config/adapter.js`），格式如下：

```js
const nunjucks = require('think-view-nunjucks');
const ejs = require('think-view-ejs');
const path = require('path');

exports.view = {
  type: 'nunjucks', // 默认的模板引擎为 nunjucks
  common: { //通用配置
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: { // nunjucks 的具体配置
    handle: nunjucks
  },
  ejs: { // ejs 的具体配置
    handle: ejs,
    viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
  }
}

exports.cache = {
  ...
}
```

* `type` 默认使用 Adapter 的类型，具体调用时可以传递参数改写
* `common` 配置通用的一些参数，项目启动时会跟具体的 adapter 参数作合并
* `nunjucks` `ejs` 配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并
* `handle` 对应类型的处理函数，一般为一个类


Adapter 配置支持运行环境，可以根据不同的运行环境设置不同的配置，如：在开发环境和生产环境的数据库一般都是不一样的，这时候可以通过 `adapter.development.js` 和 `adapter.production.js` 存放有差异的配置，系统启动后会读取对应的运行环境配置和默认配置进行合并。

如：现在是在生产环境下，那么会读取 `adapter.production.js` 和 `adapter.js` 配置进行合并生成最终的 adapter 配置。

Adapter 的配置读取和合并在项目启动时就已经执行，对于上面的配置，最终合并的配置如下：

```js
exports.view = {
  type: 'nunjucks', // 默认的模板引擎为 nunjucks
  nunjucks: { // nunjucks 的具体配置
    handle: nunjucks,
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  ejs: { // ejs 的具体配置
    handle: ejs,
    viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  }
}
```

可以看到，common 里的配置会被合并到 nunjucks 和 ejs 中，后续再获取的时候就不用再合并 common 里的配置了。

### Adapter 配置解析

Adapter 配置存储了所有类型下的详细配置，具体使用时需要对其解析，选择对应的一种进行使用。比如上面的配置文件中，配置了 nunjucks 和 ejs 二种模板引擎的详细配置，但具体使用时一种场景下肯定只会用其一种模板引擎。

Adapter 的配置解析是通过 [think-helper](https://github.com/thinkjs/think-helper) 模块中的 `parseAdapterConfig` 方法来完成的，如：

```js
const helper = require('think-helper');
const viewConfig = think.config('view'); // 获取 view adapter 的详细配置

const nunjucks = helper.parseAdatperConfig(viewConfig); // 获取 nunjucks 的配置，默认 type 为 nunjucks
/**
{
  type: 'nunjucks',
  handle: nunjucks,
  viewPath: path.join(think.ROOT_PATH, 'view'),
  sep: '_',
  extname: '.html'
}
*/

const ejs = helper.parseAdatperConfig(viewConfig, 'ejs') // 获取 ejs 的配置
/**
{
  handle: ejs,
  type: 'ejs',
  viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
  viewPath: path.join(think.ROOT_PATH, 'view'),
  sep: '_',
  extname: '.html'
}
*/
```

通过 `parseAdapterConfig` 方法就可以拿到对应类型的配置，然后就可以调用对应的 `handle`，传入配置然后执行了。

当然，配置解析并不需要使用者在项目中具体调用，一般都是在插件对应的方法里已经处理。

### Adapter 使用

Adapter 都是一类功能的不同实现，一般是不能独立使用的，而是配合对应的扩展一起使用。如：view Adapter（think-view-nunjucks、think-view-ejs）配合 [think-view](https://github.com/thinkjs/think-view) 扩展进行使用。

项目安装 think-view 扩展后，提供了对应的方法来渲染模板，但渲染不同的模板需要的模板引擎有对应的 Adapter 来实现，也就是配置中的 `handle` 字段。

### 项目中创建 Adapter

除了引入外部的 Adapter 外，项目内也可以创建 Adapter 来使用。Adapter 文件放在 `src/adapter/` 目录下（多模块项目放在 `src/common/adapter/`），如：`src/adapter/cache/xcache.js`，表示加了一个名为 `xcache` 的 cache Adapter 类型，然后该文件实现 cache 类型一样的接口即可。

实现完成后，就可以直接通过字符串引用这个 Adapter 了，如：

```js
exports.cache = {
  type: 'file',
  xcache: {
    handle: 'xcache', //这里配置字符串，项目启动时会自动查找 src/adapter/cache/xcache.js 文件
    ...
  }
}
```

### 推荐的 Adapter

框架推荐的 Adapter 为 <https://github.com/thinkjs/think-awesome#adapters>。
