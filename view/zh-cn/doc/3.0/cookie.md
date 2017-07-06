## Cookie

### 配置
没有默认配置。需要在`src/config/config.js`中添加 cookie 配置，比如：

```js
module.exports = {
  cookie: {
    domain: '', 
    path: '/',
    httponly: false, // 是否 http only
    secure: false,
    timeout: 0  // 有效时间，0 表示载浏览器进程内有效，单位为秒。
  }
}
```

### 获取 cookie
在 controller 或者 logic 中，可以通过`this.cookie`方法来获取 cookie。如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    let cookie = this.cookie('theme'); // 获取名为 theme 的 cookie
  }
}
```
`this.ctx`也提供了`cookie`方法来设置 cookie。如：

```js
this.ctx.cookie('theme');
```
### 设置 cookie
在 controller 或者 logic 中，可以通过 `this.cookie`方法来设置 cookie。如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    let cookie = this.cookie('theme', 'default'); // 将 cookie theme 值设置为 default
  }
}
```
`this.ctx`也提供了`cookie`方法来设置 cookie。如：

```js
this.ctx.cookie('theme', 'default');
```
如果希望在设置 cookie 时改变配置参数，可以通过第三个参数来控制。比如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    let cookie = this.cookie('theme', 'default', {
      timeout: 7 * 24 * 3600 // 设置 cookie 有效期为 7 天
    }); // 将 cookie theme 值设置为 default
  }
}

```

### 删除 cookie

在 controller 或者 logic 中，可以通过`this.cookie`方法来删除。比如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    let cookie = this.cookie('theme', null); //  删除名为 theme 的 cookie
  }
}

```

`this.ctx`也提供了`cookie`方法来删除 cookie。如：

```js
this.ctx.cookie('theme', null);

```