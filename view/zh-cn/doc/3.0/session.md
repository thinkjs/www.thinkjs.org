## Session / 会话

WEB 请求中经常通过 session 来维持会话的，框架通过 [think-session](https://github.com/thinkjs/think-session) 和 Adapter 来支持 session 功能。

### 配置扩展和 Adapter

修改扩展配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加下面的配置：

```js
const session = require('think-session');
module.exports = [
  session
]
```


修改 Adapter 配置文件 `src/config/adapter.js`（多模块项目为 `src/common/config/adapter.js`），添加下面的配置：

```js
const fileSession = require('think-session-file');

exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['signature key'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
```
支持的 session 类型列表见：<https://github.com/thinkjs/think-awesome#session>，其中 cookie 选项为 session 设置 cookie 时的配置项，会和 `think.config('cookie')` 值进行合并，name 字段值为 session 对应 cookie 的名字。


### 注入的方法

添加 think-session 扩展后，会注入 `ctx.session` 和 `controller.session` 方法，其中 controller.session 是 ctx.cache 方法的包装，会读取当前请求下对应的缓存配置。

#### 读取 session

```js
module.exports = class extends think.Controller {
  // 获取 session
  async indexAction() {
    const data = await this.session('name');
  }
}
```

#### 设置 session

```js
module.exports = class extends think.Controller {
  // 设置 session
  async indexAction() {
    await this.session('name', 'value');
  }
}
```

#### 删除 session

```js
module.exports = class extends think.Controller {
  // 删除整个 session
  async indexAction() {
    await this.session(null);
  }
}
```

### 常见问题

#### 一个请求下能操作不能类型的 session 么？

不能。session 数据是异步更新的，所以一个请求下只允许使用一种 session。

#### session 数据是怎么同步的？

当 session 数据改变后，并不会立即更新到 session 容器里（为了性能考虑），而是在请求结束时统一更新。

```js
this.ctx.res.once('finish', () => {
  this.flush(); // 在请求时将 session flush 导存储容器中
});
```

#### 如何获取 session 对应 cookie 的值？

session 对应 cookie 的值是不能手工设置的，而是框架自动生成，生成方式为 [think.uuid](/doc/3.0/think.html#toc-9ac)。后续 Action 中可以通过 `this.cookie('thinkjs')` （thinkjs 为 session 对应 cookie 的字段名称）。

#### 如何限制同一个帐号在不同的端登录？

有些情况下，只允许一个帐号在一个端下登录，如果换了一个端，需要把之前登录的端踢下线（默认情况下，同一个帐号可以在不同的端下同时登录的）。这时候可以借助一个服务保存用户唯一标识和 session cookie 值的对应关系，如果同一个用户，但 cookie 不一样，则不允许登录或者把之前的踢下线。如：

```js
// 当用户登录成功后
const cookie = this.cookie('thinkjs');
const uid = userInfo.id;
await this.redis.set(`uid-${uid}`, cookie);

// 请求时，判断 session cookie 值是否相同
const userInfo = await this.session('userInfo');
const cookie = this.cookie('thinkjs');
const saveCookie = await this.redis.get(`uid-${userInfo.id}`);
if(saveCookie && saveCookie !== cookie) {
  // 不是最近一台登录的设备
}
```