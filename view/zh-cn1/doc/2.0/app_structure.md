## 项目结构

通过 thinkjs 命令创建完项目后，项目目录结构类似如下：

```text
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
   |   |   |   |   `-- zh-cn.js
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
   |   `-- zh-cn
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

`注`：指定不同的模式创建的项目目录机构可能有细微的差别，但总体是类似的。

### nginx.conf

nginx 的配置文件，建议线上使用 nginx 做反向代理。

### src

源代码目录，使用 `--es6` 参数创建项目才有该目录。项目启动时会自动将 `src` 目录下的文件编译到 `app` 目录下。

如果没有使用 ES6 特性创建项目，则直接有 `app/` 目录。

### src/common

通用模块目录，项目目录都是按模块来划分的，`common` 模块下存放一些通用的处理逻辑。

### src/common/bootstrap

项目启动目录，该目录下的文件会自动加载，无需手动 `require` 。

可以在这个目录下文件里定义一些全局函数、注册中间件等常用的功能。

##### 定义全局函数

```js
// src/common/bootstrap/fn.js
global.formatDate = obj => {
  ...
}
```

这里定义了一个全局函数 `formatDate`，那么项目里任何地方都可以直接使用该函数。

##### 注册中间件

```js
// src/common/bootstrap/middleware.js
think.middleware('replace_image', http => {
  ...
});
```

这里定义了一个中间件 `replace_image`，那么就可以在配置文件 `hook.js` 里将该中间件注册进去了。

`注`：bootstrap 只能放在 common 模块里。

### src/common/config

配置文件，这里放一些通用的配置。

其中：路由配置、hook 配置、本地化配置等必须放在这里。

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

### www/development.js

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

instance.compile({retainLines: true, log: true});

instance.run();
```

### www/static

存放一些静态资源文件。
