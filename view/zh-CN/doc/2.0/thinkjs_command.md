## Thinkjs Command

After installing thinkjs module globally, there should be the thinkjs command in your system. Run the command `thinkjs -h` in your terminal to get more detailed introduction.

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

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -e, --es6          use es6 for project, used in `new` command
    -r, --rest         create rest controller, used in `controller` command
    -M, --mongo        create mongo model, used in `model` command
    -R, --relation     create relation model, used in `model` command
    -m, --mode <mode>  project mode type(mini, normal, module), default is module, used in `new` command
```

### Create Project

You can create a project by the command `thinkjs new <projectPath>`. eg.

```sh
thinkjs new thinkjs_demo;
```

#### ES6 Mode

If you want to create an ES6 mode project, `--es6` option is required. Thus, codes in the generated files are all ES6 syntax. eg.

```sh
thinkjs new thinkjs_demo --es6
```

#### Set Project Mode

The default created project is divided by modules. If the project is small and you don't want to have it divided by modules,
you can specify `--mode` option when creating project. eg.

```sh
thinkjs new thinkjs_demo --mode=mini
```

The following is the supported module list:

* `mini`  single-module project, for a very simple project.
* `normal` genneral project, which modules are divided according to the function.
* `module` divided by modules, for large projects or the project strictly divided by modules.

`Note`: After the project created, a hidden file named `.thinkjsrc` will be created in the project directory, which identifies some configuration of the current project. And it will affect subsequent creating files, so you need to put it into the version repository.

### Add Module

The module `common` and `home` will be automatically created when creating project. If you need to create other modules, you can execute the command `thinkjs module [name]` in the project directory. eg. 

```sh
thinkjs module admin
```

After execution, there will create the directory `src/admin` and the corresponding files in that directory.

### Add Middleware

you can add middleware by the command `thinkjs middleware [name]` in the project directory. eg.

```sh
thinkjs middleware test;
```

After execution, there will create the file `src/common/middleware/test.js`.

### Add Model

You can add model by the command `thinkjs model [name]` in the project directory. eg.

```sh
thinkjs model user;
```

After execution, there will create the file `src/common/model/user.js`.

This file is in the `common` module by default. If you want to create it in other modules, just specify the module. eg.

```sh
thinkjs model home/user;
```

Thus, it will create the file `src/home/model/user.js`.

##### Add Mongo Model

By default, the model added is relational database model. If you want to create Mongo Model, specify `--mongo` option. eg.

```sh
thinkjs model home/user --mongo
```

##### Add Relation Model

Specify `--relation` option to create Relation Model. eg.

```sh
thinkjs model home/user --relation
```

### Add Controller

You can add controller by the command `thinkjs controller [name]` in the project directory. eg.

```sh
thinkjs controller user;
```

After execution, there will create the file `src/common/controller/user.js`, and the file `src/common/logic/user.js` will be also created at the same.

This created file is in the `common` module by default. If you want to create it in other modules, specify the module. eg.

```sh
thinkjs controller home/user;
```

Thus, the file `src/home/controller/user.js` will be created.

##### Add Rest Controller

If you want to privide Rest API, specify `--rest` option. eg.

```sh
thinkjs controller home/user --rest;
```


### Add service

You can add service by the command `thinkjs service [name]` in the project directory. eg.

```sh
thinkjs service github; #create the service that calls github interface 
```

After execution, there will create the file `src/common/service/github.js`.

This created file is in the `common` module by default. If you want to create it in other modules, specify the module. eg.

```sh
thinkjs service home/github;
```

Thus, the file `src/home/service/github.js` will be created.

### Add adapter

You can add adapter by the command `thinkjs adapter [type]/[name]` in the project directory. eg.

```sh
thinkjs adapter template/dot
```

After execution, there will create the file `src/common/adapter/template/dot.js`, which means a template type adapter named dot.


### Add Plugin

Two kinds of plugins ThinkJS supported are middleware and adapter. You can initialize a plugin by command `thinkjs plugin <pluginName>`, and then to develop.

```sh
thinkjs plugin think-template-dot
```

Suggested that the plugin name could start with `think-`, so that it is convenient to search for other users after the plugin release to npm repository.
