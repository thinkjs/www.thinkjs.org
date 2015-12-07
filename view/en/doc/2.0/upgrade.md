## Upgrade Guide

You can't update `1.x` version of your ThinkJS project to `2.x` directly.

### Difference with Version 1.x

#### Project Structure

Version 2.0 makes up of modules by default which is difference with version 1.x. If you want to use the structure of version 1.x in version 2.0, you should specify `--mode=normal` like following:

```sh
thinkjs new demo --mode=normal
```
#### Filenames Case Sensitivity

In old versions, the filenames was camel-cased, and include file-type, such as `Controller/indexController.js`. Version 2.0 was build strictly based on the rule of Node.js community that all filenames and paths are lower-case and cut out file-type, so you can see such as `controller/index.js`. This new change makes filenames simple and easy to use in all platform.

#### Debug Mode

With version 1.x, you need start `debug` mode in development environment and stop it in production environment. This can result in memory leaks because most people often forget do it in deploy process.

The `debug` mode was deprecated in version 2.x. The new version supports three modes: `development`, `testing` and `production`. Each mode has their own folder, you can start your project with different environment by using different folder.

#### C Method

The `C` method that used to get your configuration infomation in version 1.x was deprecated in version 2.0. In vesion 2.0, you read configuration infomation that in different places by using different methods.

In places that can acess `http` object such as Controller, Middleware, you can use `config` method to get configuration information, in other places you should use `think.config` method.

#### D and M Methods

There were `D` and `M` methods to instantiate your model in verion 1.x. But in version 2.0 they are deprecated, you need instantiate your model in different places by using different methods.

In Controller, Model, Middleware, you can use `model` method for instantiating. In other places you should use `think.model` method.

#### Control and Model Methods

There were `Controller` and `Model` methods could be used to create controllers and models in version 1.x. But in this new version, they both are deprecated. Instead of using these methods, we support various ways to instantiate classes.

You can use ES6 grammar `class extends think.model.base` to instantiate a model, and to instantiate a controller is same.

#### Other Global Methods

Version 1.x supports some common global methods such as `md5`, `mkdir`. All that was moved to `think` object since verion 2.0, so you can use `think.md5`, `think.mkdir` correspondingly.

#### Auto Run Directory `common/`

In version 1.x, there is a directory `common/`, the files within it will be auto called. In version 2.x, that directory has renamed to `bootstrap/`, and must be placed in the `common` module directory, like `src/common/bootstrap`.

#### Behavior and Driver

Version 2.0 changed Behavior and Driver to middleware and adapter.

#### Deploy Online

Version 1.0 provided a simple bash file named `ctrl.sh` for us to manage the Node.js services. But with version 2.0, we removed it and advice you take pm2 to replace it. We provide a default pm2's config file named `pm2.json`, so you can run `pm2 start pm2.json` to start service.
