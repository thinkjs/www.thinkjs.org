## 创建项目

### 安装 Node.js

ThinkJS 是一款 Node.js 的 MVC 框架，所以安装 ThinkJS 之前，需要先安装 Node.js 环境，可以去 [官方](https://nodejs.org/) 下载最新的安装包进行安装，也可以通过其他一些渠道安装。

安装完成后，在命令行执行 `node -v`，如果能看到对应的版本号输出，则表示安装成功。

ThinkJS 需要 Node.js 的版本 `>=0.12.0`，如果版本小于这个版本，需要升级 Node.js，否则无法启动服务。建议将 Node.js 版本升级到 `4.2.1`。

### 安装 ThinkJS

通过下面的命令即可安装 ThinkJS：

```sh
npm install thinkjs@2 -g --verbose
```

如果安装很慢的话，可以尝试使用 [taobao](http://npm.taobao.org/) 的源进行安装。具体如下：

```sh
npm install thinkjs@2 -g --registry=https://registry.npm.taobao.org --verbose
```

安装完成后，可以通过 `thinkjs --version` 或 `thinkjs -V` 命令查看安装的版本。

`注`：如果之前安装过 ThinkJS 1.x 的版本，可能需要将之前的版本删除掉，可以通过 `npm uninstall -g thinkjs-cmd` 命令删除。


### 创建项目

ThinkJS 安装完成后，就可以通过下面的命令创建项目:

```sh
thinkjs new project_path; #project_path为项目存放的目录
```

如果想用`ES6`特性来开发项目的话，可以创建一个`ES6`模式的项目，具体如下：

```sh
thinkjs new project_path --es6; #project_path为项目存放的目录
```

如果能看见类似下面的输出，表示项目创建成功了：

```text
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

You can go to [extension function -> ThinkJS command](./thinkjs_command.html) to know more about command of create project.

### Install dependencies

After project creaton, go to project directory and run `npm install` to install dependencies.

```sh
npm install
```

### Compile project

if you use `--es6` in the creation command, your code must be compiled before running. Run `npm run watch-compile` command and then they will be automatic compiled after modifiled.

This command will run on terminal permanently, don't fish this command! You can task a new tab to do other things.

### Start project

Run `npm start`, if terminal returns output like following, it means the service run success.

```text
[2015-09-21 20:21:09] [THINK] Server running at http://127.0.0.1:8360/
[2015-09-21 20:21:09] [THINK] ThinkJS Version: 2.0.0
[2015-09-21 20:21:09] [THINK] Cluster Status: closed
[2015-09-21 20:21:09] [THINK] WebSocket Status: closed
[2015-09-21 20:21:09] [THINK] File Auto Reload: true
[2015-09-21 20:21:09] [THINK] App Enviroment: development
```

### Access project

Open your browser and go to `http://127.0.0.1:8360`, then you can see it. If you are in remote machine, you need visit by remote machine's IP and the sanme 8360 port.