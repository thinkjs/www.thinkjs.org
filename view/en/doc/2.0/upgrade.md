## Upgrade Guide

You can't update your `1.x` version project to `2.x` directly because the new version is subversive that was rebuild from structure to feature.

### Difference with old version 1.x

#### Project structure

2.0 version makes up of module which is difference with 1.x version. If you want to use old version project structure in 2.0 version, you would specific `--mode=normal` like following:

```sh
thinkjs new demo --mode=normal
```
#### Filename sensitive

The old version's filename type was camel casing, such as `Controller/indexController.js`. 2.0 version was based on the community rule of Node.js that all filename path is lowercase and remove file type, such as `controller/index.js`. This new change makes filename simple and easy to use in all platform os.

#### Debug mode

You need start `debug` mode in development and stop it in production with 1.x version. It can make memory leaks easily because most people often forget do it in production.

The `debug` mode was deprecated in 2.x version. The new version supports `development`, `testing` and `production` three mode. Every mode has their own folder, you can start your project with different environment by using different folder.

#### C method

There has `C` method to get your configure in 1.x version. But in new version it's deprecated, you need read your configure in different position by different method.

You can use `config` method to get configuration where has `http` object such as Controller, Middleware, in other place you should use `think.config` method.

#### D and M method

There has `D` and `M` method to instance your model in 1.x version. But in new version they are deprecated, you need instance your model in different position by different method.

You can use `model` method to instance in Controller, Model, Middleware and so on, in other place you should use `think.model` method.

#### Control and Model method

There has `Controller` method to create controller and `Model` to create model in 1.x version. But in new version they are deprecated and we support various ways to instance class.

You can use `class extends think.model.base` to instance a model with ES6 grammar, with old grammar you should use `think.model` method. Instance controller is same as model.

#### Other global method

1.x version supports some common global method such as `md5`, `mkdir`. All that was moved to `think` object in 2.x version, you can use like `think.md5`, `think.mkdir`.

#### Auto run directory common/

2.x version change the folder's name from `common/` to `bootstrap/` which will auto run in program. And it's moved into `common` module like `src/common/bootstrap`.

#### Behavior and Driver

2.0 version change Behavior, Driver to middleware and adapter.

#### Deploy online

We apply a simple bash file named `ctrl.sh`  to manage your Node.js service. But we removed it and advice you take pm2 replace it. We apply a default pm2's config file named `pm2.json` that you can run `pm2 start pm2.json` to start service.
