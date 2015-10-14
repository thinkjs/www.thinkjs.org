## 配置

ThinkJS 提供了灵活的配置，可以在不同模式下使用不同的配置，且这些配置在服务启动时就已经生效，后续逻辑处理中可以直接使用这些配置。

`注意：不可将一个 http 请求中的私有值设置到配置中，这将会被下一个 http 设置的值给冲掉。`

### 项目模式

ThinkJS 默认支持 3 种项目模式，可以根据这 3 种模式设置不同的配置，以满足不同情况下的配置需要。

* `development` 开发模式
* `testing` 测试模式
* `production` 线上模式

项目里也可以扩展其他的模式，当前使用哪种模式可以在 [入口文件](./app_structure.html#wwwindexjs) 中设置，设置 `env` 值即可。

### 定义配置文件

项目里可以设置公共配置文件和模块下的配置文件：

* 公共配置目录 `src/common/config`
* 模块配置目录 `src/[module]/config`

** config/config.js **

存放一些基本的配置，如：

```js
export default {
  port: 8360, 
  host: '',
  encoding: 'utf-8',
  ...
}
```

** config/[name].js **

存放具体功能的配置文件，如：`db.js` 为数据库配置，`redis` 为 redis 配置。

```js
// db.js
export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: '',
  name: '',
  user: '',
  ...
};
```

** config/env/[mode].js **

项目模式的配置，如：`env/development.js`，`env/testing.js`，`env/production.js`

```js
//env/development.js
export default {
  db: { //开发模式下数据库配置
    type: 'mysql',
    host: '127.0.0.1',
    port: '',
    ...
  }
}
```

** config/locale/[lang].js **

国际化语言包配置，如： `locale/en.js`，`locale/zh-CN.js`。

--------

配置格式采用 `key: value` 的形式，并且 `key` 不区分大小写。

### 加载配置文件

框架支持多种级别的配置文件，会按以下顺序进行读取：

框架默认的配置 -> 项目模式下框架配置 -> 项目公共配置 -> 项目模式下的公共配置 -> 模块下的配置。




### 配置读取

** 控制器、中间件等地方配置读取 **

通过 `this.config()` 方法就可以读取相关的配置。

```js
let db = this.config('db'); //读取数据库的所有配置
let host = this.config('db.host'); //读取数据库的 host 配置，等同于 db.host
```

注：最多支持 2 级的配置读取。

** 其他地方配置读取 **

其他地方可以通过 `think.config` 来读取相关的配置：

```js
let db = think.config('db'); //读取通用模块下的数据库配置
let db1 = think.config('db', undefined, 'home'); //获取 home 模块下数据库配置
```


### 系统默认配置

#### env

项目模式下的配置，`config/env/development.js`。

```js
export default {
  auto_reload: true,
  log_request: true,
  gc: {
    on: false
  },
  error: {
    detail: true
  }
}
```

`config/env/testing.js` 和 `config/env/produciton.js` 无默认配置。

#### locale

国际化语言包配置，默认的配置如下：

```js
// config/locale/en.js
export default {
  CONTROLLER_NOT_FOUND: 'controller `%s` not found. url is `%s`.',
  CONTROLLER_INVALID: 'controller `%s` is not valid. url is `%s`',
  ACTION_NOT_FOUND: 'action `%s` not found. url is `%s`',
  ACTION_INVALID: 'action `%s` is not valid. url is `%s`',
  WORKER_DIED: 'worker `%d` died, it will auto restart.',
  MIDDLEWARE_NOT_FOUND: 'middleware `%s` not found',
  ADAPTER_NOT_FOUND: 'adapter `%s` not found',
  GCTYPE_MUST_SET: 'instance must have gcType property',
  CONFIG_NOT_FUNCTION: 'config `%s` is not a function',
  CONFIG_NOT_VALID: 'config `%s` is not valid',
  PATH_EMPTY: '`%s` path muse be set',
  PATH_NOT_EXIST: '`%s` is not exist',
  TEMPLATE_NOT_EXIST: 'can\'t find template file `%s`',
  PARAMS_EMPTY: 'params `%s` value can\'t empty',
  PARAMS_NOT_VALID: 'params `{name}` value not valid',
  FIELD_KEY_NOT_VALID: 'field `%s` in where condition is not valid',
  DATA_EMPTY: 'data can not be empty',
  MISS_WHERE_CONDITION: 'miss where condition',
  INVALID_WHERE_CONDITION_KEY: 'where condition key is not valid',
  WHERE_CONDITION_INVALID: 'where condition `%s`:`%s` is not valid',
  TABLE_NO_COLUMNS: 'table `%s` has no columns',
  NOT_SUPPORT_TRANSACTION: 'table engine is not support transaction',
  DATA_MUST_BE_ARRAY: 'data is not an array list',
  PARAMS_TYPE_INVALID: 'params `{name}` type invalid',
  DISALLOW_PORT: 'proxy on, cannot visit with port',
  SERVICE_UNAVAILABLE: 'Service Unavailable',

  validate_required: '{name} can not be blank',
  validate_contains: '{name} need contains {args}',
  validate_equals: '{name} need match {args}',
  validate_different: '{name} nedd not match {args}',
  validate_after: '{name} need a date that\'s after the {args} (defaults to now)',
  validate_alpha: '{name} need contains only letters (a-zA-Z)',
  validate_alphaDash: '{name} need contains only letters and dashes(a-zA-Z_)',
  validate_alphaNumeric: '{name} need contains only letters and numeric(a-zA-Z0-9)',
  validate_alphaNumericDash: '{name} need contains only letters, numeric and dash(a-zA-Z0-9_)',
  validate_ascii: '{name} need contains ASCII chars only',
  validate_base64: '{name} need a valid base64 encoded',
  validate_before: '{name} need a date that\'s before the {args} (defaults to now)',
  validate_byteLength: '{name} need length (in bytes) falls in {args}',
  validate_creditcard: '{name} need a valid credit card',
  validate_currency: '{name} need a valid currency amount',
  validate_date: '{name} need a date',
  validate_decimal: '{name} need a decimal number',
  validate_divisibleBy: '{name} need a number that\'s divisible by {args}',
  validate_email: '{name} need an email',
  validate_fqdn: '{name} need a fully qualified domain name',
  validate_float: '{name} need a float in {args}',
  validate_fullWidth: '{name} need contains any full-width chars',
  validate_halfWidth: '{name} need contains any half-width chars',
  validate_hexColor: '{name} need a hexadecimal color',
  validate_hex: '{name} need a hexadecimal number',
  validate_ip: '{name} need an IP (version 4 or 6)',
  validate_ip4: '{name} need an IP (version 4)',
  validate_ip6: '{name} need an IP (version 6)',
  validate_isbn: '{name} need an ISBN (version 10 or 13)',
  validate_isin: '{name} need an ISIN (stock/security identifier)',
  validate_iso8601: '{name} need a valid ISO 8601 date',
  validate_in: '{name} need in an array of {args}',
  validate_notIn: '{name} need not in an array of {args}',
  validate_int: '{name} need an integer',
  validate_min: '{name} need an integer greater than {args}',
  validate_max: '{name} need an integer less than {args}',
  validate_length: '{name} need length falls in {args}',
  validate_minLength: '{name} need length is max than {args}',
  validate_maxLength: '{name} need length is min than {args}',
  validate_lowercase: '{name} need is lowercase',
  validate_mobile: '{name} need is a mobile phone number',
  validate_mongoId: '{name} need is a valid hex-encoded representation of a MongoDB ObjectId',
  validate_multibyte: '{name} need contains one or more multibyte chars',
  validate_url: '{name} need an URL',
  validate_uppercase: '{name} need uppercase',
  validate_variableWidth: '{name} need contains a mixture of full and half-width chars',
  validate_order: '{name} need a valid sql order string',
  validate_field: '{name} need a valid sql field string',
  validate_image: '{name} need a valid image file',
  validate_startWith: '{name} need start with {args}',
  validate_endWidth: '{name} need end with {args}',
  validate_string: '{name} need a string',
  validate_array: '{name} need an array',
  validate_boolean: '{name} need a boolean',
  validate_object: '{name} need an object'
}
```

#### config

基本配置，`config/config.js`。

```js
export default {
  port: 8360, //服务监听的端口
  host: '', //服务监听的 host
  encoding: 'utf-8', //项目编码
  pathname_prefix: '',  //pathname 去除的前缀，路由解析中使用
  pathname_suffix: '.html', //pathname 去除的后缀，路由解析中使用
  proxy_on: false, //是否使用 nginx 等 web server 进行代理
  hook_on: true,  //是否开启 hook
  cluster_on: false, //是否开启 cluster

  service_on: true, //Service available
  timeout: 120, //120 seconds
  auto_reload: false, //自动重新加载修改的文件，development 模式下使用

  resource_on: true, // 是否处理静态资源请求， porxy_on 开启下可以关闭该配置
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //静态资源的正则

  route_on: true, //是否开启自定义路由

  log_pid: false, //是否记录服务的 pid
  log_request: false, //是否打印请求的日志
  
  create_server: undefined, //自定义启动服务
  output_content: undefined, //自定义输出内容处理方式，可以进行 gzip 处理等
  deny_module_list: [], //禁用的模块列表
  default_module: 'home', //默认模块
  default_controller: 'index',  //默认的控制器
  default_action: 'index', //默认的 Action
  callback_name: 'callback', //jsonp 请求的 callback 名称
  json_content_type: 'application/json', //json 输出时设置的 Content-Type
  subdomain: {} //子域名部署配置
}
```

#### cache

缓存配置，`config/cache.js`。

```js
export default {
  type: 'file', //缓存方式
  prefix: 'thinkjs_', //缓存名称前缀
  timeout: 6 * 3600, //6 hours
  path: runtimePrefix + '/cache', //文件缓存模式下缓存内容存放的目录
  path_depth: 2, //子目录深度
  file_ext: '.json' //缓存文件的扩展名
};
```

#### cookie

cookie 配置，`config/cookie.js`。

```js
export default {
  domain: '', // cookie domain
  path: '/', // cookie path
  httponly: false, //是否 httponly
  secure: false, //是否在 https 下使用
  timeout: 0 //cookie 有效时间
};
```

#### csrf

#### db

数据库配置，`config/db.js`。

```js
export default {
  type: 'mysql', //数据库类型
  host: '127.0.0.1', //数据库 host
  port: '', //端口
  name: '', //数据库名称
  user: '', //账号
  pwd: '', //密码
  prefix: 'think_', //数据表前缀
  encoding: 'utf8', //数据库编码
  nums_per_page: 10, //一页默认条数
  log_sql: true, //是否记录 sql 语句
  log_connect: true, // 是否记录连接数据库的信息
  cache: { // 查询数据缓存配置
    on: true,
    type: '',
    timeout: 3600
  }
};
```


#### error

错误信息配置，`config/error.js`。

```js
export default {
  key: 'errno', //error number
  msg: 'errmsg', //error message
  value: 1000 //default errno
};
```

#### gc

缓存、Session等垃圾处理配置，`config/gc.js`。

```js
export default {
  on: true, //是否开启垃圾回收处理
  interval: 3600, // 处理时间间隔，默认为一个小时
  filter: function(){ //如果返回 true，则进行垃圾回收处理
    let hour = (new Date()).getHours();
    if(hour === 4){
      return true;
    }
  }
};
```

#### hook

hook 配置，`config/hook.js`。

```js
export default {
  form_parse: ['parse_json_payload'],
  resource_check: ['resource'],
  resource_output: ['output_resource'],
  route_parse: ['rewrite_pathname', 'subdomain_deploy', 'route'],
  app_begin: ['check_csrf', 'read_html_cache'],
  view_init: [],
  view_template: ['locate_template'],
  view_parse: ['parse_template'],
  view_filter: [],
  view_end: ['write_html_cache'],
  app_end: []
};
```

#### html_cache

页面静态化配置，`config/html_cache.js`。

```js
export default {
  on: false,
  type: 'file', //store type
  timeout: 3600, //1 hour
  rules: {},
  callback: undefined,
  file_ext: '.html'
};
```

#### memcache

memcache 配置，`config/memcache.js`。

```js
export default {
  host: '127.0.0.1', //memcache host
  port: 11211,
  username: '', //
  password: '',
  timeout: 0, //缓存失效时间
  log_connect: true
};
```

#### post

post 请求时的配置，`config/post.js`。

```js
export default {
  json_content_type: ['application/json'],
  max_file_size: 1024 * 1024 * 1024, //1G
  max_fields: 100, 
  max_fields_size: 2 * 1024 * 1024, //2M,
  ajax_filename_header: 'x-filename',
  file_upload_path: runtimePrefix + '/upload',
  file_auto_remove: true
};
```

#### redis

redis 配置，`config/redis.js`。

```js
export default {
  host: '127.0.0.1',
  port: 6379,
  password: '',
  timeout: 0,
  log_connect: true
};
```

#### session

session 配置，`config/session.js`。

```js
export default {
  name: 'thinkjs',
  type: 'file',
  path: runtimePrefix + '/session',
  secret: '',
  auth_key: 'think_auth_list',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32
  }
};
```

#### view

视图配置，`config/view.js`。

```js
export default {
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '_',
  root_path: '',
  type: 'ejs',
  options: {}
};
```

#### websocket

websocket 配置，`config/websocket.js`。

```js
export default {
  on: false, //是否开启 websocket
  type: 'think', //websocket 使用的库
  allow_origin: '',
  sub_protocal: '',
  adapter: undefined,
  path: '', //url path for websocket
  messages: {
    // open: 'home/websocket/open',
  }
};
```
