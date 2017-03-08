## thinkjs 命令

以全局模式安装 thinkjs 模块后，系统下就会有 thinkjs 命令，在终端执行 `thinkjs -h` 可以看到详细介绍。

```text
  Usage: thinkjs [command] <options ...>


  Commands:

    new <projectPath>            create project
    module <moduleName>          add module
    controller <controllerName>  add controller
    service <serviceName>        add service
    model <modelName>            add model
    middleware <middlewareName>  add middleware
    adapter <adapterName>        add adapter
    plugin <pluginPath>          create ThinkJS plugin

  Options:

    -h, --help         output usage information
    -v, --version      output the version number
    -V                 output the version number
    -t, --ts           use TypeScript for project, used in `new` command
    -T, --test         add test dirs when create project, used in `new` command
    -r, --rest         create rest controller, used in `controller` command
    -M, --mongo        create mongo model, used in `model` command
    -R, --relation     create relation model, used in `model` command
    -m, --mode <mode>  project mode type(normal, module), default is module, used in `new` command
```

### 创建项目

创建项目可以通过 `thinkjs new <projectPath>` 来执行，如：

```sh
thinkjs new thinkjs_demo
```

#### 创建 ES6/7 项目

如果想使用 ES6/7 特性开发项目，那么创建项目时需要加上 `--es` 参数，这样生成文件的代码都是 ES6/7 语法的。如：

```sh
thinkjs new thinkjs_demo --es
```

#### 创建 TypeScript 项目

如果想使用 TypeScript 来开发项目，那么创建项目时需要加上 `--ts` 参数，这样生成文件的代码都是 TypeScript 语法的。如：

```sh
thinkjs new thinkjs_demo --ts
```

`注`：TypeScript 项目文件后缀都是 `.ts`。

#### 设置项目模式

默认创建的项目是按模块来划分的。如果项目比较小，不想按模块来划分的话，可以创建项目时指定 `--mode` 参数。如：

```sh
thinkjs new thinkjs_demo --mode=normal
```

支持的模式列表如下：

* `normal` 普通项目，模块在功能下划分。
* `module` 按模块划分，大型项目或者想严格按模块划分的项目。

`注`：创建项目后，会在项目下创建一个名为 `.thinkjsrc` 的隐藏文件，里面标识了当前项目的一些配置，该配置会影响后续创建文件，所以需要将该文件需要纳入到版本库中。

### 添加模块

创建项目时会自动创建模块 `common` 和 `home`，如果还需要创建其他的模块，可以在项目目录下通过 `thinkjs module [name]` 命令来创建。如：

```sh
thinkjs module admin
```

执行完成后，会创建目录 `src/admin`，以及在该目录下创建对应的文件。

### 添加 middleware

可以在项目目录下通过 `thinkjs middleware [name]` 命令来添加 middleware。如：

```sh
thinkjs middleware test;
```

执行完成后，会创建 `src/common/middleware/test.js` 文件。

### 添加 model

可以在项目目录下通过 `thinkjs model [name]` 命令来添加 model。如：

```sh
thinkjs model user;
```

执行完成后，会创建 `src/common/model/user.js` 文件。

默认会在 `common` 模块下创建，如果想在其他模块下创建，可以通过指定模块创建。如：

```sh
thinkjs model home/user;
```

指定模块为 `home` 后，会创建 `src/home/model/user.js` 文件。

##### 添加 Mongo Model

默认添加的 Model 是关系数据库的模型，如果想创建 Mongo Model，可以通过指定 `--mongo` 参数来添加。如：

```sh
thinkjs model home/user --mongo
```

##### 添加 Relation Model

添加关联模型可以通过指定 `--relation` 参数。如：

```sh
thinkjs model home/user --relation
```

### 添加 controller

可以在项目目录下通过 `thinkjs controller [name]` 命令来添加 controller。如：

```sh
thinkjs controller user;
```

执行完成后，会创建 `src/common/controller/user.js` 文件，同时会创建 `src/common/logic/user.js` 文件。

默认会在 `common` 模块下创建，如果想在其他模块下创建，可以通过指定模块创建。如：

```sh
thinkjs controller home/user;
```

指定模块为 `home` 后，会创建 `src/home/controller/user.js` 文件。

##### 添加 Rest Controller

如果想提供 Rest API，可以带上 `--rest` 参数来创建。如：

```sh
thinkjs controller home/user --rest;
```


### 添加 service

可以在项目目录下通过 `thinkjs service [name]` 命令来添加 service。如：

```sh
thinkjs service github; #创建调用 github 接口的 service
```

执行完成后，会创建 `src/common/service/github.js` 文件。

默认会在 `common` 模块下创建，如果想在其他模块下创建，可以通过指定模块创建。如：

```sh
thinkjs service home/github;
```

指定模块为 `home` 后，会创建 `src/home/service/github.js` 文件。


### 添加 adapter

可以通过 `thinkjs adapter [type]/[name]` 来创建 adapter。如：

```sh
thinkjs adapter template/dot
```

执行后会创建文件 `src/common/adapter/template/dot.js`，表示创建一个名为 dot 的模版类型 adapter。

### 创建 plugin

ThinkJS 支持 middleware 和 adapter 2 种插件，可以通过 `thinkjs plugin <pluginName>` 来初始化一个插件，然后进行开发。

```sh
thinkjs plugin think-template-dot
```

插件名称建议使用 `think-` 打头，这样发布到 npm 仓库后，方便其他用户搜索。

