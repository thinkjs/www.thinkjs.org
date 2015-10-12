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