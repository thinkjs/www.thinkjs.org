## 升级指南

本文档为 2.x 升级到 3.x 的文档，由于本次升级接口改动较大，所以无法平滑升级。本文档更多的是介绍接口变化指南。

### 变化列表
#### 核心变化

3.0 抛弃了 2.x 的核心架构，基于 Koa 2.x 版本构建，兼容 Koa 里的所有功能。主要变化为：

* 之前的 `http` 对象改为 `ctx` 对象
* 执行完全改为调用 `middleware` 来完成
* 框架内置的很多功能不再默认内置，可以通过扩展来支持

#### 项目启动

2.x 中项目启动时，会自动加载 `src/bootstrap/` 目录下的所有文件。3.0 中不再自动加载所有的文件，而是改为：

* 在 Master 进程中加载 `src/boostrap/master.js` 文件
* 在 Worker 进程中加载 `src/boostrap/worker.js` 文件

如果还要加载其他的文件，那么可以在对应的文件中使用 `require` 方式引入进去。

#### 配置

2.x 中会自动加载 `src/config/` 目录下的所有文件，3.0 中改为根据功能加载对应的文件。

#### hook 和 middleware

移除 2.x 里的 hook 和 middleware，改为 Koa 里的 middleware，middleware 的管理放在 `src/config/middleware.js` 配置文件中。

2.x 下的 middleware 类无法在 3.0 下使用，3.0 下可以直接使用 Koa 的 middleware。

#### Controller

将基类 `think.controller.base` 改为 `think.Controller`，并移除 `think.controller.rest` 类。

#### Model

将基类 `think.model.base` 改为 `think.Model`。


### 升级建议

由于 3.0 改动了很多东西，所以不太容易基于原有项目代码简单修改来升级。建议使用新的脚手架工具创建项目，然后一一将之前的代码拷贝到新项目中进行修改。

