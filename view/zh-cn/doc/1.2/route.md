## 路由

路由是 ThinkJS 中一个非常重要的特性，通过自定义路由，可以让 url 更加友好。

当访问 `http://hostname:port/分组/控制器/操作/参数名/参数值/参数名2/参数值 2?arg1=argv1&arg2=argv2` 时，通过 `url.parse` 解析到的 `pathname` 为 `/分组/控制器 /操作/参数名/参数值/参数名2/参数值2`。

### url 过滤

有时候为了搜索引擎友好或者其他原因时，pathname 值并不是直接 `/ 分组 / 控制器 / 操作 /` 的方式，而是含有一些前缀后者后缀。

比如：url 后加 `.html` 让其更加友好，这种情况下可以通过下面的配置使其在识别的时候去除。

```js
//url 过滤配置
'url_pathname_prefix': '', // 前缀过滤配置'url_pathname_suffix':'.html' // 后缀过滤配置
```

经过前缀和后缀去除后，pathname 的值就比较干净了。

` 注：` 如果前缀和后缀去除还满足不了需求，可以通过标签位 `path_info` 来修正 pathname 值。

### 路由识别

拿到干净的 pathname 值后，默认通过 `/ 分组 / 控制器 / 操作 ` 的规则来切割识别。

如：pathname 为 `/admin/group/list` 识别后的分组为 `admin`，控制器 `group`，操作为 `list`。

这里的前提是分组 `admin` 必须在配置 `app_group_list` 列表中。`app_group_list` 默认值为：

```js
// 分组列表
'app_group_list': ["Home", "Admin"], 
```

如果不在配置列表中，那么识别到的分组为默认分组名称，控制器为 admin，操作为 group。

分组、控制器、操作默认值在如下的配置中：

```js
'default_group': 'Home', // 默认分组
'default_controller': 'Index', // 默认控制器
'default_action': 'index',  // 默认操作
// 操作默认后缀
'action_suffix': 'Action', 
```

识别到对应的分组、控制器、操作后，会调用对应的 controller，执行对应的 action 方法。如:

pathname 为：`/admin/group/list`，会加载 `App/Lib/Controller/Admin/GroupController.js` 文件，实例化该类，并调用 `listAction` 方法。

### 自定义路由

在实际的项目中，有些重要的接口我们想让 url 尽量简单。如：文章的详细页面，默认路由可能是：`article/detail/id/10`，但我们想要的 url 是 `article/10` 这种更简洁的方式。这种 url 如果用默认的路由规则解析，解析出来的控制器和操作并不是我们想要的。

为此 ThinkJS 提供一套自定义路由的策略，需要开启如下的配置：

```js
// 默认情况下开启自定义路由
'url_route_on': true
```

开启了自定义路由功能后，就可以在路由配置文件中定义想要的路由解析了。路由配置文件为：`App/Conf/route.js`，格式如下：

```js
//
// 自定义路由规则
module.exports = [
    ["规则 1", "需要识别成的 path"], // 规则到具体 pathname 的映射
    ["规则 2", {  // 同一个规则根据不同的请求方式对应到不同的 pathname 上
        "get": "get 请求时识别成的 path", 
        "delete": "delete 请求时识别成的 path",
        "put,post": "put,post 请求时识别成的 path" // 请求方式为 put 或者 post 时对应的 pathname
    }]
]
```

ThinkJS 里提供了 3 种自定义路由的方式，下面逐一介绍：

#### 正则路由

正则路由是采用正则表示式来定义路由的一种方式，依靠强大的正则表达式，能够定义非常灵活的路由规则。如：

```js
// 正则路由
module.exports = [
    [/^doc\/?(.*)$/, "index/doc?doc=:1"]
]
```

这个规则表示将 `http://hostname:port/doc/xxx/yyy` 这种请求识别到 `index/doc` 下。

<div class="alert alert-info">
    对于正则表达式中的每个变量 (即子模式) 部分，如果需要在后面的路由地址中引用，那么可以采用 :1, :2 这样的方式，序号就是子模式的序号。
</div> 

这里将 doc 后面的 `xxx/yyy` 值设置到参数 `doc` 中，那么在 `IndexController.js` 文件的 `docAction` 方法就可以通过 `this.get("doc")` 来获取该值。

#### 规则路由

规则路由包含静态地址和动态地址，或者是两种地址的结合，如：

```js
module.exports = [
    ["my", "user/info"],
    ["blog/:id", "Blog/detail"],
    ["group/:year/:month", "group/list"]
]
```
规则路由以 "/" 进行参数分割，每个参数中以 ":" 开头的参数表示动态参数，并且会自动生成一个对应的 GET 参数，如：上面的 blog/:id，可以在 Controller 里的 Action 里通过 `this.get('id')` 来获取 id 的值。

#### 静态路由

静态路由是一种纯静态字符串的路由规则，如：

```js
module.exports = [
    ["top", "index/top"],
    ["info", "index/user/info"]
]
```
静态路由有时候做一些地址重定向的时候可能会用到。
