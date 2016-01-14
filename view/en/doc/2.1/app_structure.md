## Project Structure

After creating ThinkJS project, you will get the directory structure something like the following:


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

tips: Different mode used when creating the project, may result in the slightly different structure.

### nginx.conf

This is the nginx's configuration file. When deploy your project to the production environment, we recommend you using nginx as the reverse proxy.

### src

`src` folder holds all of the source files, but you can only have it by using `--es6` option when create prjects. After start project, the source files in `src/` will be compiled automatically into the `app/` folder with same name.

### src/common

You should place the common module files into this folder, the so-called common files used to store the code logic that could be used all around the project.

### src/common/bootstrap

Files in this folder will be autoload when project bootstrapping, so you don't need to `require` them manually. You can define global functions, register middlewares by using this folder.

#### Defining global functions


```js
// src/common/bootstrap/fn.js
global.formatDate = obj => {
  ...
}
```

We defined a global function `formatDate` here, you can call it anywhere in the project after define it here.

#### Register Middlewares


```js
// src/common/bootstrap/middleware.js
think.middleware('replace_image', http => {
  ...
});
```

We defined a middleware `replace_image` here, then you can register it in the configure file `hook.js`.

tips: bootstrap can only stay in common module.

### src/common/config

You can place the common config files here. Bear in mind, the route.js, hook.js and locale.js must stay within this folder.


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

Within this folder, you should put the common controller files. For example, the `error.js` has designed some different error handling behaviors, you can modify it or add other controller according to the project requirements.

### src/common/runtime

This is a temp folder to store for example cache files, upload files and other files at the runtime.

### src/home

`home` module is a default module for your project. You can change your default module to other directory by add `default_module` option and assign a value to it in `src/common/config/config.js`. 

### src/home/logic

Before every operation execution, it is possible to validate something in advance here, so as to decrease the complexity of the actions in the controllers. For example, we can validate whether the parameters meet the requirements, the input data are acceptability, or current user have the access to do something.

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

Controller folder. Each `url` has an matched `action` within the matched `controller`.

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

Models to handle database operations.

### view

The `view` folder used to store template files. If you need support i18n or multiple themes, you should create the sub-folders respectively.

### www

Our project's root which we have to access, nginx's configure root will be set here.

### www/index.js

Our project's entry file in development mode, it can be modified as the project's need. When in production environment, the entry file will be `www/production.js`.

The content of index.js is something like this:

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

Holding the static files.