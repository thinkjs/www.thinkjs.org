## 配置

实际项目中，肯定需要各种配置，包括：框架需要的配置以及项目自定义的配置。ThinkJS 中所有的配置文件都是放在 `src/config/` 目录下，并根据不同的功能划分为不同的配置文件。

* `config.js` 通用的一些配置
* `adapter.js` adapter 配置
* `router.js` 自定义路由配置
* `middleware.js` middlware 配置
* `validator.js` 数据校验配置
* `extend.js` extend 配置

### 配置格式


```js
// src/config.js

module.exports = {
  port: 1234,
  redis: {
    host: '192.168.1.2',
    port: 2456,
    password: ''
  }
}
```

配置值即可以是一个简单的字符串，也可以是一个复杂的对象。具体是什么类型根据具体的需求来决定。

### 多环境配置

有些配置需要在不同的环境下配置不同的值，如：数据库的配置在开发环境和生产环境是不一样的。此时可以通过环境下对应不同的配置文件来完成。

多环境配置文件格式为：`[name].[env].js`，如：`config.development.js`，`config.production.js`

在以上的配置文件中，`config.js` 和 `adapter.js` 是支持不同环境配置文件的。

### 配置合并方式

系统启动时，会对配置合并，最终提供给开发者使用。具体流程为：

* 加载 `[ThinkJS]/lib/config.js`
* 加载 `[ThinkJS]/lib/config.[env].js`
* 加载 `[ThinkJS]/lib/adapter.js`
* 加载 `[ThinkJS]/lib/adapter.[env].js`
* 加载 `src/config/config.js`
* 加载 `src/config/config.[env].js`
* 加载 `src/config/adapter.js`
* 加载 `src/config/adapter.[env].js`

`[env]` 为当前环境名称。最终会将这些配置按顺序合并在一起，同名的 key 后面会覆盖前面的。

配置加载是通过 [think-loader](https://github.com/thinkjs/think-loader/) 模块实现的，具体代码见： <https://github.com/thinkjs/think-loader/blob/master/loader/config.js>。

### 使用配置

框架提供了在不同的环境下不同的方式快速获取配置：

* 在 ctx 中，可以通过 `ctx.config(key)` 来获取配置
* 在 controller 中，可以通过 `controller.config(key)` 来获取配置
* 其他情况下，可以通过 `think.config(key)` 来获取配置

实际上，`ctx.config` 和 `controller.config` 是基于 `think.config` 包装的一种更方便的获取配置的方式。

```
const redis = ctx.config('redis'); //获取 redis 配置
```

### 动态设置配置

除了获取配置，有时候需要动态设置配置，如：将有些配置保存在数据库中，项目启动时将配置从数据库中读取出来，然后设置上去。

框架也提供了动态设置配置的方式，如：`think.config(key, value)`

```
// src/bootstrap/worker.js

//HTTP 服务启动前执行
think.beforeStartServer(async () => {
  const config = await think.model('config').select();
  think.config('userConfig', config); //从数据库中将配置读取出来，然后设置
})
```

### 常见问题

#### 能否将请求中跟用户相关的值设置到配置中？

`不能`。配置设置是全局的，会在所有请求中生效。如果将请求中跟用户相关的值设置到配置中，那么多个用户同时请求时会相互干扰。

#### config.js 和 adapter.js 中的 key 能否重名？

`不能`。由于 config.js 和 adapter.js 是合并在一起的，所以要注意这二个配置不能有相同的 key，否则会被覆盖。
