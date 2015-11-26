## Cookie


### cookie 配置

cookie 默认配置如下：

```js
export default {
  domain: '', 
  path: '/',
  httponly: false, //是否 http only
  secure: false,
  timeout: 0  //有效时间，0 为浏览器进程，单位为秒
};
```

默认 cookie 是随着浏览器进程关闭而失效，可以在配置文件 `src/common/config/cookie.js` 中进行修改。如：

```js
export default {
  timeout: 7 * 24 * 3600  //将 cookie 有效时间设置为 7 天
};
```

### 获取 cookie

controller 或者 logic 中，可以通过 `this.cookie` 方法来获取。如：

```js
export default class extends think.controller.base {
  indexAction(){
    let cookie = this.cookie('theme'); //获取名为 theme 的 cookie
  }
}
```

http 对象里也提供了 `cookie` 方法来获取 cookie。如：

```js
let cookie = http.cookie('theme');
```



### 设置 cookie

controller 或者 logic 中，可以通过 `this.cookie` 方法来设置。如：

```js
export default class extends think.controller.base {
  indexAction(){
    this.cookie('theme', 'default'); //将 cookie theme 值设置为 default
  }
}
```

http 对象里也提供了 `cookie` 方法来设置 cookie。如：

```js
http.cookie('theme', 'default');
```

如果设置 cookie 时想修改一些参数，可以通过第三个参数来控制，如：

```js
export default class extends think.controller.base {
  indexAction(){
    this.cookie('theme', 'default', {
      timeout: 7 * 24 * 3600 //设置 cookie 有效期为 7 天
    }); //将 cookie theme 值设置为 default
  }
}
```

### 删除 cookie

controller 或者 logic 中，可以通过 `this.cookie` 方法来删除。如：

```js
export default class extends think.controller.base {
  indexAction(){
    this.cookie('theme', null); //删除名为 theme 的 cookie
  }
}
```

http 对象里也提供了 `cookie` 方法来删除 cookie。如：

```js
http.cookie('theme', null);
```
