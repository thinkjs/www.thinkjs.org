## 创建项目

### 安装 Node.js

ThinkJS 是一款 Node.js 的 MVC 框架，所以安装 ThinkJS 之前，需要先安装 Node.js 环境。可以去官方

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

### 安装依赖

进入到项目目录下，执行`npm install`安装依赖。如果执行很慢，可以尝试使用`taobao`的源进行安装。

### 启动项目

在项目目录下