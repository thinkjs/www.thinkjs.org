## 创建项目

### 安装 Node.js

ThinkJS 是一款 Node.js 的 MVC 框架，所以安装 ThinkJS 之前，需要先安装 Node.js 环境，可以去 [官方](https://nodejs.org/) 下载最新的安装包进行安装，也可以通过其他一些渠道安装。

安装完成后，在命令行执行 `node -v`，如果能看到对应的版本号输出，则表示安装成功。

ThinkJS 需要 Node.js 的版本 `>=0.12.0`，如果版本小于这个版本，需要升级 Node.js，否则无法启动服务。建议将 Node.js 版本升级到 `4.2.1` 或更高版本。

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

### 更新 ThinkJS

#### 更新全局的 ThinkJS

执行下面的命令即可更新全局的 ThinkJS：

```sh
npm install -g thinkjs@2
```

#### 更新项目里的 ThinkJS

在项目目录下，执行下面的命令即可更新当前项目的 ThinkJS：

```sh
npm install thinkjs@2
```

### 使用命令创建项目

ThinkJS 安装完成后，就可以通过下面的命令创建项目:

```sh
thinkjs new project_path; #project_path为项目存放的目录
```

`注`： 从 `2.2.12` 版本开始，创建的项目默认为 ES6 模式，不再需要加 `--es` 参数, 如果想创建一个 ES5 模式项目，需要加参数 `--es5`。


如果能看见类似下面的输出(下面截图里的demo就是上面的project_path)，表示项目创建成功了：

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

关于创建项目命令的更多信息，请见 [扩展功能 -> ThinkJS 命令](./thinkjs_command.html)。

### 安装依赖

项目安装后，进入项目目录，执行 `npm install` 安装依赖，可以使用 `taobao` 源进行安装。

```sh
npm install --registry=https://registry.npm.taobao.org --verbose
```


### 启动项目

在项目目录下执行命令 `npm start`，如果能看到类似下面的内容，表示服务启动成功。

```text
[2015-09-21 20:21:09] [THINK] Server running at http://127.0.0.1:8360/
[2015-09-21 20:21:09] [THINK] ThinkJS Version: 2.0.0
[2015-09-21 20:21:09] [THINK] Cluster Status: closed
[2015-09-21 20:21:09] [THINK] WebSocket Status: closed
[2015-09-21 20:21:09] [THINK] File Auto Reload: true
[2015-09-21 20:21:09] [THINK] App Enviroment: development
```

### 访问项目

打开浏览器，访问`http://127.0.0.1:8360/`即可。

如果是在远程机器，需要通过远程机器的 IP 访问，同时要保证 8360 端口可访问。
