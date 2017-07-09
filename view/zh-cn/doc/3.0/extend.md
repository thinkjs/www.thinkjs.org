## Extend

虽然框架内置了很多功能，但在实际项目开发中，提供的功能还是远远不够的。3.0 里引入了 Extend 机制，方便对框架进行扩展。支持的扩展类型为：`think`，`application`，`context`，`request`，`response`，`controller` 和 `logic`。

框架内置的很多功能也是 Extend 来实现的，如：`Session`，`Cache`。

### Extend 配置

Extend 配置文件为 `src/config/extend.js`，格式为数组：

```js
const view = require('think-view');
const fetch = require('think-fetch');
const model = require('think-model');

module.exports = [
  view, //make application support view
  fetch, // HTTP request client
  model(think.app)
];
```

如上，通过 view Extend 框架就支持渲染模板的功能，Controller 类上就有了 `assign`、`display` 等方法。

### 项目里的 Extend

除了引入外部的 Extend 来丰富框架的功能，也可以在项目中对对象进行扩展。扩展文件放在 `src/extend/` 目录下。

* `src/extend/think.js` 扩展 think 对象，如： think.xxx
* `src/extend/application.js` 扩展 think.app 对象，Koa 里的 application 实例
* `src/extend/request.js` 扩展 Koa 里的 request 对象
* `src/extend/response.js` 扩展 Koa 里的 response 对象
* `src/extend/context.js` 扩展 ctx 对象
* `src/extend/controller.js` 扩展 controller 类
* `src/extend/logic.js` 扩展 logic 类，logic 继承 controller 类，所以 logic 包含 controller 类所有方法

比如：我们想给 `ctx` 添加个 `isMobile` 方法来判断当前请求是不是手机访问，可以通过下面的方式：

```
//src/extend/context.js
module.exports = {
  isMobile: function(){
    const userAgent = this.userAgent.toLowerCase();
    const mList = ['iphone', 'android'];
    return mList.some(item => userAgent.indexOf(item) > -1);
  }
}
```

这样后续就可以通过 `ctx.isMobile()` 来判断是否是手机访问了。当然这个方法没有任何的参数，我们也可以变成一个 `getter`。

```
//src/extend/context.js
module.exports = {
  get isMobile: function(){
    const userAgent = this.userAgent.toLowerCase();
    const mList = ['iphone', 'android'];
    return mList.some(item => userAgent.indexOf(item) > -1);
  }
}
```

这样在 ctx 中就可以直接用 `this.isMobile` 来使用，其他地方通过 `ctx.isMobile` 使用，如： 在 controller 中用 `this.ctx.isMobile`。 

如果在 controller 中也想通过 `this.isMobile` 使用，怎么办呢？ 可以给 controller 也扩展一个 `isMobile` 属性来完成。

```
//src/extend/controller.js
module.exports = {
  get isMobile: function(){
    return this.ctx.isMobile;
  }
}
```

通过也给 controller 扩展 `isMobile` 属性后，后续在 controller 里可以直接使用 `this.isMobile` 了。

当然这样扩展后，只能在当前项目里使用这些功能，如果要在其他项目中使用，可以将这些扩展发布为一个 npm 模块。

发布的模块在入口文件里需要定义对应的类型的扩展，如：

```
const controllerExtend = require('./controller.js');
const contextExtend = require('./context.js');

// 模块入口文件
module.exports = {
  controller: controllerExtend,
  context: contextExtend
}
```

### Extend 里使用 app 对象

有些 Extend 需要使用一些 app 对象上的数据，那么可以导出为一个函数，配置时把 app 对象传递进去即可。

```
// src/config/extend.js
const model = require('think-model');
module.exports = [
  model(think.app) //将 think.app 传递给 model 扩展
];
```

当然传了 app 对象，也可以根据需要传递其他对象。

### 推荐 Extend 列表

推荐的 Extend 列表见 <https://github.com/thinkjs/think-awesome#extends>，如果你开发了比较好的 Extend，也欢迎发 Pull Request。
