## 静态资源访问

项目开发时，一般都需要在模版里引用静态资源。

使用 `thinkjs` 命令创建项目时，会自动创建 `www/static` 目录，该目录下专门用来存放 JS、CSS、图片等静态资源。

### 访问静态资源

静态资源放在 `www/static` 目录后，模版里就可以通过下面的方式引入静态资源。

#### 模版里引用 JS 文件

```html
<script src="/static/js/foo.js"></script>
```

#### 模版里引用 CSS 文件

```html
<link href="/static/css/foo.css" rel="stylesheet" />
```

#### 模版里引用图片文件

```html
<img src="/static/img/foo.png" alt="" >
```

### 静态资源访问配置

对于一个请求是否是静态资源请求，是通过正则来判断的。默认配置如下：

```js
export default {
  resource_on: true, //是否开启静态资源解析功能
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //判断为静态资源请求的正则
}
```

项目里可以根据需要在配置文件里 `src/common/config/config.js` 进行修改。

### 线上关闭静态资源访问

项目上线后，一般会使用 nginx 等 WEB 服务器做一层代理，这时候就可以将静态资源的请求直接让 nginx 来处理，项目里就可以关闭对静态资源请求的处理来提高性能。

可以在配置文件 `src/common/config/env/prodution.js` 里修改配置来关闭，如：

```js
export default {
  resource_on: false
}
```
