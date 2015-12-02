## Project Structure

You get following document structure after creating project by using ThinkJS:


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

Tips: There has little difference using unequal mode when you create project.

### nginx.conf

nginx's configuration file, we recommend get proxy by nginx.

### src

It's source folder, after using `--es6` can you see it.  We need run `npm run watch-compile` to compile file to folder `app/`.

### src/common

Common module folder with common logic module.

### src/common/bootstrap

File in this folder will auto load, it's project boot's index folder. You can put some global method or middleware into it.

#### Global function


```js
// src/common/bootstrap/fn.js
global.formatDate = obj => {
  ...
}
```

You can run this method anywhere after defined here.

#### Middleware


```js
// src/common/bootstrap/middleware.js
think.middleware('replace_image', http => {
  ...
});
```

You can inject this middleware into configure file `hook.js`.

Tips: bootstrap just stay in common module.

### src/common/config

here you can set some common config file. router configure, hook configure and locale setting.


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

Controller folder to put all controller file. In this case `error.js`  is designed as handle different error behavior. It's also support custom by project.

### src/common/runtime

Temp folder to store cache file and temp file upload folder.

### src/home

`home` module is default module for your project. Now you can define your default module in `src/common/config/config.js`. 


### src/home/logic

It's logic handle method file. Every handle would run logic check before some handle button. It contains: parameters check, request data check, login check, auth check and so on. use this can decrease project's complexity.

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

Controller folder. every `url` has there own `action` in their `controller`.

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

Model to handle database.

### view

view folder to store template file. You should have sub folder while you will add support to internationalization and multiple theme.

### www

Project's root which we have access, nginx's configure root will set here.

### www/index.js

Project's root file in development, can modified in project.  `www/production.js` is root file in production environment.

following like this:

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

Save some static file.
