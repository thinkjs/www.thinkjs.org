## Configuration

ThinkJS provides a flexible configuration mechanism, it can use different configuration in different modules and project environments, and these configurations will take effective after service started.

`Note: Do not set the private value of an http request in the configuration, because other http setting may overriding these values.`

### The Project Module

The projects that created default by ThinkJS are divided according to the module, you can define different configuration under each module. General configuration can be defined under `common` modules, other modules will inherit the `common` configuration.

### Project Environment

ThinkJS default support three kinds of project environments, it can be configured according to the different environment, in order to meet the needs of the different situations of configuration.

* `development` development
* `testing` testing
* `production` production

It can also be extended to other environment in project, which kind of environment to use at present can be set in the [entrance file](./app_structure.html#toc-f0b), and set the `env` value.

### Defining Configuration Files

##### config/config.js

For some basic configuration, such as:

```js
export default {
  port: 8360, 
  host: '',
  encoding: 'utf-8',
  ...
}
```

##### config/[name].js

For a specific independent function configuration, such as `db.js` is the database configuration, `redis` is redis configuration.

```js
// db.js
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: '127.0.0.1', // database host
      port: '', // datagbase port
      database: '', // database name
      user: '', // user name
      ...
    }
  }
};
```

##### config/env/[mode].js

Differentiation configuration in different project environment, such as `env/development.js`,`env/testing.js`,`env/production.js`.

```js
// config/env/development.js
export default {
  port: 7777,
  db: { 
    type: 'mysql',
    adapter: {
      mysql: {
        host: '127.0.0.1',
        port: '',
        database: '',
        user: '',
        ...
      }
    }
  }
}
```

`Note`: The differences of different environments generally is not too much, so we defined them in a single file. At this time, if you want to modify an independent function configuration, you need to add a key corresponding to the independent function. Such as you need to add the the name of the `db` corresponding to the database when modifing the database configuration, as shown above.

##### config/locale/[lang].js

International language pack configuration, such as `locale/en.js`,`locale/zh-cn.js`.

--------

Configuration format uses the form of `key: value`, and the `key` is case-insensitive.

### Loading Configuration Files

ThinkJS supports multiple levels of the configuration file, it reads in the following order:

`default configuration of the framework - > framework configuration under project mode - > project common configuration - > common configuration under project mode - > module configuration`

### Reading Configuration

#### Using config

In Controller, Logic, Middleware, you can using `this.config`. Such as:

```js
let db = this.config('db'); // reading all of the configurations about db
let host = this.config('db.host'); // reading the host configuration about the host of db
```

#### Using http.config

`http` objects also have the `config` method used for obtain the relevant configuration, such as:

```js
let db = http.config('db');
```

#### Reading Configuration From Other Places

In other places, we can read the relevant configuration through `think.config`:

```js
let db = think.config('db'); // reading the configuration about db under the common configuration
let db1 = think.config('db', undefined, 'home'); // get the da configuration under the home module
```

`Note`: Before parsing route, we can not get the general module configuration through the `config` method or `http.config` method, so the configuration which is used before route parsing must be defined in the general module.

### The Default Configuration

#### env

Project configuration mode, the `config/env/development.js`.

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

The `config/env/testing.js` and `config/env/produciton.js` have no default configuration.

#### locale

International language pack configuration, the default configuration is as follows:

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

The basic configuration, `config/config.js`.

```js
export default {
  port: 8360, // the port server is listening
  host: '', // host
  encoding: 'utf-8', // encoding
  pathname_prefix: '',  // the prefix that will be remove when parsing routers
  pathname_suffix: '.html', // the suffix that will be remove when parsing routers

  hook_on: true,  // turns hook on
  cluster_on: false, //turns cluster on

  timeout: 120, //120 seconds
  auto_reload: false, //auto reload the changed files

  resource_on: true, // turns resource on
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //

  route_on: true, //turns routing on

  log_error: true, //log error
  log_request: false, //log http request
  
  create_server: undefined, //create server
  output_content: undefined, //output content function
  deny_module_list: [], //deny module list
  default_module: 'home', //default module
  default_controller: 'index',  //default controller
  default_action: 'index', //default action
  callback_name: 'callback', //callback name for JSONP request
  json_content_type: 'application/json', //content-type for output json data
}
```

#### cache

Cache configuration,`config/cache.js`.

```js
export default {
  type: 'file', //cache type
  timeout: 6 * 3600,
  adapter: {
    file: {
      path: think.RUNTIME_PATH + '/cache', // the folder to store the caching content in file caching type
      path_depth: 2, // the levels of subfolders
      file_ext: '.json' // the suffix of the caching files
    },
    redis: {
      prefix: 'thinkjs_', //cache key prefix
    }
  }
};
```

#### cookie

Cookie configuration,`config/cookie.js`.

```js
export default {
  domain: '', // cookie domain
  path: '/', // cookie path
  httponly: false, //httponly
  secure: false, //secure
  timeout: 0 //cookie time
};
```

#### db

Database configuration,`config/db.js`.

```js
export default {
  type: 'mysql', //database type
  log_sql: true, //log sql
  log_connect: true, // log database connection
  adapter: {
    mysql: {
      host: '127.0.0.1', //database host
      port: '', //database port
      database: '', //database name
      user: '', //database account
      password: '', //database account password
      prefix: 'think_', //table prefix
      encoding: 'utf8', //table encoding
      nums_per_page: 10, //nums per page
    }
  }
};
```


#### error

The error information configuration,`config/error.js`.

```js
export default {
  key: 'errno', //error number
  msg: 'errmsg', //error message
  value: 1000 //default errno
};
```

#### gc

The cache, the session, and garbage disposal configuration,`config/gc.js`.

```js
export default {
  on: true, //turn on gc
  interval: 3600, // gc interval
  filter: function(){ //
    let hour = (new Date()).getHours();
    if(hour === 4){
      return true;
    }
  }
};
```

#### hook

Hook configuration,`config/hook.js`.

```js
export default {
  request_begin: [],
  payload_parse: ['parse_form_payload', 'parse_single_file_payload', 'parse_json_payload', 'parse_querystring_payload'],
  payload_validate: ['validate_payload'],
  resource: ['check_resource', 'output_resource'],
  route_parse: ['rewrite_pathname', 'parse_route'],
  logic_before: [],
  logic_after: [],
  controller_before: [],
  controller_after: [],
  view_before: [],
  view_template: ['locate_template'],
  view_parse: ['parse_template'],
  view_filter: [],
  view_after: [],
  response_end: []
};
```


#### post

The post request configuration, `config/post.js`.

```js
export default {
  json_content_type: ['application/json'],
  max_file_size: 1024 * 1024 * 1024, //1G
  max_fields: 100, 
  max_fields_size: 2 * 1024 * 1024, //2M,
  ajax_filename_header: 'x-filename',
  file_upload_path: think.RUNTIME_PATH + '/upload',
  file_auto_remove: true
};
```

#### redis

redis configuration,`config/redis.js`.

```js
export default {
  host: '127.0.0.1',
  port: 6379,
  password: '',
  timeout: 0,
  log_connect: true
};
```

#### memcache

memcache configuration,`config/memcache.js`.

```js
export default {
  host: '127.0.0.1', //memcache host
  port: 11211,
  username: '', //
  password: '',
  timeout: 0, //cache timeout
  log_connect: true
};
```


#### session

Session configuration,`config/session.js`.

```js
export default {
  name: 'thinkjs',
  type: 'file', // caching type
  path: think.RUNTIME_PATH + '/session',
  secret: '',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32
  }
};
```

#### view

View configuration,`config/view.js`.

```js
export default {
  type: 'ejs',
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '_',
  root_path: '',
  adapter: {
    ejs: {

    }
  }
};
```

#### websocket

Websocket configuration,`config/websocket.js`.

```js
export default {
  on: false, //use websocket
  type: 'socket.io', //websocket type
  allow_origin: '',
  sub_protocal: '',
  adapter: undefined,
  path: '', //url path for websocket
  messages: {
    // open: 'home/websocket/open',
  }
};
```


### The Extension Configuration

Projects configuration can be extended according to the need, extending configuration only need to set up the correspondding files in `src/common/config/`, such as:

```js
// src/common/config/foo.js
export default {
  name: 'bar'
}
```

So you can obtain the corresponding configuration through `think.config('foo')`.
