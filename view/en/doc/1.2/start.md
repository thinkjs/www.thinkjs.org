## 安装、创建项目

ThinkJS 需要 Node.js 的版本 `>=0.10.x`，可以通过 `node -v` 命令查看当前 node 的版本。如果未安装 node 或者版本过低，请到 [Node.js](http://nodejs.org/) 官网进行安装或升级。

使用 ThinkJS 时，假设你已经有了 Node.js 开发相关的经验。


### 安装 ThinkJS

安装 ThinkJS 非常简单，通过如下的命令即可安装：

```sh
npm install -g thinkjs-cmd
```

如果安装失败，可能是 npm 服务异常或者是被墙了，可以使用国内的 [cnpm](http://cnpmjs.org/) 服务进行安装。如：

```sh
npm install -g thinkjs-cmd --registry=http://r.cnpmjs.org
```

安装完成后，可以通过下面的命令查看 ThinkJS 的版本号：

```js
thinkjs -v
```

如果能看到下面的字符，说明已经安装成功了。

```
 v1.1.0

 _______ _     _       _        _  _____ 
|__   __| |   (_)     | |      | |/ ____|
   | |  | |__  _ _ __ | | __   | | (___  
   | |  | '_ \| |'_ \| |/ /   | |\___ \ 
   | |  | | | | | | | |   <|__| |____) |
   |_|  |_| |_|_|_| |_|_|\_\____/|_____/ 
                                         
```


### 更新 ThinkJS

更新 ThinkJS，分成 2 种，一种是更新系统的 ThinkJS 版本，更新后后续创建项目时使用新版的 ThinkJS。另一种是更新已有项目下的 ThinkJS 版本。

#### 更新系统的 ThinkJS

```
npm update -g thinkjs-cmd; // 在 *nix 下，需要加上 sudo 执行
```

#### 更新项目里的 ThinkJS

```
cd 项目目录;
npm update thinkjs;
```

### 新建项目

```sh
# 在合适的位置创建一个新目录，new_dir_name 为你想创建的文件夹名字
mkdir new_dir_name; 
# 进入这个目录
cd new_dir_name;
# 通过 thinkjs 命令创建项目
thinkjs .
```

执行后，如果当前环境有浏览器，会自动用浏览器打开 <http://127.0.0.1:8360>，并且会看到如下的内容：

```
hello, ThinkJS!
```

看到这个内容后，说明项目已经成功创建。


### 手动启动项目

创建项目时，会自动通过子进程来启动 node 服务。为了后续开发方便，最好还是手动来启动。

通过键盘操作 `ctrl + c` 结束当前的进程，cd 到 `www` 目录下，执行 `node index.js` 来启动服务。

`注：` 有些系统下用 apt-get 来安装 Node.js 的话，命令名可能为 nodejs。

### 项目结构说明
创建项目后，会生成如下的目录结构：

```
├── App
│   ├── Common
│   │   └── common.js    ---- 通用函数文件，一般将项目里的一些全局函数放在这里
│   ├── Conf
│   │   └── config.js    ---- 项目配置文件
│   ├── Lib
│   │   ├── Behavior     ---- 行为类存放位置
│   │   ├── Controller
│   │   │   └── Home
│   │   │       └── IndexController.js   ---- 逻辑控制类
│   │   └── Model        ---- 模型类
│   ├── Runtime          ---- 运行时的一些文件
│   │   ├── Cache        ---- 缓存目录
│   │   ├── Data         ---- 数据目录
│   │   ├── Log
│   │   └── Temp
│   └── View
│       └── Home
│           └── index_index.html      ---- 模版文件，默认使用 ejs 模版引擎
├── ctrl.sh              ---- 项目启动、停止脚本
└── www
    ├── index.js         ---- 入口文件
    └── resource         ---- 静态资源目录
        ├── css          ---- css 文件
        ├── img          ---- 图片文件
        ├── js           ---- js 文件
        ├── module       ---- 第三方的一些组件
        └── swf          ---- flash 文件
```


### 文件说明

下面对几个重要的文件进行简单的说明。

#### 入口文件

`www/index.js`

```js
// 定义 APP 的根目录
global.APP_PATH = __dirname + "/../App";
// 静态资源根目录
global.RESOURCE_PATH = __dirname;
global.ROOT_PATH = __dirname;
global.APP_DEBUG = true; // 是否开启 DEBUG 模式
require('thinkjs');
```

默认开启 debug 模式，该模式下文件修改后立即生效，不必重启 node 服务。

<div class="alert alert-warning">
    线上环境切记要将 debug 模式关闭，即：APP_DEBUG=false
</div>

debug 模式详细说明请见 [调试](/doc/debug.html) 里相关内容。

#### 配置文件

`App/Conf/config.js`

```js
module.exports = {
  // 配置项: 配置值
  port: 8360, // 监听的端口
  db_type: 'mysql', // 数据库类型
  db_host: 'localhost', // 服务器地址
  db_port: '', // 端口
  db_name: '', // 数据库名
  db_user: 'root', // 用户名
  db_pwd: '', // 密码
  db_prefix: 'think_', // 数据库表前缀
};
```

可以在配置文件中修改框架默认的配置值，如：将 http 监听的端口号由默认的 8360 改为 1234，那么这里加上 `"port": 1234`，重启服务后就生效了 (ps: 要把 url 中的端口号改为 1234 才能正常访问哦)。

框架默认的配置值请见 [附录 - 默认配置](/doc/appendix#appendix_config)

#### 函数文件

`App/Common/common.js`

该文件下定义一些当前应用常用的函数，可以直接放在 global 下，该文件在系统启动时自动加载。

```js
global.getDate = function(){return 'xxx';};
global.getSliceUrl = function(url, length){return '';}
```

这些函数在其他地方可以直接使用，无需在 require。


#### 控制器文件

`App/Lib/Controller/Home/IndexController.js`

```js
/**
 * controller
 * @return 
 */
module.exports = Controller({
  indexAction: function(){
    //render View/Home/index_index.html file
    this.display();
  };
});
```

该文件为一个基础的控制器文件，只有一个 indexAction，这个 action 直接渲染 `View/Home/index_index.html` 模版文件。

除了渲染文件，你可以直接输出字符串。可以将这里改为 `this.end('hello word')`，刷新浏览器后，显示为 hello word。

控制器详细内容请见 [控制器](./controller.html) 相关内容。
