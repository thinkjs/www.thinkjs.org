## 升级指南

2.0 在架构和特性上都完全进行了重写，是个颠覆式的版本，所以无法直接从 `1.x` 升级到 `2.0` 版本的。 

### 与 1.x 版本差异

#### 项目结构

2.0 默认使用按模块进行项目结构划分的，与 1.x 在目录结构有一些差别。如果想 2.0 下使用类似 1.x 的项目结构，可以在创建项目的时候指定 `--mode=normal`。如：

```sh
thinkjs new demo --mode=normal
```

#### 文件大小写

1.x 里文件名使用驼峰的方式，如：`Controller/indexController.js`。2.0 里严格遵循 Node.js 社区的规范，文件路径使用小写的方式，并且文件名去除了类型，如：`controller/index.js`。

改变后文件名更加简洁，且不会出现有的系统下区分大小写的问题。

#### debug 模式

1.x 下开发环境需要开启 `debug` 模式，线上需要关闭 debug 模式，但经常会出现线上开启了 debug 模式，导致出现内存泄漏等问题。

2.0 废弃了 `debug` 模式，而是提供了 `development`，`testing` 和 `production` 3 种模式，分别在对应的环境下使用，创建项目时会创建对应的 3 个文件，这样在不同的环境下就可以使用不同的文件来启动项目了。

#### C 函数

1.x 里提供了 `C` 函数来读取配置，2.0 里废除了该函数，不同地方使用不同的方式来读取配置。

Controller，Middleware 等含有 `http` 对象的地方使用 `config` 方法来读取配置，其他等地方需要使用 `think.config` 方法来读取配置。

#### D 和 M 函数

1.x 里提供了 `D` 和 `M` 函数来实例化模型，2.0 里废除了这 2 个函数，不同的地方使用不同的方式来实例化模型。

Controller，Model，Middleware 等地方使用 `model` 方法来实例化模型，其他等地方使用 `think.model` 方法来实例化模型。

#### Controller，Model 函数

1.x 里提供了 `Controller` 来创建控制器类，`Model` 来创建模型类，2.0 里废除了这些函数。并提供了多种方式来创建类。

ES6 直接使用 `class extends think.model.base` 来创建一个模型类，非 ES6 下可以通过 `think.model` 来创建一个模型类，创建控制器类类似。

#### 其他全局函数

1.x 里直接提供了一些通用的全局函数，如：`md5`，`mkdir` 等，2.0 中将这些函数都移到了 `think` 对象上，如：`think.md5`，`think.mkdir`。

#### 自执行目录 common/

1.x 下 `common/` 下的文件会启动被调用，2.0 中将该目录名为 `bootstrap`，并且要在 `common` 模块下，如：`src/common/bootstrap`。

#### Behavior 和 Driver

2.0 将 Behavior 改为了 middleware，Driver 改为了 adapter。

#### 线上部署

1.x 版本下提供了简单的脚本 `ctrl.sh` 来管理当前 Node.js 服务，2.0 里废弃了该文件，建议使用 `pm2` 来管理，并且提供了 pm2 的配置文件 `pm2.json`，线上通过 `pm2 start pm2.json` 即可启动服务。
