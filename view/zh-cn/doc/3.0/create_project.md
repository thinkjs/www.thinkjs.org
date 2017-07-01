## 快速入门

借助 ThinkJS 提供的脚手架，可以快速的创建一个项目。为了可以使用更多的 ES6 特性，框架要求 Node.js 的版本至少是 `6.x`，建议使用 [LTS 版本](https://nodejs.org/en/download/)。

### 安装 ThinkJS 命令


```sh
$ npm install -g think-cli
```

安装完成后，系统中会有 `thinkjs` 命令（可以通过 thinkjs -v 查看版本号）。如果找不到这个命令，请确认环境变量是否正确。

如果是从 `2.x` 升级，需要将之前的命令删除，然后重新安装。

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

打开浏览器访问 `http://127.0.0.1:8360` 来访问，如果是在远程机器上创建的项目，需要把 127.0.0.1 换成对应的 IP 地址来访问。

