## 快速入门

借助 ThinkJS 提供的脚手架，可以快速的创建一个项目。为了可以使用更多的 ES6 特性，框架要求 Node.js 的版本至少是 `6.x`，建议使用 [LTS 版本](https://nodejs.org/en/download/)。

### 安装 ThinkJS 命令


```sh
$ npm install -g think-cli
```

安装完成后，系统中会有 `thinkjs` 命令（可以通过 `thinkjs -v` 查看 think-cli 的版本号，此版本号非 thinkjs 的版本号）。如果找不到这个命令，请确认环境变量是否正确。

如果是从 `2.x` 升级，需要将之前的命令删除，然后重新安装。

### 卸载旧版本命名

```sh
$ npm uninstall -g thinkjs
```

### 创建项目

执行 `thinkjs new [project_name]` 来创建项目，如：

```
$ thinkjs new demo;
$ cd demo;
$ npm install; 
$ npm start; 
```

执行完成后，控制台下会看到类似下面的日志：

```
[2017-06-25 15:21:35.408] [INFO] - Server running at http://127.0.0.1:8360
[2017-06-25 15:21:35.412] [INFO] - ThinkJS version: 3.0.0-beta1
[2017-06-25 15:21:35.413] [INFO] - Enviroment: development
[2017-06-25 15:21:35.413] [INFO] - Workers: 8
```

打开浏览器访问 `http://127.0.0.1:8360/`，如果是在远程机器上创建的项目，需要把 IP 换成对应的地址。

### 项目结构

默认创建的项目结构如下：

```text
|--- development.js   //开发环境下的入口文件
|--- nginx.conf  //nginx 配置文件
|--- package.json
|--- pm2.json //pm2 配置文件
|--- production.js //生产环境下的入口文件
|--- README.md
|--- src
| |--- bootstrap  //启动自动执行目录 
| | |--- master.js //Master 进程下自动执行
| | |--- worker.js //Worker 进程下自动执行
| |--- config  //配置文件目录
| | |--- adapter.js  // adapter 配置文件 
| | |--- config.js  // 默认配置文件 
| | |--- config.production.js  //生产环境下的默认配置文件，和 config.js 合并 
| | |--- extend.js  //extend 配置文件 
| | |--- middleware.js //middleware 配置文件 
| | |--- router.js //自定义路由配置文件
| |--- controller  //控制器目录 
| | |--- base.js
| | |--- index.js
| |--- logic //logic 目录
| | |--- index.js
| |--- model //模型目录
| | |--- index.js
|--- view  //模板目录
| |--- index_index.html
|--- www
| |--- static  //静态资源目录
| | |--- css
| | |--- img
| | |--- js
```
