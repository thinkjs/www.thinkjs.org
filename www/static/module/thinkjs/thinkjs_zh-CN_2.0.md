# ThinkJS 2.0 Documentation

# 快速入门

## 介绍

ThinkJS 是一款使用 ES6/7 特性全新开发的 Node.js MVC 框架。该框架使用 ES7 中`async`和`await`，或者 ES6 中的`Generator Function`彻底解决了 Node.js 中异步嵌套的问题。同时吸收了国内外众多框架的设计理念和思想，让开发 Node.js 项目更加简单、高效。

使用 ES6/7 特性来开发项目可以大大提高开发效率，是趋势所在。并且新版的 Node.js 对 ES6 特性也有了较好的支持，即使有些特性还没有支持，也可以借助 [Babel](http://babeljs.io/) 编译工具来支持。


### 特性

#### 使用ES6/7特性来开发项目

在 ThinkJS 中，可以使用 ES6 里的`class`和`Generator Function`等特性，甚至可以使用ES7里的`async`和`await`等特性来开发项目。虽然最新的 Node.js还不能全部支持这些特性，但可以借助 [Babel](http://babeljs.io/) 对代码进行编译，让其稳定运行在 Node.js 的环境中。

```js
//user controller, home/controller/user.js
export default class extends think.controller.base {
  //login action
  async loginAction(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    let data = this.post();
    let md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    let result = await this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    await this.session('userInfo', result);
    return this.success();
  }
}
```

上面的代码我们使用了 ES6 里的`class`, `export`, `let`以及 ES7 里的`async`和`await`等特性，虽然查询数据库和写入`Session`都是异步操作，但借助`await`，代码都是同步书写的。最后使用`Babel`进行编译，就可以稳定运行在 Node.js 的环境中了。

如果不想使用 Babel 编译，但 Node.js 环境支持`Generator Function`，那么可以使用`yield`和`*`。

```js
//user controller, home/controller/user.js
module.exports = think.controller({
  //login action
  loginAction: function *(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    var data = this.post();
    var md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    var result = yield this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    yield this.session('userInfo', result);
    return this.success();
  }
})
```

#### 支持丰富的数据库

ThinkJS 支持`mysql`, `mongodb`, `sqlite`等常见的数据库，并且封装了很多操作数据库的接口，自动防止 Sql 注入等安全漏洞。

#### 代码自动更新

ThinkJS 内置了一套代码自动更新的机制，文件修改后立即生效，不用重启 Node.js 服务，也不用借助第三方模块。

#### 自动创建Rest接口

使用`thinkjs`命令可以自动创建 Rest 接口，不用写任何的代码即可运行。如果想在 Rest 接口中过滤字段或者进行权限校验，也很方便处理。

#### 支持多种websocket库

ThinkJS 支持`socket.io`，`sockjs`等常见的`websocket`库，并且对这些库进行包装，抹平各个库之间接口调用上的差异，给开发者一致的体验。

#### 丰富的测试用例

ThinkJS 含有 1500+ 的测试用例，代码覆盖率达到 95% ，每一次修改都有对应的测试用例来保障框架功能的稳定。

#### 支持命令行调用执行定时任务

ThinkJS 里的`Action`除了可以响应用户的请求，同时支持在命令行下访问。借助这套机制就可以很方便的执行定时任务。

#### Hook和Middleware

ThinkJS 使用 Hook 和 Middleware 机制，内置了大量的功能，同时也很方便进行扩展。

#### 详细的日志

ThinkJS 内置了详细的日志功能，可以很方便的查看各种日志，方便追查问题。

** HTTP 请求日志 **
```
[2015-10-12 14:10:03] [HTTP] GET /favicon.ico 200 5ms
[2015-10-12 14:10:11] [HTTP] GET /zh-CN/doc.html 200 11ms
[2015-10-12 14:10:11] [HTTP] GET /static/css/reset.css 200 3ms
```

** Socket 连接日志 **

```
[2015-10-12 14:13:54] [SOCKET] Connect mysql with mysql://root:root@127.0.0.1:3306
```

** 错误日志 **

```
[2015-10-12 14:15:32] [Error] Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root3'@'localhost' (using password: YES)

[2015-10-12 14:16:12] [Error] Error: Address already in use, port:8360. http://www.thinkjs.org/doc/error.html#EADDRINUSE
```

#### 支持国际化和多主题

ThinkJS 使用很简单的方法就可以支持国际化和多主题等功能。


### ES6/7 参考文档

关于 ES6/7 特性可以参考下面的文档：

* [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
* [ECMAScript 6 Features](https://github.com/lukehoban/es6features)
* [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)
* [ECMAScript 7 Features](https://github.com/hemanth/es7-features)
* [ECMAScript 7 compatibility table](http://kangax.github.io/compat-table/es7/)



## 创建项目

### 安装 Node.js

ThinkJS 是一款 Node.js 的 MVC 框架，所以安装 ThinkJS 之前，需要先安装 Node.js 环境。可以去 [官方](https://nodejs.org/) 下载最新的安装包进行安装，也可以通过 [taobao](http://npm.taobao.org/mirrors/node) 的镜像下载安装。

安装完成后，在命令行执行`node -v`，如果能看到对应的版本号输出，则表示安装成功。

ThinkJS 需要 Node.js 的版本 `>=0.12.0`，如果版本小于这个版本，需要升级 Node.js，否则无法启动服务。

### 安装 ThinkJS

ThinkJS 现在还没有正式发布 2.0 版本，所以无法通过`npm`命令来安装，需要从 github 里拉取最新的代码，然后编译。具体如下：

```
cd foo/bar/node_modules; //进入对应的node_modules目录
git clone git@github.com:75team/thinkjs.git
cd thinkjs;
git checkout es6;//切换到es6分支
npm install; //安装依赖
```

通过`npm install`安装依赖的时候，如果安装很慢的话，可以尝试使用 [taobao](http://npm.taobao.org/) 的源进行安装。具体如下：

```
npm install --registry=https://registry.npm.taobao.org --verbose
```

### 创建项目

ThinkJS 安装完成后，可以使用对应的命令来创建项目，命令文件在`foo/bar/node_modules/thinkjs/bin/index.js`。

可以通过下面的命令创建项目:

```
//project_path为项目存放的目录
node foo/bar/node_modules/thinkjs/bin/index.js new project_path;
```

如果想用`ES6`特性来开发项目的话，可以创建一个`ES6`模式的项目，具体如下：

```
//project_path为项目存放的目录
node foo/bar/node_modules/thinkjs/bin/index.js new project_path --es6;
```

如果能看见类似下面的输出，表示项目创建成功了：

```
  create : demo/
  create : demo/package.json
  create : demo/.thinkjsrc
  create : demo/nginx.conf
  create : demo/README.md
  create : demo/www/
  create : demo/www/index.js
  create : demo/app
  create : demo/app/common/runtime
  create : demo/app/common/config
  create : demo/app/common/config/config.js
  create : demo/app/common/config/view.js
  create : demo/app/common/config/db.js
  ...
  create : demo/app/home/logic
  create : demo/app/home/logic/index.js
  create : demo/app/home/view
  create : demo/app/home/view/index_index.html

  enter path:
  $ cd demo/

  install dependencies:
  $ npm install

  run the app:
  $ npm start
```

关于创建项目命令的更多信息，请见[这里](./thinkjs_command.html)。

### 安装依赖

进入到项目目录下，执行`npm install`安装依赖。如果执行很慢，可以尝试使用`taobao`的源进行安装。

```
npm install --registry=https://registry.npm.taobao.org --verbose
```

### 启动项目

如果是使用 ES6 语法创建项目，那么需要先在一个标签页里执行 `npm run watch-compile`。

在项目目录下执行`npm start`，如果能看到类似下面的内容，则服务启动成功。

```
[2015-09-21 20:21:09] [THINK] Server running at http://127.0.0.1:8360/
[2015-09-21 20:21:09] [THINK] ThinkJS Version: 2.0.0
[2015-09-21 20:21:09] [THINK] Cluster Status: closed
[2015-09-21 20:21:09] [THINK] WebSocket Status: closed
[2015-09-21 20:21:09] [THINK] File Auto Reload: true
[2015-09-21 20:21:09] [THINK] App Enviroment: development
```

### 访问项目

打开浏览器，访问`http://127.0.0.1:8360/`即可。

## 项目结构

通过 thinkjs 命令创建完项目后，项目目录结构类似如下：

```
   |-- nginx.conf  
   |-- package.json
   |-- src  
   |   |-- common  
   |   |   |-- bootstrap 
   |   |   |   |-- generate_icon.js
   |   |   |   `-- middleware.js
   |   |   |-- config  
   |   |   |   |-- config.js
   |   |   |   |-- env  
   |   |   |   |   |-- development.js
   |   |   |   |   `-- production.js
   |   |   |   |-- hook.js 
   |   |   |   |-- locale 
   |   |   |   |   |-- en.js
   |   |   |   |   `-- zh-CN.js
   |   |   |   `-- route.js 
   |   |   |-- controller 
   |   |   |    `-- error.js
   |   |   `-- runtime
   |   `-- home   
   |       |-- config
   |       |-- controller
   |       |   |-- base.js
   |       |   `-- index.js
   |       |-- logic
   |       |   `-- doc.js
   |       `-- model
   |-- view
   |   `-- zh-CN
   |       |-- common
   |       |   |-- error_400.html
   |       |   |-- error_403.html
   |       |   |-- error_404.html
   |       |   |-- error_500.html
   |       |   `-- error_503.html
   |       `-- home
   |           |-- doc_index.html
   |           |-- doc_search.html
   |           |-- inc
   |           |   |-- footer.html
   |           |   `-- header.html
   |           |-- index_changelog.html
   |           |-- index_demo.html
   |           `-- index_index.html
   `-- www
       |-- favicon.ico
       |-- index.js
       |-- production.js
       `-- static
           |-- css
           |-- img
           `-- js
```

`注：` 指定不同的模式创建的项目目录机构可能有细微的差别，但总体是类似的。

### nginx.conf

webserver nginx 的配置文件，建议线上使用 nginx 做一层代理。

### src

源代码目录，使用 ES6 特性创建项目才有该目录。需要通过 `npm run watch-compile` 命令编译该目录下的文件到 `app/` 目录。

如果没有使用 ES6 特性创建项目，则直接有 `app/` 目录。

### src/common

通用模块目录，项目目录都是按模块来划分的，`common` 模块下存放一些通用的处理逻辑。

### src/common/bootstrap

项目启动目录，该目录下的文件会自动加载，无需手动 `require` 。

可以在这个目录下文件里定义一些全局函数、注册中间件等常用的功能。

** 定义全局函数 **

```js
// src/common/bootstrap/fn.js
global.formatDate = obj => {
  ...
}
```

这里定义了一个全局函数 `formatData`，那么项目里任何地方都可以直接使用该函数。

** 注册中间件 **

```js
// src/common/bootstrap/middleware.js
think.middleware('replace_image', http => {
  ...
});
```

这里定义了一个中间件 `replace_image`，那么就可以在配置文件 `hook.js` 里将该中间件注册进去了。

`注：`bootstrap 只能放在 common 模块里。

### src/common/config

配置文件，这里放一些通用的配置。

其中：路由配置、Hook配置、本地化配置等必须放在这里。

```js
'use strict';
/**
 * config
 */
export default {
  //key: value
};
```

### src/common/controller

控制器，放一些通用的控制器。其中 `error.js` 里错误处理的不同行为，项目里可以根据需要进行修改。

### src/common/runtime

项目运行时生成的一些目录，如：缓存文件目录，用户上传的文件临时存放的目录。

### src/home

`home` 模块，项目默认模块。可以在 `src/common/config/config.js` 中修改配置 `default_module` 来重新定义默认模块。

### src/home/logic

逻辑处理。每个操作执行前可以先进行逻辑校验，可以包含：参数是否合法、提交的数据是否正常、当前用户是否已经登录、当前用户是否有权限等。这样可以降低 `controller` 里的 `action` 的复杂度。

```js
'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  indexAction(){
   
  }
}
```

### src/home/controller

控制器。一个 `url` 对应一个 `controller` 下的 `action`。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
}
```

### src/home/model

模型。数据库相关操作。

### view

视图目录，存放对应的模版文件。如果支持国际化和多主题，那么视图目录下需要有对应的子目录。

### www

项目的可访问根目录，nginx 里的根目录会配置到此目录下。

### www/index.js

开发模式下项目的入口文件，可以根据项目需要进行修改。`www/production.js` 为线上的入口文件。

入口文件的代码类似如下，可以根据项目需要进行修改。

```js
var thinkjs = require('thinkjs');
var path = require('path');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'development'
});

instance.run();
```

### www/static

存放一些静态资源文件。

## 代码规范

### 文件路径必须小写

项目开发时，很多时候是在 `Windows` 或者 `Mac` 系统下，但项目上线时，一般是运行在 `Linux` 系统下。

但在 `Windows` 和 `Mac` 系统下，文件路径是不区分大小写的，而 `Linux` 下是区分大小写的。这样容易导致开发环境下运行是好的，但上线后却报错了。

为了避免这种情况的发生，文件路径尽量都使用小写字符。并且在服务启动时，ThinkJS 会检测项目下文件路径，如果有大写字母则会告警，如：

```
[2015-10-13 10:36:59] [WARNING] filepath `admin/controller/apiBase.js` has uppercase chars.
```

### 缩进使用 2 个空格

在 Node.js 环境下开发，有时候逻辑比较复杂，有各种条件判断，或者有一些异步操作，这些都会增加代码的缩进。

为了不至于让缩进占用了太多的列宽，建议使用 2 个空格作为缩进。

### 使用 ES6 语法开发

ES6 中有大量的语法糖可以简化我们的代码，让代码更加简洁高效。
Node.js 最新版本已经较好的支持了 ES6 的语法，即使有些语法不支持，也可以通过 Babel 编译来支持。 所以是时候使用 ES6 语法来开发项目了。

### 不要使用 constrcutor 方法

使用 ES6 里的 class 来创建类的时候，可以使用 `constrcutor` 方法达到类实例化的时候自动调用。如：

```js
export default class think.base {
  constructor(){
    ...
  }
}
```

但如果不使用 ES6 里的 class，就没有 constrcutor 方法了。

为了统一处理，ThinkJS 提供了 `init` 方法来代替 `constrcutor` 方法，该方法不管是在 class 下还是动态创建类的情况下都可以做到类实例化的时候自动被调用。

```js
export default class think.base {
  /**
   * 初始化方法，类实例化时自动被调用
   * @return {} []
   */
  init(){
    ...
  }
}
```

`注：` ThinkJS 里所有的类都会继承 `think.base` 基类。

# 进阶应用

## 模块

ThinkJS 创建项目时支持多种项目模式，默认创建的项目是按模块来划分的，并且自动添加了 `common` 和 `home` 2 个模块。每个模块有独立的配置、控制器、视图、模型等文件。

### 模块列表

进去 `src/` 目录就可以看到模块列表：

```
drwxr-xr-x   5 welefen  staff  170 Aug 18 15:55 common/
drwxr-xr-x   6 welefen  staff  204 Sep  8 19:14 home/
```

### common 模块

common 模块是个通用模块，该模块下存放一些通用的功能，如： 通用的配置，runtime目录，启动文件，错误处理控制器等。

`注：` 该模块下的控制器不能响应用户的请求。

### 默认模块

默认模块为 `home` 模块。当解析用户的请求找不到模块时会自动对应到 `home` 下。

可以通过配置 `default_module` 来修改默认模块，修改配置文件 `src/common/config/config.js`：

```js
//将默认模块名改为 blog
export default {
    default_module: 'blog'
}
```

### 添加模块

添加模块直接通过 `thinkjs` 命令即可完成。

在当前项目目录下，执行 `thinkjs module xxx`，即可创建名为 `xxx` 的模块。

如果模块名已经存在，则无法创建。

### 禁用模块

ThinkJS 默认会自动查找和识别项目下的模块，并认为所有的模块都是可用的。

如果想禁用部分模块，可以修改配置文件 `src/common/config/config.js`，添加下面的配置：

```js
export default {
    deny_module_list: ['xxx'] //禁用 xxx 模块
}
```


## 控制器

控制器是一类操作的集合，用来响应用户同一类的请求。

### 定义控制器

创建文件 `src/home/controller/article.js`，表示 `home` 模块下有名为 `article` 控制器，文件内容类似如下：

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
}
```

如果不想使用 ES6 语法，那么文件内容类似如下：

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function(self){
    //auto render template file index_index.html
    return self.display();
  }
});
```

注：上面的 `Base` 表示定义一个基类，其他的类都继承该基类，这样就可以在基类里做一些通用的处理。

### 使用 Generator Function

控制器里可以很方便的使用 Generator Function 来处理异步嵌套的问题。

** ES6 方式 **

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  * indexAction(){
    let model = this.model('user');
    let data = yield model.select();
    return this.success(data);
  }
}
```

** 动态创建类的方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function *(){
    var model = this.model('user');
    var data = yield model.select();
    return this.success(data);
  }
});
```

### 使用 async 和 await

借助 Babel 编译，还是在控制器里使用 async 和 await。

** ES6 方式 **

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let model = this.model('user');
    let data = await model.select();
    return this.success(data);
  }
}
```

** 动态创建类的方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: async function(){
    var model = this.model('user');
    var data = await model.select();
    return this.success(data);
  }
});
```

### init 方法

ES6 里的 class 有 contructor 方法，但动态创建的类就没有该方法了，为了统一初始化执行的方法，将该方法统一定义为 `init`。

该方法在类实例化的时候自动调用，无需手工调用。

** ES6 方式**
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  init(http){
    super.init(http); //调用父类的init方法  
    ...
  }
}
```

** 动态创建类方式 **

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  init: function(http){
    this.super('init', http); //调用父类的init方法
    ...
  }
});
```

`init` 方法里需要调用父类的 init 方法，并将参数 `http` 传递进去。


### 前置操作 __before

ThinkJS 支持前置操作，方法名为 `__before`，该方法会在具体的 Action 调用之前自动调用。如果前置操作里阻止了后续代码继续执行，则不会调用具体的 Action，这样可以提前结束请求。

** ES6 方式**
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * 前置方法
   * @return {Promise} []
   */
  __before(){
    ...
  }
}
```


### Action

一个 Action 代表一个要执行的操作。如： url 为 `/home/article/detail`，解析后的模块为 `/home`，控制器为 `article`， Action 为 `detail`，那么执行的 Action 就是文件 `src/home/controller/aritcle` 里的 `detailAction` 方法。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * 获取详细信息
   * @return {Promise} []
   */
  detailAction(self){
    ...
  }
}
```

### 后置操作 __after

ThinkJS 支持后置操作，方法名为 `__after`，该方法会在具体的 Action 调用之后执行。如果具体的 Action 里阻止了后续的代码继续执行，则后置操作不会调用。

### 空操作 __call

当解析后的 url 对应的控制器存在，但 Action 不存在时，会试图调用控制器下的魔术方法 `__call`。这里可以对不存在的方法进行统一处理。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * @return {Promise} []
   */
  __call(){
    ...
  }
}
```

### 错误处理

当 url 不存在或者当前用户没权限等一些异常请求时，这时候会调用错误处理。 ThinkJS 内置了一套详细的错误处理机制，具体请见 [这里](./error_handle.html)。

### 数据校验和权限判断

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作。当参数校验完成后，有时候还要进行权限判断，等这些都判断无误后才能进行真正的逻辑处理。

如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

如果 Logic 里没有对应的 Action，则不调用，详细信息请见 [这里](./validation.html)。


### 变量赋值和模版渲染

控制器里可以通过 `assign` 和 `display` 方法进行变量赋值和模版渲染，具体信息请见 [这里](./view.html)。

### 模型实例化

在控制器中可以通过 `this.model` 方法快速获得一个模型的实例。

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model('user'); //实例化模型 user
    ...
  }
}
```

### http 对象

控制器在实例化时，会将 `http` 传递进去。该 `http` 对象是 ThinkJS 对 `req` 和 `res` 重新包装的一个对象，而非 Node.js 内置的 http 对象。

Action 里如果想获取该对象，可以通过 `this.http` 来获取。

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  indexAction(){
    let http = this.http;
  }
}
```

关于 `http` 对象包含的属性和方法请见 [这里](./api_http.html)。

### Rest Api

有时候，项目里需要提供一些 Rest 接口给第三方使用，这些接口无外乎就是增删改查等操作。

如果手工去书写这些操作则比较麻烦，ThinkJS 提供了 Rest Controller，该控制器会自动含有通用的增删改查等操作。如果这些操作不满足需求，也可以进行定制。具体请见 [这里](./rest_api.html)。

### this 作用域的问题

Node.js 里经常有很多异步操作，而异步操作常见的处理方式是使用回调函数或者 Promise。这些处理方式都会增加一层作用域，导致在回调函数内无法直接使用 `this`，简单的处理办法是在顶部定义一个变量，将 `this` 赋值给这个变量，然后在回调函数内使用这个变量。如：

```js
module.exports = think.controller({
  indexAction: function(){
    var self = this; //这里将 this 赋值给变量 self，然后在后面的回调函数里都使用 self
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```

如果每个 Action 里都要使用者手工写一个 `var self = this`，势必比较麻烦。为了解决这个问题，ThinkJS 在 Action 里直接提供了一个参数，这个参数等同于 `var self = this`，具体如下：

```js
module.exports = think.controller({
  //参数 self 等同于 var self = this
  indexAction: function(self){
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```

当然更好的解决办法是推荐使用 ES6 里的 Generator Function 和 Arrows Function，这样就可以彻底解决 this 作用域的问题。

** 使用 Generator Function **
```js
export default class extends think.controller.base {
  * indexAction(){
    let data = yield this.model('user').find();
    let result = yield this.model('article').where({user_id: data.id}).select();
    this.success(result);
  }
}
```


** 使用 Arrows Function **

```js
module.exports = think.controller({
  //参数 self 等同于 var self = this
  indexAction: function(){
    this.model('user').find().then(data => {
      return this.model('article').where({user_id: data.id}).select();
    }).then(data => {
      this.success(data);
    })
  }
})
```

### 常用方法

* `get(key)` 获取 get 参数值
* `post(key)` 获取 post 参数值
* `file(key)` 获取 file 参数值
* `isGet()` 当前是否是 get 请求
* `isPost()` 当前是否是 post 请求
* `isAjax()` 是否是 ajax 请求
* `ip()` 获取请求用户的 ip
* `redirect(url)` 跳转到一个 url，返回一个 pedding promise 阻止后面的逻辑继续执行
* `echo(data)` 输出数据，会自动调用 JSON.stringify
* `end(data)` 结束当前的 http 请求
* `json(data)` 输出 json 数据，自动发送 json 相关的 Content-Type
* `jsonp(data)` 输出 jsonp 数据，请求参数名默认为 `callback`
* `success(data)` 输出一个正常的 json 数据，数据格式为 `{errno: 0, errmsg: "", data: data}`，返回一个 pedding promise 阻止后续继续执行
* `fail(errno, errmsg, data)` 输出一个错误的 json 数据，数据格式为 `{errno: errno_value, errmsg: string, data: data}`，返回一个 pedding promise 阻止后续继续执行
* `download(file)` 下载文件
* `assign(name, value)` 设置模版变量
* `display()` 输出一个模版，返回一个 promise
* `fetch()` 渲染模版并获取内容，返回一个 prmose，内容需要在 promise then 里获取
* `cookie(name, value)` 获取或者设置 cookie
* `session(name, value)` 获取或者设置 session
* `header(name, value)` 获取或者设置 header
* `action(name, data)` 调用其他 Controller 的方法，可以跨分组
* `model(name, options)` 获取模型实例

更多方法请见 [这里](./api_controller.html)。




## 视图

视图即模版，默认的根目录为 `view/`。

### 视图文件

视图文件默认的规则为 `模块/控制器_操作.html`。

假如 url `home/article/detail` 解析后的模块是 `home`，控制器是 `article`，操作是 `detail`，那么对应的视图文件为 `home/article_detail.html`。

### 视图配置

视图默认配置为：

```js
export default {
  content_type: 'text/html', //输出模版时发送的 Content-Type
  file_ext: '.html', //文件的扩展名
  file_depr: '_', //控制器和操作之间的连接符
  root_path: think.ROOT_PATH + '/view', //视图文件的根目录
  type: 'ejs', //模版引擎
  options: {} //模版引擎需要的配置项
};
```

### 模版引擎

ThinkJS 默认支持的模版引擎有：`ejs`，`jade` 和 `swig`，默认模版引擎为 `ejs`，可以根据需要修改为其他的模版引擎。

#### ejs 

** 定界符 **

ejs 默认的定界符是 `<%` 和 `%>`。如果想修改定界符，可以通过配置里的 `options` 来修改，如：

```js
export default {
  options: {
    delimiter: '&' //将定界符修改为 <& 和 &>
  }
}
```

** 变量输出 **

* 转义输出 `<%= data.name%>`
* 不转义输出 `<%- data.name%>`
* 注释 `<%# data.name%>`

** 条件判断 **

```text
<%if(data.name === '1'){%>
    <p>...</p>
<%}else if(data.name === '2'){%>
    <p>...</p>
<%}else{%>
    <p>...</p>
<%}%>
```

** 循环 **

```text
<%list.forEach(function(item)){%>
    <li><%=item.name%></li>
<%}%>
```

** 引用文件 **

ejs 不支持模版继承。但可以将公用的模版独立成一个文件，然后通过 `include` 来引入。

```text
<%include inc/header.html%>
```

`注：` ejs 模版使用的变量需要在控制器中赋值，否则会报错。

更多 ejs 使用文档请见 [这里](https://www.npmjs.com/package/ejs)。

#### jade

jade 模版使用方式请见 [这里](https://github.com/jadejs/jade)。

#### swig

swig 模版使用方式请见 [这里](http://paularmstrong.github.io/swig/)。

#### 扩展模版引擎

模版引擎使用 Adapter 实现。如果项目里需要使用其他模版引擎，可以通过 Adapter 进行扩展，具体请见 [这里](./adapter_template.html)。

### 变量赋值

控制器中可以通过 `assign` 方法进行变量赋值。

** 赋值单个变量 **

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
  }
}
```

** 赋值多个变量 **

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign({
      title: 'ThinkJS 官网',
      author: 'thinkjs'
    });
  }
}
```

** 获取赋值 **

变量赋值后也可以通过 `assign` 来获取赋过的值。如：

```js
export default class extends think.controlle.base {
  indexAction(){
    this.assign('title', 'ThinkJS 官网');
    let title = this.assign('title');
  }
}
```

### 模版渲染

可以通过 `display` 方法进行模版渲染。如果不传具体的模版文件路径，会自动查找。如：

```js
export default class extends think.controller.base {
  indexAction(){
    this.display();// render home/index_index.html
  }
}
```

也可以指定具体的模版文件进行渲染，关于 `display` 方法的详细使用请见 [这里](./api_controller.html#controllerdisplaytemplatefile)。

### 获取渲染后的内容

如果有时候不想支持输出模版，而是想获取渲染后的模版内容，那么可以通过 `fetch` 方法来获取。

** ES6 方式 **

```js
export default class extends think.controller.base {
  * indexAction(){
    let content = yield this.fetch();
    ...
  }
}
```

** 动态创建类的方式 **

```js
module.exports = think.controller({
  indexAction: function(){
    this.fetch().then(function(content){
      ...
    })
  }
})
```

关于 `fetch` 方法的详细使用方式请见 [这里](api_controller.html#controllerfetchtemplatefile)。

### 国际化

启动国际化后，视图路径会多一层国际化的目录。如：具体的视图路径变为 `view/zh-CN/home/index_index.html`，其中 `zh-CN` 为语言名。

关于如果使用国际化请见 [这里](./i18n.html)。 

### 多主题

设置多主题后，视图路径会多一层多主题的目录。如：具体的视图路径变为 `view/default/home/index_index.html`，其中 `default` 为主题名称。

可以通过 `http.theme` 方法来设置当前的主题，设置主题一般是通过 middleware 来实现。

关于 middleware 更多信息请见 [这里](./middleware.html)。

### 默认模版变量

为了可以在模版里很方便的获取一些通用的变量，框架自动向模版里注册了 `http`, `controller`, `config` 等变量，这些变量可以在模版里直接使用。

#### http

模版里可以直接使用 `http` 对象下的属性和方法。

#### controller

模版里可以直接使用 `controller` 对象下的属性和方法。

```js
export default class extends think.controller.base {
  indexAction(){
    this.navType = 'home';
  }
}
```

Action 里给当前控制器添加了属性 `navType`，那么模版里就可以直接通过 `controller.navType` 来使用。

```text
<%if(controller.navType === 'home')%>
  <li className="action">home</li>
<%}else{%>
  <li>home</li>
<%}%>
```

#### config

通过 `config` 对象可以在模版中直接对应的配置，如：

```text
<%if(config.name === 'text'){%>

<%}%>
```


#### 国际化方法 _

在模版中可以直接通过 `_` 方法获取对应本地化的值，这些值在 `src/common/config/locales/[lang].js` 中定义。

```text
<%= _('title')%>
```

更多国际化相关的信息请见 [这里](./i18n.html)。

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


## 路由

当用户访问一个 url 时，最终执行哪个模块下哪个控制器的哪个操作，这是由路由来解析后决定的。

ThinkJS 提供了一套灵活的路由机制，除了默认的解析外，还可以支持多种形式的自定义路由，让 url 更加简单友好。

### url 解析为 pathname

当用户访问服务时，服务端首先拿到的是一个完整的 url，如：访问本页面，得到的 url 为 `http://www.thinkjs.org/zh-CN/doc/2.0/route.html`。

将 url 进行解析得到的 pathname 为 `/zh-CN/doc/2.0/route.html`。

### pathname 过滤

有时候为了搜索引擎优化或者一些其他的原因， url 上会多加一些东西。比如：当前页面是一个动态页面，但 url 最后加了 `.html`，这样对搜索引擎更加友好。但这些在后续的路由解析中是无用的，需要去除。

ThinkJS 里提供了下面的配置可以去除 `pathname` 的前缀和后缀内容：

```js
export default {
  pathname_prefix: '', 
  pathname_suffix: '.html',
}
```

上面配置可以在 `src/common/config/config.js` 中进行修改。

pathname 过滤时会自动去除左右的 `/`，该逻辑不受上面的配置影响。对 pathname 进行过滤后，拿到干净的 pathname 为 `zh-CN/doc/2.0/route`。

`注：` 如果访问的 url 是 `http://www.thinkjs.org/`，那么最后拿到干净的 pathname 则为空字符串。

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

路由识别默认根据 `模块/控制器/操作/参数1/参数1值/参数2/参数2值` 来识别过滤后的 pathname，如：pathname 为 `admin/group/detail`，那么识别后的结果为：module 为 `admin`，controller 为 `group`，action 为 `detail`。

如果项目里并没有 `admin` 这个模块或者这个模块被禁用了，那么识别后的结果为：module 为默认值 `home`，controller 为 `admin`, action 为 `group`，同时含有一个参数名为 `detail` 的请求参数，但该参数值为空。

`注： 路由识别后，module 和 controller 值会自动转为小写，但 action 值会保持原样。`

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

有时候需要更加简洁的路由，这时候就需要使用自定义路由解析了。如：文章的详细页面，默认路由可能是：`article/detail/id/10`，但我们想要的 url 是 `article/10` 这种更简洁的方式。


** 开启配置 **

开启自定义路由，需要在 `src/common/config/config.js` 开启如下的配置：

```js
export default {
  route_on: true
}
```

** 路由规则 **

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

`注：` 自定义路由每一条规则都是一个数组。（至于为什么不用对象，是因为正则路由下，正则不能作为对象的 key 直接使用）

** 识别方式 **

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

假如访问的 url 为 `http://www.example.com/group/2015/10`，那么会命中该项规则，得到的 pathname 为 `home/group/list`，同时会添加 2 个参数 `year` 和 `month`，这2个参数可以在控制器里通过 `this.get` 方法来获取。

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

假如访问的 url 为 `http://www.example.com/list`，那么替换后的 pathname 为 `home/article/list`。

#### 优化路由性能

上面已经说到，自定义路由是个数组，数组每一项是个具体的路由规则，匹配时是从前向后逐一进行匹配。如果这个路由表比较大的话，可能会有性能问题。

为了避免有性能问题，ThinkJS 提供了一种更加高效自定义路由的方式，按模块来配置路由。使用这种方式，路由配置格式跟上面稍微有所不同。

** common/config/route.js **

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

** admin/config/route.js **

admin 模块配置 admin 下的具体路由规则。

```js
export default [
  [/^admin\/(?!api).*$/, 'admin/index'],
  [/^admin\/api\/(\w+?)(?:\/([\d,]*))?$/, 'admin/:1?id=:2&resource=:1'],
];
```


# 模型

## 模型介绍

## 事务

## 关联模型

## MongoDB

## Sqlite

# 适配器

## 适配器

## Cache

## Session

## WebSocket

## DB

## Store

## 模版引擎适配器

## Socket

# 更多

## thinkjs 命令

## middleware

## Service

## 错误处理


## 错误信息

## 数据校验

## 国际化

## 路径常量

## Rest API

## 线上部署

### 使用 nginx 做反向代理

### 使用 pm2 管理服务

### 关闭静态资源处理的配置

## 推荐模块

### 网络请求

* superagent
* request

### 日志

* log4js

### 日期处理

* moment

### 编码转化

* iconv-lite

### 图像处理

* gm

### 框架

* thinkjs
* express
* koa
* sails

### 调试

* node-inspector

### 单元测试

* mocha
* istanbul
* muk

### 服务管理

* pm2

### 邮件

* nodemailer

### 数据库


# API

## think

`think`是一个全局对象，该对象里包含了大量有用的属性和方法。这些方法在应用的任何地方都可以直接使用，无需再 require。

### 属性

#### think.startTime

服务启动时间，是个`unix`时间戳。

#### think.env

当前项目运行的环境，默认支持下面3个值，可以在项目启动时指定：

* `development` 开发环境，会自动更新修改的文件
* `testing` 测试环境
* `production` 线上环境，代码上线时使用

#### think.dirname

项目的文件夹名称，可以在项目启动时指定，默认值如下：

```js
think.dirname = {
  config: 'config', //配置文件目录
  controller: 'controller', //控制器目录
  model: 'model', //模型目录
  adapter: 'adapter', //适配器目录
  logic: 'logic', //逻辑目录
  service: 'service', //服务目录
  view: 'view', //视图目录
  middleware: 'middleware', //中间件目录
  runtime: 'runtime', //运行时目录
  common: 'common', //通用目录
  bootstrap: 'bootstrap', //启动目录 
  locale: 'locale' //本土化目录
}
```

#### think.port

项目运行的端口，可以在项目启动时指定。如果指定，则忽略配置文件里的端口。

#### think.cli

是否是命令行模式在运行项目，默认为`false`。如果是命令行模式，则该值为传递的参数，可以通过下面的方式启动命令行模式。

```
node www/index.js /home/index/test
```

#### think.lang

系统当前的语言，从环境变量中读取，在`windows`下可能为空。

#### think.mode

项目当前的模式，框架支持3中项目模式：

* `think.mode_mini` 单模块模式，整个项目只有一个模块
* `think.mode_normal` 多模块模式，目录结构只有`Controller`，`View`，`Logic`等分模块
* `think.mode_module` 多模块模式，严格按照模块来划分目录结构

#### think.version

ThinkJS当前的版本

#### think.module

当前项目下的模块列表，如果项目模式是`think.mode_mini`，那么值为空数组。

#### think.THINK_PATH

ThinkJS代码的路径

#### think.THINK_LIB_PATH

ThinkJS代码`lib/`的具体路径

#### think.ROOT_PATH

项目的根目录，在`www/index.js`中定义

#### think.APP_PATH

项目的`app`目录，在`www/index.js`中定义

#### think.RESOURCE_PATH

项目的静态资源根目录，在`www/index.js`中定义




### 方法

#### think.Class(methods, clean)

动态的创建一个类，默认继承自 think.base 。 如果使用 ES6 特性进行开发的话，可以直接使用 ES6 里的 class 来创建类。

```js
//继承自 think.base
var Cls1 = think.Class({
  getName: function(){

  }
})
```


** 不继承 think.base ** 

```js
var Cls2 = think.Class({
  getName: function(){

  }
}, true);
```


** 继承一个类 **

```js
//继承自 Cls2
var Cls3 = think.Class(Cls2, {
  init: function(name){
    this.name = name;
  },
  getName: function(){

  }
})
```


** 实例化类 **

```js
//获取类的实例，自动调用 init 方法
var instance = new Cls3('thinkjs');
```

#### think.extend(target, source1, source2, ...)

* `target` {Object} 目录对象
* `source1`  {Mixed} 源对象1
* `return`  {Object} 目录对象

将 source1, source2 等对象上的属性或方法复制到 target 对象上，类似于 jQuery 里的 $.extend 方法。

默认为深度复制，可以将第一个参数传 `false` 进行浅度复制。  

```js
think.extend({}, {name: 'foo'}, {value: 'bar'});
// returns 
{name: 'foo', value: 'bar'}
```

#### think.isBoolean(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测一个对象是否是布尔值。

```js
think.isBoolean(true); //true
think.isBoolean(false); //true
think.isBoolean('string'); //false
```


#### think.isNumber(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测一个对象是否是数字。

```js
think.isNumber(1); //true
think.isNumber(1.21); //true
```

#### think.isObject(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是对象

```js
think.isObject({}); //true
think.isObject({name: "welefen"}); //true
think.isObject(new Buffer('welefen')); //false
```

#### think.isString(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是字符串

```js
think.isString("xxx"); // true
think.isString(new String("xxx")); //true
```

#### think.isFunction(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是函数

```js
think.isFunction(function(){}); //true
think.isFunction(new Function("")); //true
```

#### think.isDate(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是日期对象

```js
think.isDate(new Date()); //true
```

#### think.isRegexp(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是正则

```js
think.isRegexp(/\w+/); //true
think.isRegexp(new RegExp("/\\w+/")); //true
```

#### think.isError(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是个错误

```js
think.isError(new Error("xxx")); //true
```

#### think.isEmpty(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否为空

```js
// 检测是否为空
think.isEmpty({}); //true
think.isEmpty([]); //true
think.isEmpty(""); //true
think.isEmpty(0); //true
think.isEmpty(null); //true
think.isEmpty(undefined); //true
think.isEmpty(false); //true
```


#### think.isArray(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是数组

```js
think.isArray([]); //true
think.isArray([1, 2]); //true
think.isArray(new Array(10)); //true
```


#### think.isIP4(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP4

```js
think.isIP4("10.0.0.1"); //true
think.isIP4("192.168.1.1"); //true
```


#### think.isIP6(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP6

```js
think.isIP6("2031:0000:130f:0000:0000:09c0:876a:130b"); //true
think.isIP6("2031:0000:130f::09c0:876a:130b"); //true
```

#### think.isIP(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 IP

```js
think.isIP("10.0.0.1"); //true
think.isIP("192.168.1.1"); //true
think.isIP("2031:0000:130f:0000:0000:09c0:876a:130b"); //true ip6
```

#### think.isFile(file)

* `file` {Mixed} 要检测的文件路径
* `return` {Boolean}

检测是否是文件，如果在不存在则返回 false

```js
think.isFile("/home/welefen/a.txt"); //true
think.isFile("/home/welefen/dirname"); //false
```

#### think.isDir(dir)

* `dir` {Mixed} 要检测的路径
* `return` {Boolean}

检测是否是目录，如果不存在则返回 false

```js
think.isDir("/home/welefen/dirname"); //true
```

#### think.isBuffer(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是 Buffer

```js
think.isBuffer(new Buffer(20)); //true
```

#### think.isNumberString(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

是否是字符串类型的数字

```js
think.isNumberString(1); //true
think.isNumberString("1"); //true
think.isNumberString("1.23"); //true
```

#### think.isPromise(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是个 promise

```js
think.isPromise(new Promise(function(){})); //true
think.isPromise(getPromise()); //true
```

#### think.isHttp(obj)

* `obj` {Mixed} 要检测的对象
* `return` {Boolean}

检测是否是包装的 http 对象

```js
think.isHttp(http); // true
```

#### think.isWritable(path)

* `path` {String} 要写的目录
* `return` {Boolean}

判断文件或者目录是否可写，如果不存在则返回 false


#### think.isPrevent(obj)

* `obj` {Mixed}
* `return` {Boolean}

判断是否是个阻止类型的 promise。通过 think.prevent() 会生成该 promise 。

#### think.mkdir(p, mode)

* `p` {String} 要创建的目录
* `mode` {Number} 要创建的目录权限，默认为 `0777`

递归的创建目录，如果目录已经存在，那么修改目录的权限。

```js
// 假设 /home/welefen/a/b/ 不存在
think.mkdir("/home/welefen/a/b");
think.mkdir("home/welefne/a/b/c/d/e"); // 递归创建子目录
```

#### think.rmdir(p, reserve)

* `p` {String} 要删除的目录
* `reserve` {Boolean} 是否保留该目录。如果为true，则只删除子目录
* `return` {Promise}

递归的删除目录，如果目录不存在则直接返回。返回是个Promise，后续操作要在`then`里执行

```js
function rmTmp(){
  think.rmdir('/foo/bar').then(function(){
    //后续其他操作
  })
}
```

如果使用`Generator Function`，则可以使用`yield`

```js
function * rmTmp(){
  yield think.rmdir('/foo/bar');
  //后续其他操作
}
```

#### think.chmod(p, mode)

* `p` {String} 要修改的目录
* `mode` {Number} 目录权限，默认为`0777`

修改目录权限，如果目录不存在则直接返回

```js
think.chmod("/home/welefen/a", 0777);
```


#### think.md5(str)

* `str` {String} 要计算md5值的字符串
* `return` {String} md5值

计算字符串的md5值

```js
think.md5('thinkjs'); 
// returns
7821eb623e0b1138a47db6a88c3f56bc
```


#### think.defer()

* `return` {Object} Deferred对象

创建一个`Deferred`对象，`new Promise`的一种快捷方式。虽然不建议使用`Deferred`这种方式，但有时候不得不使用。如：`setTimeout`, `event`。

```js
//使用Deferred的方式
var fn = function(){
  var deferred = think.defer();
  process.nextTick(function(){
    if(xxx){
      deferred.resolve(data);
    }else{
      deferred.reject(err);
    }
  })
  return deferred.promise;
}
```

使用`Deferred`方式比直接使用`new Promise`的方法代码更加简洁。

```js
//直接使用new Promise的方式
var fn = function(){
  return new Promise(function(resolve, reject){
    process.nextTick(function(){
      if(xxx){
        resolve(data);
      }else{
        reject(err);
      }
    })
  })
}
```

注： 异步`callback`的操作不要使用`Deferred`方式，可以用`think.promisify`方法快速把`callback`包装成`Promise`。

#### think.promisify(fn, receiver)

* `fn` {Function} 要转化的函数
* `receiver` {Object} this指向

将异步方法快速包装成Promise，异步方法必须符合最后一个参数为回调函数，且回调函数的第一个参数为`err`的原则。

```js
var fs = require('fs');

//获取文件内容
var getContent = function(filePath){
  //将readFile方法包装成Promise
  var readFilePromise = think.promisify(fs.readFile, fs);
  //读取文件内容
  return readFilePromise(filePath, 'utf8');
}

//获取具体的文件内容
getContent('/foo/bar/file.txt').then(function(content){
  console.log(content);
}).catch(function(err){
  console.error(err.stack);
})
```


#### think.reject(err)

* `err` {Error} Error对象
* `return` {Promise} reject promise

返回一个 reject promise，与`Promise.reject`不同的是，该方法会自动打印错误信息。避免需要调用 catch 方法手工打印错误信息。

```js
//使用Promise.reject
var fn = function(){
  return Promise.reject(new Error('xxx'));
}
//需要手工调用catch方法打印错误信息
fn().catch(function(err){
  console.error(err.stack);
})
``` 

```js
//使用think.reject
var fn = function(){
  return think.reject(new Error('xxx'));
}
//会自动打印格式化后的错误信息
fn();
```

#### think.co

`co`模块的别名 <https://github.com/tj/co>

#### think.lookClass(name, type, module, base)

* `name` {String} 类名
* `type` {String} 类型 (controller | model | logic ...)
* `module` {String} 模块名
* `base` {String} 找不到时找对应的基类

根据类型，名称来查找类。如果找不到会到 common 模块下查找，如果还是找不到，则查找对应类型的基类。

```js
//查找 home 模块下 user controller
//如果找不到，会找 common 模块下 user controller
//如果还是找不到，会找 base controller
think.lookClass('user', 'controller', 'home'); 

//查找 admin 模块下 user controller
think.lookClass('admin/user', 'controller');
```

#### think.getPath(module, type, prefix)

* `module` {String} 模块名
* `type` {String} 类型，如： controller, model, logic
* `prefix` {String} 前缀

根据当前项目类型获取对应类型的目录。

```js
let path = think.getPath('home', 'controller');
```

假如当前项目的根目录是`/foo/bar`，那么获取到的目录为：

* 项目模式`think.mode_mini` 下路径为 `/foo/bar/app/controller`
* 项目模式`think.mode_normal` 下路径为 `/foo/bar/app/controller/home`
* 项目模式`think.mode_module` 下路径为 `/foo/bar/app/home/controller`

#### think.require(name, flag)

* `name` {String} 
* `flag` {Boolean}

#### think.safeRequire(file)

* `file` {String} 要加载的文件

安全的加载一个文件，如果文件不存在，则返回null，并打印错误信息。

#### think.prevent()

返回一个特殊的 reject promise 。该 promise 可以阻止后续的行为且不会报错。

#### think.log(msg, type, showTime)

* `msg` {String | Error} 信息
* `type` {String} 类型
* `showTime` {Number | Boolean} 是否显示时间

打印日志，该方法打印出来的日志会有时间，类型等信息，方便查看和后续处理。

```js
think.log('WebSocket Status: closed', 'THINK');
//writes '[2015-09-23 17:43:00] [THINK] WebSocket Status: closed'
```

** 打印错误信息 **
```js
think.log(new Error('error'), 'ERROR');
//writes '[2015-09-23 17:50:17] [Error] Error: error'
```

** 显示执行时间 **

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', startTime);
//writes '[2015-09-23 17:52:13] [HTTP] /static/module/jquery/1.9.1/jquery.js 10ms'
```

** 不显示时间 **

```js
think.log('/static/module/jquery/1.9.1/jquery.js', 'HTTP', null);
//writes '[HTTP] /static/module/jquery/1.9.1/jquery.js'
```

** 自定义 ** 

```js
think.log(function(colors){
  return colors.yellow('[WARNING]') + ' test';
});
//writes '[WARNING] test'
```

其中`colors`为 npm 模块 colors，<https://github.com/Marak/colors.js> 。

#### think.config(name, value, data)

* `name` {String} 配置名称
* `value` {Mixed} 配置值
* `data` {Object} 配置对象

读取或者设置配置，可以指定总的配置对象。

```js
//获取配置
let value = think.config('name');
//获取 admin 模块下的配置
let value = think.config('name', undefined, 'admin');

// 写入配置
think.config('name', 'value');
```

#### think.getModuleConfig(module)

* `module` {String} 模块名称
* `return` {Object}

获取模块的所有配置。该配置包含模块的配置，通用模块的配置，框架默认的配置。

```js
//获取 admin 模块的所有配置
let configs = think.getModuleConfig('admin');
```

#### think.hook()

注册、获取和执行 hook。

系统默认的 hook 列表：

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

项目中可以根据需要追加或者修改。

** 获取事件对应的 middleware 列表 **

```js
think.hook('view_template');
//returns
['locate_template']
```

** 设置 hook **

```js
//替换原有的 hook
think.hook('view_template', ['locate_template1']);

//将原有的之前追加
think.hook('view_template', ['locate_template1'], 'prepend');

//将原有的之后追加
think.hook('view_template', ['locate_template1'], 'append');

```

** 删除 hook **

```js
think.hook('view_template', null);
```

** 执行 hook **

```js
let result = think.hook('view_template', http, data);
//result is a promise
```

#### think.middleware()

注册、创建、获取和执行 middleware。

** 创建 middleware **

```js
//解析 XML 示例
var ParseXML = think.middlearea({
  run: function(){
    var http = this.http;
    var payload = http.payload; //payload为上传的post数据
    var data = xmlParse.parse(payload); //使用一个xml解析，这里 xmlParse 是示例
    http._post = data; //将解析后的数据赋值给 http._post，后续可以通过 http.post('xxx') 获取
  }
});
```

使用 ES6 创建 middleware。

```js
let Cls1 = class extends think.middleware.base {
  run(){
    let http = this.http;
  }
}
```

** 注册 middleware **

middlearea 可以是个简单的 function，也可以是较为复杂的 class。

```js
//注册 middleware 为 function
think.middleware('parse_xml', http => {
  
})
```

```js
//注册 middleware 为 class
//会自动调用 run 执行
let Cls = think.middlearea({
  run: function(){
    let http = this.http;

  }
});
think.middleware('parse_xml', Cls);
```

** 获取 middleware **

```js
let middlearea = think.middleare('parse_xml');
```

** 执行 middleware **

```js
let result = think.middleare('parse_xml', http);
//result is a promise
```


#### think.adapter()

创建、注册、获取和执行 adapter。

** 创建 adapter **

```js
//创建一个 adapter
var Cls = think.adapter({

});

//创建一个 session adapter，继承自 session base 类
var Cls = think.adapter('session', 'base', {
  
})
```

```js
//使用 ES6 创建一个 session adapter
let Cls = class extends think.adapter.session {

}
```

** 注册 adapter **

```js
//注册一个 xxx 类型的 session adapter
think.adapter('session', 'xxx', Cls);
```

** 获取 adapter **

```js
//获取 file 类型的 session adapter
let Cls = think.adapter('session', 'file');
```

** 执行 adapter **

```js
let Adapter = think.adapter('session', 'file');
let instance = new Adapter(options);
```


#### think.gc(instance)

* `instance` {Object} 类的实例

注册实例到 gc 队列中。instance 必须含有属性`gcType`和方法`gc`。

像 cache, session 这些功能一般都是有过期时间，过期后需要要进行清除工作。框架提供了一套机制方便清除过期的文件等。

```js
let Cls = class extends think.adapter.cache {
  init(options){
    super.init(options);
    this.gcType = 'xFileCache';
    think.gc(this);
  }
  gc(){
    //寻找过期的内容并清除
  }
}
```

#### think.http(req, res)

* `req` {Object} request 对象
* `res` {Object} response 对象
* `return` {Promise}

根据 req 和 res 包装成 http 对象。req 和 res 可以自定义。

```js
//根据一个 url 生成一个 http 对象，方便命令行下调用
think.http('/index/test').then(http => {
  
});
```

#### think.uuid(length)

* `length` {Number} 生成字符串的长度，默认为 32

生成一个随机字符串。


#### think.session(http)

* `http` {Object} http对象

生成 session，并写到 http 对象上。如果已经存在，则直接返回。

#### think.controller()

创建、执行 controller

** 创建 controller **

```js
//创建 controller, 继承 think.controller.base
let Cls = think.controller({
  
})
//创建 controller, 继承 think.controller.rest
let Cls = think.controller('rest', {
  
})
```

```js
//使用 ES6 创建 controller
let Cls1 = class extends think.controller.base {
  
}
```

** 实例化 controller **

```js
//实例化 home 模块下 user controller
let instance = think.controller('user', http, 'home');
```


#### think.logic()

创建、执行 logic

** 创建 logic **

```js
//创建 logic, 继承 think.logic.base
let Cls = think.logic({
  
})
```

```js
//使用 ES6 创建 logic
let Cls1 = class extends think.logic.base {
  
}
```

** 实例化 logic **

```js
//实例化 home 模块下 user logic
let instance = think.logic('user', http, 'home');
```


#### think.model()

创建或者获取 model。

** 创建 model **

```js
//创建一个 model
let model = think.model({
  getList: function(){

  }
});

//ES6 里直接继承 think.model.base 类
let model = class extends think.model.base {
  getList(){

  }
}


//创建一个 model 继承自 mongo model
let model = think.model('mongo', {
  getList: function(){

  }
});
//ES6 里直接继承 think.model.mongo 类
let model = class extends think.model.mongo {
  getList(){

  }
}
```


** 获取 model 实例 **

```js
let configs = {
  host: '127.0.0.1',
  name: 'user'
}
//获取 home 模块下 user model
let instance = think.model('user', configs, 'home');
```

#### think.service()

创建或者获取 service。

** 创建 service ** 

```js
//创建一个 service 类
let service = think.service({
  
})

//ES6 里直接继承 think.service.base 类
let service = class extends think.service.base {

}
```

service 基类继承自 [think.base](./api_think_base.html)，所以可以用 think.base 里的方法。

如果 serivce 不想写成类，那就没必要通过这种方法创建。


** 获取 service **

```js
//获取 home 模块下 post service，并传递参数 {} 
//如果获取到的 service 是个类，则自动实例化
think.service('post', {}, 'home');
```


#### think.cache(name, value, options)

* `name` {String} 缓存 key
* `value` {Mixed} 缓存值
* `options` {Object} 缓存选项
* `return` {Promise} 操作都是返回 Promise

获取、设置或者删除缓存， value 是 `undefined` 表示读取缓存。 value 是 `null` 时删除缓存。

value 为 `Function` 时表示获取缓存，如果获取不到，则调用该函数，然后将返回值设置到缓存中并返回。

```js
//获取缓存
think.cache('name').then(data => {});

//指定缓存类型获取，从 redis 里获取缓存
think.cache('name', undefined, {type: 'redis'});

//如果缓存 userList 不存在，则查询数据库，并将值设置到缓存中
think.cache('userList', () => {
  return think.model('user').select();
});

//设置缓存
think.cache('name', 'value');

//删除缓存
think.cache('name', null);
```

#### think.locale(key, ...data)

* `key` {String} 要获取的 key
* `data` {Array} 参数

根据语言获取对应的值，当前语言存放在`think.lang`，可以在系统启动时指定。

```js
think.locale('CONTROLLER_NOT_FOUND', 'test', '/index/test');
//returns 
'controller `test` not found. url is `/index/test`.'
```


#### think.validate()

注册、获取或执行检测。

** 注册检测方法 **

```js
//注册检测类型为 not_number
think.validate('not_number', value => {
  return !(/^\d+$/.test(value));
})
```

** 获取检测方法 **

```js
let fn = think.validate('not_number');
```

** 检测数据 **

```js
let result = think.validate({
  name: {
    value: 'name',
    required: true,
    not_number: true
  },
  pwd: {
    value: 'xxx',
    required: true,
    minLength: 6
  }
});
//如果 result 是 isEmpty，表示数据都正常
if(think.isEmpty(result)){

}
```

#### think.await(key, callback)

* `key` {String} 
* `callback` {Function}

执行等待，避免一个耗时的操作多次被执行。 callback 需要返回一个 promise 。

如：用户访问时，要请求一个远程的接口数据。如果不处理，每个用户请求都会触发这个远程接口的访问，导致有很大的资源浪费。可以让这些用户公用一个远程接口的请求。

```js

import superagent from 'superagent';

export default class extends think.controller.base {
  * indexAction(){
    let result = yield think.await('get_xxx_data', () => {
      let req = superagent.post('xxxx');
      let fn = think.promisify(req.end, req);
      return fn();
    });
    this.success(result);
  }
}
```


#### think.npm(pkg)

* `pkg` {String} 模块名

加载模块。如果模块不存在，则自动安装。这样可以做到动态安装模块。

```js
//如果mysql模块，则通过npm安装
let mysql = think.npm('mysql');
```

```js
//指定版本加载一个模块
let mysql = think.npm('mysql@2.0.0')
```

#### think.error(err, addon)

* `err` {Error | Promise | String} 错误信息
* `addon` {Error | String} 追加的错误信息

格式化错误信息，将部分系统的错误信息描述完整化。

```js
let error = think.error(new Error('xxx'));
```

** 捕获 promise 的错误信息 **

```js
let promise = Project.reject(new Error('xxx'));
promise = think.error(promise)
```

自动给 promise 追加 catch，捕获错误信息。

#### think.statusAction(status, http, log)

* `status` {Number} 状态码
* `http` {Object} 包装的http对象
* `log` {Boolean} 是否打印错误信息

当系统出现异常时（系统错误，页面找不到，没权限等），显示对应的错误页面。

创建项目时，会在 common 模块下创建名为 error controller，专门用来处理错误情况。

默认支持的错误类型有：`400`, `403`, `404`, `500`, `503`。

项目里可以根据需要修改错误页面或者扩展。

```js
export default class extends think.controller.base {
  indexAction(){
    if(xxxx){
      let error = new Error('not found');
      //将错误信息写到 http 对象上，用于模版里显示
      this.http.error = error;
      return think.statusAction(404, this.http);
    }
  }
}
```

### 类

#### think.base

think.base 详细介绍请见 [这里](./api_think_base.html)

#### think.http.base

think.http.base 详细介绍请见 [这里](./api_think_http_base.html)

## think.base

`think.base`是基类，所有的类都会继承该类，该类提供了一些基本的方法。

使用 ES6 语法继承该类：

```js
export default class extends think.base {
  /**
   * init method
   * @return {} []
   */
  init(){

  }
}
```

`注`： 使用 ES6 里的类时不要写`constructor`，把初始化的一些操作放在`init`方法里，该方法在类实例化时自动被调用，效果等同于`constructor`。

使用普通的方式继承该类：
```js
module.exports = think.Class(think.base, {
  /**
   * init method
   * @return {} []
   */
  init: function(){

  }
})
```

### init(...args)

* `args` {Array}

初始化方法，这里可以进行一些赋值等操作。

```js
class a extends think.base {
  init(name, value){
    this.name = name;
    this.value = value;
  }
}
```

`注`：与`1.x`版本不同的是，`2.x`版本`init`方法不再支持返回一个`Promise`，一些通用操作放在`__before`魔术方法里进行。

### __before()

前置魔术方法，可以将一些通用的行为放在这里进行，如：controller 里检测用户是否登录

```js
export default class think.controller.base {
  /**
   * 前置魔术方法
   * @return {Promise} []
   */
  * __before(){
    let userInfo = yield this.session('userInfo');
    //如果没有登录，则跳转到登录页面
    if(think.isEmpty(userInfo)){
      return this.redirect('/logic');
    }
    this.assign('userInfo', userInfo)
  }
}
```

### __after()

后置魔术方法，在方法执行完成后在执行。

### filename()

* `return` {String} 返回当前类文件的名称

获取当前类文件的名称，不包含文件具体路径和扩展名。

```js
//假设当前类文件具体路径为 /home/xxx/project/app/controller/user.js
class a extends think.base {
  test(){
    var filename = this.filename();
    //returns 'user'
  }
}
```


### invoke(method, ...data)

* `method` {String} 要调用的方法名称
* `data` {Array} 传递的参数
* `return` {Promise}

调用一个方法，自动调用`__before`和`__after`魔术方法。不管方法本身是否返回`Promise`，该方法始终返回`Promise`。

方法本身支持是`Generator Function`和`async`。

```js
//使用 async 和 await
class Cls extends think.base {
  async getValue(){
    let value = await this.getValue();
    return value;
  }
}
let instance = new Cls();
instance.invoke('getValue').then(data => {
    
});
```


```js
//使用 * 和 yield
class Cls extends think.base {
  * getValue(){
    let value = yield this.getValue();
    return value;
  }
}
let instance = new Cls();
instance.invoke('getValue').then(data => {
    
});

```



## think.http.base

`think.http.base`继承自 [think.base](./api_think_base.html) 类，该类为含有 http 对象处理时的基类。middleware, controller, view 类都继承自该类。

** 使用 ES6 语法继承该类 **

```js
export default class extends think.http.base {
  /**
   * 初始化方法，实例化时自动被调用，不要写 constructor
   * @return {} 
   */
  init(){

  }
}
```

** 使用普通的方式继承该类 **

```js
module.exports = think.Class(think.http.base, {
  init: function(){

  }
});
```

### config(name, value)

* `name` {String} 配置名称
* `value` {Mixed} 配置值

读取或者设置配置，value 为 `undefined` 时为读取配置，否则为设置配置。

该方法不仅可以读取系统预设值的配置，也可以读取项目里定义的配置。

`注`：不可将当前请求的用户信息作为配置来设置，会被其他用户给冲掉。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取配置值
    let value = this.config('name');
  }
}
```

### action(controller, action)

* `controller` {Object | String} controller实例
* `action` {String} action名称
* `return` {Promise} 

调用 controller 下的 action，返回一个 Promise。自动调用`__before`和`__after`魔术方法。

如果 controller 是字符串，则自动去寻找对应的 controller。

```js
//调用当前模块下controller里的action
export default class extends think.controller.base {
  * indexAction(){
    //调用user controller下的detail方法
    let value = yield this.action('user', 'detail');
  }
}
```

```js
//跨模块调用controller里的action
export default class extends think.controller.base {
  * indexAction(){
    //调用admin模块user controller下的detail方法
    let value = yield this.action('admin/user', 'detail');
  }
}
```

### cache(name, value, options)

* `name` {String} 缓存名称
* `value` {Mixed | Function} 缓存值
* `options` {Object} 缓存配置，具体见缓存配置

读取或者设置缓存，`value`为`undefined`时是读取缓存，否则为设置缓存。默认缓存类型为`file`。

```js
export default class extends think.controller.base {
  * indexAction(){
    //获取缓存
    let value = yield this.cache('name');
  }
}
```

当参数`value`为 function 时，表示获取缓存，如果缓存值不存在，则调用该 function，将返回值设置缓存并返回。这样避免在项目开发时要先判断缓存是否存在，然后再从相关地方读取值然后设置缓存的麻烦。

```js
export default class extends think.controller.base {
  * indexAction(){
    //获取缓存，缓存不存在时自动调用 function，并设置缓存
    let value = yield this.cache('name', () => {
      return this.model('user').select();
    });
  }
}
```

设置缓存并修改缓存类型：

```js
export default class extends think.controller.base {
  * indexAction(){
    //设置缓存，缓存类型使用redis
    yield this.cache('name', 'value', {
      type: 'redis'
    });
  }
}
```


### hook(event, data)

* `event` {String} 事件名称
* `data` {Mixed} 参数
* `return` {Promise}

执行对应的事件，一个事件包含若干个 middleware，会按顺序执行这些 middleware。

事件可以在配置`config/hook.js`里定义，也可以通过 think.hook 来注册。

```js
export default class extends think.controller.base {
  * indexAction(){
    let result = yield this.hook('parse_data');
  }
}
```

### model(name, options)

* `name` {String} 模型名称
* `options` {Object} 配置，具体见数据库配置
* `return` {Object} model实例

获取模型实例，默认获取当前模块下对应模型的实例，也可以跨模块获取模型的实例。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取当前模块下的 user model 的实例
    let model = this.model('user');
    //获取admin模块下 article model 的实例
    let model1 = this.model('admin/article');
    //获取当前模块下的 test model 的实例，并且是 sqlite 的数据库
    let model2 = this.model('test', {
      type: 'sqlite' //设置数据库类型为sqlite，更多参数见数据库配置
    })
  }
}

```

### controller(name)

* `name` {String} controller名称
* `return` {Object} controller实例

获取 Controller 的实例，如果 Controller 找不到，则报错。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取当前模块下 user controller 的实例
    let controller = this.controller('user');
    //获取admin模块下 user controller 的实例
    let controller1 = this.controller('admin/user');
  }
}
```


### service(name)

* `name` {String} service 名称
* `return` {Class} 

获取对应的 service。service 返回的可能是 class ，也可能直接是个对象，所以不会直接实例化。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取对应的service
    let service = this.service('user');
    //获取service的实例
    let instance = new service(...args);
    //获取admin模块下的user service
    let service1 = this.service('admin/user');
  }
}
```



## http

这里的 http 对象并不是 Node.js 里的 http 模块，而是 ThinkJS 里的 request 和 response 2个对象进行包装后的对象。

```js
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);
```

如上面的代码所示，Node.js 创建服务时，会传递 request 和 response 2个对象给回调函数。为了后续调用方便， ThinkJS 对这2个对象进行了包装，包装成了 http 对象，并且提供很多有用的方法。

http 对象会在 middleware, logic, controller, view 中传递。


`注`：http 对象是 EventEmitter 的一个实例，所以可以对其进行事件监听和执行。


### 属性

#### http.req

系统原生的 request 对象

#### http.res

系统原生的 response 对象

#### http.startTime

请求的开始时间，是个`unix`时间戳。

#### http.url

当前请求的 url 。

#### http.version

当前请求的 http 版本。

#### http.method

当前请求的类型。

#### http.headers

当前请求的所有头信息。

#### http.pathname

当前请求的 pathname，路由识别会依赖该值，会在后续的处理中对其进行改变。所以在 action 拿到值可能跟初始解析出来的值不一致。

#### http.query

当前请求的所有 query 数据。

#### http.host

当前请求的 host， 包含端口。

#### http.hostname

当前请求的 hostname，不包含端口。

#### http.payload

当前请求的 payload 数据，提交型的请求才含有该值。


### 方法

#### http.config(name)

* `name` {String} 参数名
* `return` {Mixed} 返回对应的参数值

获取当前请求下对应的参数值。

#### http.referrer()

* `return` {String} 请求的 referrer

返回当前请求的 referrer。

#### http.userAgent()

* `return` {String} 请求的 userAgent

返回当前请求的 userAgent。

#### http.isGet()

* `return` {Boolean}

返回当前请求是否是 GET 请求。

#### http.isPost()

* `return` {Boolean}

返回当前请求是否是 POST 请求。

#### http.isAjax(method)

* `method` {String} 请求类型
* `return` {Boolean}

返回当前请求是否是 Ajax 请求。

```js
http.isAjax(); //判断是否是Ajax请求
http.isAjax('GET'); //判断是否是Ajax请求，且请求类型是GET
```

#### http.isJsonp(name)

* `name` {String} callback 参数名称，默认为 callback
* `return` {Boolean}

返回当前请求是否是 jsonp 请求。

```js
//url is  /index/test?callback=testxxx
http.isJsonp(); //true
http.isJsonp('cb'); //false
```


#### http.get(name, value)

* `name` {String} 参数名称
* `value` {Mixed} 参数值

获取或者设置 GET 参数值。可以通过该方法设置 GET 参数值，方便后续的逻辑里获取。

```js
// url is /index/test?name=thinkjs
http.get('name'); // returns 'thinkjs'
http.get('name', 'other value');
http.get('name'); // returns 'other value'
```


#### http.post(name, value)

* `name` {String} 参数名称
* `value` {Mixed} 参数值

获取或者设置 POST 值。可以通过该方法设置 POST 值，方便后续的逻辑里获取。

```js
http.post('email'); //获取提交的email
```

#### http.param(name)

* `name` {String} 参数名称
* `return` {Mixed}

获取参数值，优先从 POST 里获取，如果值为空，则从 URL 参数里获取。


#### http.file(name)

* `name` {String} 文件对应的字段名称
* `return` {Object} 

获取上传的文件。

```js
http.file('image');
//returns 
{
  fieldName: 'image', //表单里的字段名
  originalFilename: filename, //原始文件名
  path: filepath, //文件临时存放的路径
  size: size //文件大小
}
```

#### http.header(name, value)

* `name` {String} header 名称
* `value` {String} header 值

获取或者设置 header 信息。

```js
http.header('accept'); //获取accept
http.header('X-NAME', 'thinkjs'); //设置header
```


#### http.status(status)

设置状态码。如果头信息已经发送，则无法设置状态码。

```js
http.status(400); //设置状态码为400
```

#### http.ip()

获取用户的 ip 。如果使用了代理，获取的值可能不准。

#### http.getLang()

从 headers 中获取语言。

#### http.lang(lang)

获取或者设置国际化的语言，设置后模版路径要多一层语言的目录。

#### http.theme(theme)

获取或者设置主题，设置后模版路径要多一层主题的目录。

#### http.cookie(name, value)

* `name` {String} cookie 名称
* `value` {String} cookie 值

读取或者设置 cookie 值。

```js
http.cookie('think_test'); //获取名为 think_test 的 cookie
http.cookie('name', 'value'); //设置 cookie，如果头信息已经发送则设置无效
```

#### http.redirect(url, status)

* `url` {String} 要跳转的 url
* `status` {Number} 状态码， 301 或者 302，默认为302

页面跳转。

```js
http.redirect('/login'); //跳转到登录页面
```

#### http.type(contentType, encoding)

* `contentType` {String} 要设置的 contentType
* `encoding` {String} 要设置的编码

获取或者设置 Content-Type。

```js
http.type(); //获取Content-Type
http.type('text/html'); //设置Content-Type，会自动加上charset
http.type('audio/mpeg', false); //设置Content-Type，不追加charset
```

#### http.write(content, encoding)

* `content` {Mixed} 要输出的内容
* `encoding` {String} 编码

输出内容，要调用 http.end 才能结束当前请求。

#### http.end(content, encoding)

* `content` {Mixed} 要输出的内容
* `encoding` {String} 编码

输出内容并结束当前请求。

#### http.success(data, message)

* `data` {Mixed} 要输出的数据
* `message` {String} 追加的message

格式化输出一个正常的数据，一般是操作成功后输出。

```js
http.success({name: 'thinkjs'});
//writes
{
  errno: 0,
  errmsg: '',
  data: {
    name: 'thinkjs'
  }
}
```

这样客户端就可以根据`errno`是否为`0`为判断当前请求是否正常。

#### http.fail(errno, errmsg, data)

* `errno` {Number} 错误号
* `errmsg` {String} 错误信息
* `data` {Mixed} 额外的数据

格式化输出一个异常的数据，一般是操作失败后输出。

`注`：字段名`errno`和`errmsg`可以在配置里进行修改。

```js
http.fail(100, 'fail')
//writes
{
  errno: 100,
  errmsg: 'fail',
  data: ''
}
```

这样客户端就可以拿到具体的错误号和错误信息，然后根据需要显示了。

`注`：字段名`errno`和`errmsg`可以在配置里进行修改。

#### http.json(data)

* `data` {Object}

json 方式输出数据，会设置 Content-Type 为 `application/json`，该值对应的配置为`json_content_type`。



## controller

`think.controller.base` 继承自 [think.http.base](./api_think_http_base.html) 类。项目里的控制器需要继承该类。


** 使用 ES6 的语法继承该类 **

```js
export default class extends think.controller.base {
  indexAction(){

  }
}
```

** 使用普通方式继承该类 ** 

```js
module.exports = think.controller({
  indexAction(){

  }
})
```
### 属性

#### controller.http

传递进来的 [http](./api_http.html) 对象。

### 方法

#### controller.ip()

* `return` {String}

获取当前请求用户的 ip，等同与 http.ip 方法。

```js
export default class extends think.controller.base {
  indexAction(){
    let ip = this.ip();
  }
}
```

#### controller.method()

* `return` {String}

获取当前请求的类型，转化为小写。

```js
export default class extends think.controller.base {
  indexAction(){
    let method = this.method(); //get or post ...
  }
}
```

#### controller.isMethod(method)

* `method` {String} 类型
* `return` {Boolean}

判断当前的请求类型是否是指定的类型。

#### controller.isGet()

* `return` {Boolean}

判断是否是 GET 请求。

#### controller.isPost()

* `return` {Boolean}

判断是否是 POST 请求。

#### controller.isAjax(method)

* `method` {String}
* `return` {Boolean}

判断是否是 Ajax 请求。如果指定了 method，那么请求类型也要相同。

```js
export default class extends think.controller.base {
  indexAction(){
    //是ajax 且请求类型是 POST
    let isAjax = this.isAjax('post');
  }
}
```

#### controller.isWebSocket()

* `return` {Boolean}

是否是 websocket 请求。

#### controller.isCli()

* `return` {Boolean}

是否是命令行下调用。

#### controller.isJsonp(callback)

* `callback` {String} callback 名称
* `return` {Boolean}

是否是 jsonp 请求。

#### controller.get(name)

* `name` {String} 参数名

获取 GET 参数值。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取一个参数值
    let value = this.get('xxx');
    //获取所有的参数值
    let values = this.get();
  }
}
```

#### controller.post(name)

* `name` {String} 参数名

获取 POST 提交的参数。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取一个参数值
    let value = this.post('xxx');
    //获取所有的 POST 参数值
    let values = this.post();
  }
}
```

#### controller.param(name)

* `name` {String} 参数名

获取参数值，优先从 POST 里获取，如果取不到再从 GET 里获取。


#### controller.file(name)

* `name` {String} 上传文件对应的字段名

获取上传的文件。

#### controller.header(name)

* `name` {String} header 名

获取 header 值。

#### controller.userAgent()

获取 userAgent。

#### controller.referrer(onlyHost)

* `referrer` {Boolean} 是否只需要 host

获取 referrer。

#### controller.cookie(name, value, options)

* `name` {String} cookie 名
* `value` {String} cookie 值
* `options` {Object}

获取或者设置 cookie。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取 cookie 值
    let value = this.cookie('think_name');
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    //设置 cookie 值
    this.cookie('think_name', value, {
      timeout: 3600 * 24 * 7 //有效期为一周
    });
  }
}
```

#### controller.session(name, value)

* `name` {String} session 名
* `value` {Mixed} session 值
* `return` {Promise}

读取、设置和清除 session。

```js
export default class extends think.controller.base {
  * indexAction(){
    //获取session
    let value = yield this.session('userInfo');
  }
}
```

```js
export default class extends think.controller.base {
  * indexAction(){
    //设置 session
    yield think.session('userInfo', data);
    //清除当前用户的 session
    yield think.session();
  }
}
```

#### controller.getLang(useCookie)

* `userCookie` {Boolean} 是否优先从 cookie 里获取
* `return` {String}

从 cookie 和 header 中获取 language。

#### controller.locale(key)

* `key` {String} 

根据 language 获取对应的语言文本。


#### controller.redirect(url, statusCode)

* `url` {String} 要跳转的 url
* `statusCode` {Number} 状态码，默认为 302

页面跳转。

#### controller.assign(name, value)

* `name` {String | Object} 变量名
* `value` {Mixed} 变量值

将变量赋值到模版中。

```js
export default class extends think.controller.base {
  indexAction(){
    //单个赋值
    this.assign('title', 'thinkjs');
    //批量赋值
    this.assign({
      name: 'xxx',
      desc: 'yyy'
    })
  }
}
```

#### controller.fetch(templateFile)

* `templateFile` {String} 模版文件地址
* `return` {Promise}

获取解析后的模版内容。

** 直接获取 ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // home/index_index.html
    let content = yield this.fetch();
  }
}
```

** 改变 action ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // home/index_detail.html
    let content = yield this.fetch('detail');
  }
}
```

** 改变 controller 和 action ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // home/user_detail.html
    let content = yield this.fetch('user/detail');
  }
}
```

** 改变 module, controller 和 action ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // admin/user_detail.html
    let content = yield this.fetch('admin/user/detail');
  }
}
```

** 改变文件后缀名 ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // home/index_detail.xml
    let content = yield this.fetch('detail.xml');
  }
}
```

** 获取绝对路径文件 ** 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  * indexAction(){
    // /home/xxx/aaa/bbb/c.html
    let content = yield this.fetch('/home/xxx/aaa/bbb/c.html');
  }
}
```

#### controller.display(templateFile)

* `templateFile` {String} 模版文件路径

输出模版内容到浏览器端。查找模版文件策略和`controller.fetch`相同。

#### controller.jsonp(data)

* `data` {Mixed} 要输出的内容

jsonp 的方法输出内容，获取 callback 名称安全过滤后输出。

```js
export default class extends think.controller.base {
  indexAction(){
    this.jsonp({name: 'thinkjs'});
    //writes
    'callback_fn_name({name: "thinkjs"})'
  }
}
```

#### controller.json(data)

* `data` {Mixed} 要输出的内容

json 的方式输出内容。

#### controller.status(status)

* `status` {Number} 状态码，默认为 404

设置状态码。

#### controller.deny(status)

* `status` {String} 状态码，默认为 403

拒绝当前请求。

#### controller.write(data, encoding)

* `data` {mixed} 要输出的内容
* `encoding` {String} 编码

输出内容

#### controller.end(data, encoding)

* `data` {mixed} 要输出的内容
* `encoding` {String} 编码

输出内容后结束当前请求。

#### controller.type(type, charset)

* `type` {String} Content-Type
* `charset` {Boolean} 是否自动追加 charset

设置 Content-Type。

#### controller.download(filePath, contentType, fileName)

* `filePath` {String} 下载文件的具体路径
* `content-Type` {String} Content-Type
* `fileName` {String} 报错的文件名

下载文件。

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.txt';
    //自动识别 Content-Type，保存的文件名为 a.txt
    this.download(filePath);
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    //自动识别 Content-Type，保存的文件名为 b.txt
    this.download(filePath, 'b.txt');
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    //指定 Content-Type 为 text/html，保存的文件名为 b.txt
    this.download(filePath, 'text/html', 'b.txt');
  }
}
```

#### controller.success(data, message)

* `data` {Mixed} 要输出的数据
* `message` {String} 追加的message

格式化输出一个正常的数据，一般是操作成功后输出。

```js
http.success({name: 'thinkjs'});
//writes
{
  errno: 0,
  errmsg: '',
  data: {
    name: 'thinkjs'
  }
}
```

这样客户端就可以根据`errno`是否为`0`为判断当前请求是否正常。

#### controller.fail(errno, errmsg, data)

* `errno` {Number} 错误号
* `errmsg` {String} 错误信息
* `data` {Mixed} 额外的数据

格式化输出一个异常的数据，一般是操作失败后输出。

`注`：字段名`errno`和`errmsg`可以在配置里进行修改。

```js
http.fail(100, 'fail')
//writes
{
  errno: 100,
  errmsg: 'fail',
  data: ''
}
```

这样客户端就可以拿到具体的错误号和错误信息，然后根据需要显示了。

`注`：字段名`errno`和`errmsg`可以在配置里进行修改。

#### controller.sendTime(name)

* `name` {String} header key

发送请求的执行时间，使用 header 的方式发出。


## rest controller

`think.controller.rest` 继承自 [think.controller.base](./api_controller.html)，用来处理 Rest 接口。

** 使用 ES6 的语法继承该类 **

```js
export default class extends think.controller.rest {
  
}
```

** 使用普通方式继承该类 **

```js
module.exports = think.controller('rest', {
  
})
```

### 属性

#### controller._isRest

标识此 controller 对应的是 Rest 接口。如果在 `init` 方法里将该属性设置为`false`，那么该 controller 不再是一个 Rest 接口。

#### controller._method

获取 method 方式。默认从 http method 中获取，但有些客户端不支持发送 delete, put 之类的请求，所以可以设置为从 GET 里的一个参数获取。

```js
export default class extends think.controller.rest {
  init(http){
    super.init(http);
    //设置 _method，表示从 GET 参数获取 _method 字段的值
    //如果没有取到，则从 http method 中获取
    this._method = '_method';
  }
}
```

#### controller.resource

当前 Rest 对应的 Resource 名称。

#### controller.id

资源 ID

#### controller.modelInstance

资源对应 model 的实例。


### 方法

#### controller.__before()

可以在魔术方法`__before`中进行字段过滤，分页，权限校验等功能。

```js
export default class extends think.controller.rest{
  __before(){
    //过滤 password 字段
    this.modelInstance.field('password', true);
  }
}
```

#### controller.getAction()

获取资源数据，如果有 id，拉取一条，否则拉取列表。

```js
//方法实现，可以根据需要修改
export default class extends think.controller.rest {
  * getAction(){
    let data;
    if (this.id) {
      let pk = yield this.modelInstance.getPk();
      data = yield this.modelInstance.where({[pk]: this.id}).find();
      return this.success(data);
    }
    data = yield this.modelInstance.select();
    return this.success(data);
  }
}
```

#### controller.postAction()

添加数据

```js
//方法实现，可以根据需要修改
export default class extends think.controller.rest {
  * postAction(){
    let pk = yield this.modelInstance.getPk();
    let data = this.post();
    delete data[pk];
    if(think.isEmpty(data)){
      return this.fail('data is empty');
    }
    let insertId = yield this.modelInstance.add(data);
    return this.success({id: insertId});
  }
}
```

#### controller.deleteAction()

删除数据

```js
//方法实现，可以根据需要修改
export default class extends think.controller.rest {
  * deleteAction(){
    if (!this.id) {
      return this.fail('params error');
    }
    let pk = yield this.modelInstance.getPk();
    let rows = yield this.modelInstance.where({[pk]: this.id}).delete();
    return this.success({affectedRows: rows});
  }
}
```

#### controller.putAction()

更新数据

```js
//方法实现，可以根据需要修改
export default class extends think.controller.rest {
  * putAction(){
    if (!this.id) {
      return this.fail('params error');
    }
    let pk = yield this.modelInstance.getPk();
    let data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    let rows = yield this.modelInstance.where({[pk]: this.id}).update(data);
    return this.success({affectedRows: rows});
  }
}
```

#### controller.__call()

找不到方法时调用

```js
export default class extends think.controller.rest {
  __call(){
    return this.fail(think.locale('ACTION_INVALID', this.http.action, this.http.url));
  }
}
```


## model

`think.model.base`继承自 [think.base](./api_think_base.html) 类。

** 使用 ES6 的语法继承该类 **

```js
export default class extends think.model.base {
  getList(){

  }
}
```

** 使用普通方式继承该类 **

```js
module.exports = think.model({
  getList: function(){

  }
})
```

### 属性

#### model.pk

数据表主键，默认为`id`。

#### model.name

模型名，默认从当前文件名中解析。

当前文件路径为 for/bar/app/home/model/user.js，那么解析的模型名为`user`。

#### model.tablePrefix

数据表名称前缀，默认为`think_`。

#### model.tableName

数据表名称，不包含前缀。默认等于模型名。

#### model.fields

数据表字段，默认自动从数据表分析。

#### model.indexes

数据表索引，默认自动从数据表分析。

#### model.readonlyFields

只读字段列表，数据更新时不会更新这些字段。

#### model.config

配置，实例化的时候指定。

#### model._db

连接数据库句柄。

#### model._data

操作的数据。

#### model._options

操作选项。

### 方法

#### model.model(name, options, module)

* `name` {String} 模型名称
* `options` {Object} 配置项
* `module` {String} 模块名
* `return` {Object}

获取模型实例，可以跨模块获取。

```js
export default class extends think.model.base {
  * getList(){
    //获取 user 模型实例
    let instance = this.model('user');
    let list = yield instance.select();
    let ids = list.map(item => {
      return item.id;
    });
    let data = yield this.where({id: ['IN', ids]}).select();
    return data;
  }
}
```

#### model.getConfigKey()

* `return` {String}

获取配置对应的 key，缓存 db 句柄时使用。

#### model.db()

* `return` {Object}

获取 db 实例，如果已经存在则直接返回。

#### model.getModelName()

* `return` {String} 模型名称

如果已经配置则直接返回，否则解析当前的文件名。

#### model.getTableName()

* `return` {String} 获取表名，包含表前缀

获取表名，包含表前缀。

#### model.cache(key, timeout)

* `key` {String}  缓存 key
* `timeout` {Number} 缓存有效时间，单位为秒
* `return` {this}

设置缓存选项。

** 设置缓存 key 和时间 **

```js
export default class extends think.model.base {
  getList(){
    return this.cache('getList', 1000).where({id: {'>': 100}}).select();
  }
}
```

** 只设置缓存时间，缓存 key 自动生成 **

```js
export default class extends think.model.base {
  getList(){
    return this.cache(1000).where({id: {'>': 100}}).select();
  }
}
```

** 设置更多的缓存信息 ** 

```js
export default class extends think.model.base {
  getList(){
    return this.cache({
      key: 'getList',
      timeout: 1000,
      type: 'file' //使用文件方式缓存
    }).where({id: {'>': 100}}).select();
  }
}
```

#### model.limit(offset, length)

* `offset` {Number} 设置查询的起始位置 
* `length` {Number} 设置查询的数据长度
* `return` {this}

设置查询结果的限制条件。

** 限制数据长度 **

```js
export default class extends think.model.base {
  getList(){
    //查询20条数据
    return this.limit(20).where({id: {'>': 100}}).select();
  }
}
```

** 限制数据起始位置和长度 **

```js
export default class extends think.model.base {
  getList(){
    //从起始位置100开始查询20调数据
    return this.limit(100, 20).where({id: {'>': 100}}).select();
  }
}
```

#### model.page(page, listRows)

* `page` {Number} 当前页，从 1 开始
* `listRows` {Number} 每页的条数
* `return` {this}

设置查询分页数据，自动转化为 `limit` 数据。

```js
export default class extends think.model.base {
  getList(){
    //查询第 2 页数据，每页 10 条数据
    return this.page(2, 10).where({id: {'>': 100}}).select();
  }
}
```

#### model.where(where)

* `where` {String | Object} where 条件
* `return` {this}

设置 where 查询条件。

#### model.field(field)

#### model.fieldReverse(field)

#### model.table(table, hasPrefix)

#### model.union(union, all)

#### model.join(join)

#### model.order(order)

#### model.alias(tableAlias)

#### model.having(having)

#### model.group(group)

#### model.lock(lock)

#### model.distinct(distinct)

#### model.explain(explain)

#### model._optionsFilter(options)

#### model._dataFilter(data)

#### model._beforeAdd(data)

#### model._afterAdd(data)

#### model._afterDelete(data)

#### model._beforeUpdate(data)

#### model._afterUpdate(data)

#### model._afterFind(data)

#### model._afterSelect(data)

#### model.data(data)

#### model.options(options)

#### model.close()



## MongoDB

## middleware

## Adapter