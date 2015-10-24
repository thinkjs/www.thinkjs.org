## 路径常量

系统提供了很多常量供项目里使用，利用这些常量可以方便的访问对应的文件。

### think.ROOT_PATH

项目的根目录。

### think.RESOURCE_PATH

静态资源根目录，路径为 `think.ROOT_PATH` + `/www/`。

### think.APP_PATH

APP 代码目录，路径为 `think.ROOT_PATH` + `/app/`。

### think.THINK_PATH

ThinkJS 框架的根目录。

### think.THINK_LIB_PATH

ThinkJS 框架 `lib` 目录。

### think.getPath(module, type)

对于 model，controller，view 等目录，由于每个模块下都有这些目录，所以无法给出一个固定的路径值。可以通过 `think.getPath` 来获取模块下的路径。

```js
let path1 = think.getPath('common', 'model'); //获取 common 下 model 的目录
let path2 = think.getPath('home', 'controller'); //获取 home 模块下 controller 的目录
```

### 自定义路径常量

除了通过系统给的属性或者方法来获取路径，还可以在项目里定义额外的路径常量。

##### 入口文件里定义

项目的入口文件为 `src/index.js` 或者 `src/production.js` 等，可以在这些入口文件里定义一些路径常量。如：

```js
var thinkjs = require('thinkjs');
var path = require('path');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  UPLOAD_PATH: __dirname + '/upload', // 定义文件上传的目录
  env: 'development'
});

instance.run();
```

##### 启动文件里定义

定义在 `src/common/bootstrap` 里的文件在项目启动时会自动加载，所以也可以在这些文件里定义路径常量。如：

```js
// src/common/bootstrap/common.js
think.UPLOAD_PATH = think.RESOURCE_PATH + '/upload'; //定义文件上传的目录
```