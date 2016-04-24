## Path Const

System provides many consts for project, and you can use them to access corresponding files conveniently.

### Builtin Path Consts

#### think.ROOT_PATH

The root of project.

#### think.RESOURCE_PATH

The root of static resources, path is `think.ROOT_PATH` + `/www/`.

#### think.APP_PATH

The directory of APP code, path is `think.ROOT_PATH` + `/app/`.

#### think.THINK_PATH

The root directory of ThinkJS framework.

#### think.THINK_LIB_PATH

ThinkJS framework `lib` directory.

#### think.getPath(module, type)

For the model,controller,view directory and so on, because each module has these directories, so we can't give a fixed path value. You can get path value of module by `think.getPath`.

```js
let path1 = think.getPath('common', 'model'); //get the directory of common module
let path2 = think.getPath('home', 'controller'); //get the directory of home module
```

### User-defined Path Consts

Besides the system properties and methods to get path, you can also define extra path consts in project.

#### Define in Entrance File

The entrance file of project is `src/index.js` or `src/production.js`, you can define path const in it. eg.

```js
var thinkjs = require('thinkjs');
var path = require('path');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  UPLOAD_PATH: __dirname + '/upload', // define the directory of file uploading 
  env: 'development'
});

instance.run();
```

#### Define in Startup File

The files defined in `src/common/bootstrap` will be loaded automatically, so you can also define path const in this file. eg.

```js
// src/common/bootstrap/common.js
think.UPLOAD_PATH = think.RESOURCE_PATH + '/upload'; // define the directory of file uploading 
```
