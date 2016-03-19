## 路由

当用户访问一个 URL 时，最终执行哪个模块下哪个控制器的哪个操作，这是由路由来解析后决定的。

ThinkJS 提供了一套灵活的路由机制，除了默认的解析外，还可以支持多种形式的自定义路由，让 URL 更加简单友好。

### URL 解析为 pathname

当用户访问服务时，服务端首先拿到的是一个完整的 URL，如：访问本页面，得到的 URL 为 `http://www.thinkjs.org/zh-cn/doc/2.0/route.html`。

将 URL 进行解析得到的 pathname 为 `/zh-cn/doc/2.0/route.html`。

### pathname 过滤

有时候为了搜索引擎优化或者一些其他的原因， URL 上会多加一些东西。比如：当前页面是一个动态页面，但 URL 最后加了 `.html`，这样对搜索引擎更加友好。但这些在后续的路由解析中是无用的，需要去除。

ThinkJS 里提供了下面的配置可以去除 `pathname` 的前缀和后缀内容：

```js
export default {
  pathname_prefix: '', 
  pathname_suffix: '.html',
}
```

上面配置可以在 `src/common/config/config.js` 中进行修改。

pathname 过滤时会自动去除左右的 `/`，该逻辑不受上面的配置影响。对 pathname 进行过滤后，拿到干净的 pathname 为 `zh-cn/doc/2.0/route`。

`注`：如果访问的 URL 是 `http://www.thinkjs.org/`，那么最后拿到干净的 pathname 则为空字符串。

### 子域名部署

当项目比较复杂时，可能希望将不同的功能部署在不同的域名下，但代码还是在一个项目下。如：域名 `admin.example.com` 部署后台管理的功能，希望映射到 `admin` 模块下。

ThinkJS 提供了如下的配置可以进行子域名部署，该配置可以在 `config/config.js` 里设置：

```js
export default {
  subdomain: {
    admin: 'admin', //表示将 admin.example.com 映射到 admin 模块下
    ...
  }
}
```

假如过滤后的 pathname 为 `group/detail`，命中了 admin.example.com 这个子域名后，pathname 变为 `admin/group/detail`。

### 路由识别

#### 路由解析

路由识别默认根据 `模块/控制器/操作/参数1/参数1值/参数2/参数2值` 来识别过滤后的 pathname，如：pathname 为 `admin/group/detail`，那么识别后的结果为：

* module 为 `admin`
* controller 为 `group`
* action 为 `detail`，对应的方法名为 `detailAction`

如果项目里并没有 `admin` 这个模块或者这个模块被禁用了，那么识别后的结果为：

* module 为默认模块 `home`
* controller 为 `admin`
* action 为 `group`，对应的方法名为 `groupAction`
* 参数为 `{detail: ''}`

#### 大小写转化

路由识别后，`module`、`controller` 和 `Action` 值都会自动转为小写。如果 Action 值里有 `_`，会作一些转化，如：假设识别后的 Controller 值为 `index`，Action 值为 `user_add`，那么对应的 Action 方法名为 `userAddAction`，但模版名还是 `index_user_add.html`。

### 路由默认值

当解析 pathname 没有对应的值时，此时便使用对应的默认值。其中 module 默认值为 `home`，controller 默认值为 `index`，action 默认值为 `index`。

这些值可以通过下面的配置进行修改，配置文件 `src/common/config/config.js`：

```js
export default {
  default_module: 'home',
  default_controller: 'index', 
  default_action: 'index',
}
```

### 自定义路由

默认的路由虽然看起来清晰明了，解析起来也很简单，但看起来不够简洁。

有时候需要更加简洁的路由，这时候就需要使用自定义路由解析了。如：文章的详细页面，默认路由可能是：`article/detail/id/10`，但我们想要的 URL 是 `article/10` 这种更简洁的方式。


##### 开启配置

开启自定义路由，需要在 `src/common/config/config.js` 开启如下的配置：

```js
export default {
  route_on: true
}
```

##### 路由规则

开启自定义路由后，就可以通过路由规则来定义具体的路由了，路由配置文件为： `src/common/config/route.js`，格式如下：

```js
export default [
  ["规则1", "需要识别成的pathname"],
  ["规则2", {
    get: "get请求下需要识别成的pathname",
    post: "post请求下需要识别成的pathname"
  }]
];
```

`注`：自定义路由每一条规则都是一个数组。（至于为什么不用对象，是因为正则路由下，正则不能作为对象的 key 直接使用）

##### 识别方式

自定义路由的匹配规则为：从前向后逐一匹配，如果命中到了该项规则，则不在向后匹配。

-------

ThinkJS 支持 3 种类型的自定义路由，即：正则路由，规则路由和静态路由。 

#### 正则路由

正则路由是采用正则表示式来定义路由的一种方式，依靠强大的正则表达式，能够定义非常灵活的路由规则。

```js
export default [
  [/^article\/(\d+)$/, "home/article/detail?id=:1"]
];
```

上面的正则会匹配类似 `article/10` 这样的 pathname，识别后新的 pathname 为 `home/article/detail`，并且将捕获到的值赋值给参数 id ，这样在控制器里就可以通过 `this.get` 方法 来获取该值。

```js
export default class extends think.controller.base {
  detailAction(){
    let id = this.get('id');
  }
}
```

如果正则里含有多个子分组，那么可以通过 `:1`，`:2`，`:3` 来获取对应的值。

```js
export default [
  [/^article\/(\d+)$/, {
    get: "home/article/detail?id=:1",
    delete: "home/article/delete?id=:1",
    post: "home/article/save?id=:1"
  }]
];
```


#### 规则路由

规则路由是一种字符串匹配方式，但支持含有一些动态的值。如：

```js
export default [
  ['group/:year/:month', "home/group/list"]
]
```

假如访问的 URL 为 `http://www.example.com/group/2015/10`，那么会命中该项规则，得到的 pathname 为 `home/group/list`，同时会添加 2 个参数 `year` 和 `month`，这2个参数可以在控制器里通过 `this.get` 方法来获取。

```js
export default class extends think.controller.base {
  listAction(){
    let year = this.get('year');
    let month = this.get('month');
  }
}
```

#### 静态路由

静态路由是一种纯字符串的完全匹配方式，写法和识别都很简单，功能也相对要弱很多。

```js
export default [
  ["list", "home/article/list"]
]
```

假如访问的 URL 为 `http://www.example.com/list`，那么替换后的 pathname 为 `home/article/list`。

#### 优化路由性能

上面已经说到，自定义路由是个数组，数组每一项是个具体的路由规则，匹配时是从前向后逐一进行匹配。如果这个路由表比较大的话，可能会有性能问题。

为了避免有性能问题，ThinkJS 提供了一种更加高效的自定义路由方式，按模块来配置路由。使用这种方式，路由配置格式跟上面稍微有所不同。

##### common/config/route.js

使用这种方式后，通用模块里的路由配置不再配置具体的路由规则，而是配置哪些规则命中到哪个模块。如：

```js
export default {
  admin: { 
    reg: /^admin/ //命中 admin 模块的正则
  },
  home: { //默认走 home 模块
    
  }
}
```

##### admin/config/route.js

admin 模块配置 admin 下的具体路由规则。

```js
export default [
  [/^admin\/(?!api).*$/, 'admin/index'],
  [/^admin\/api\/(\w+?)(?:\/([\d,]*))?$/, 'admin/:1?id=:2&resource=:1'],
];
```

------

假设访问的 URL 为 `http://www.example.com/admin/api`，那么解析后的 pathname 为 `admin/api`，匹配 `common` 里的规则时会命中 `admin` 模块，然后再对 `admin` 模块下的路由规则进行逐一匹配。通过这种方式后就可以大大减少路由规则匹配的数量，提供匹配效率。