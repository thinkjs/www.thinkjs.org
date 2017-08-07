## 关系数据库

### 介绍

在项目开发中，经常需要操作数据库（如：增删改查等功能）。

### 扩展模型功能

框架默认没有提供模型的功能，需要加载对应的扩展才能支持，对应的模块为 [think-model](https://github.com/thinkjs/think-model)。修改扩展的配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加如下的配置：

```js
const model = require('think-model');

module.exports = [
  model(think.app) // 让框架支持模型的功能
]
```

添加模型的扩展后，会添加如下的方法：

#### think.Model

模型的基类，项目中的模型类都要继承该类

```js
// src/model/user.js
module.exports = class extends think.Model {
  getList() {
    return this.field('name').select();
  }
}
```
#### think.model

实例化模型类。

项目启动时，会扫描项目下的所有模型文件（目录为 `src/model/`，多模块项目下目录为 `src/common/model` 以及各种 `src/[module]/model`），扫描后会将所有的模型类存放在 `think.app.models` 对象上，实例化时会从这个对象上查找，如果找不到则报错。

```js
think.model('user'); // 获取模型的实例
think.model('user', 'sqlite'); // 获取模型的实例，修改数据库的类型
think.model('user', { // 获取模型的实例，修改类型并添加其他的参数
  type: 'sqlite',
  aaa: 'bbb'
}); 
think.model('user', {}, 'admin'); // 获取模型的实例，指定为 admin 模块（多模块项目下有效）
```
#### ctx.model

实例化模型类，获取配置后调用 `think.model` 方法，多模块项目下会获取当前模块下的配置。

```js
const user = ctx.model('user');
```

#### controller.model

实例化模型类，获取配置后调用 `think.model` 方法，多模块项目下会获取当前模块下的配置。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.model('user'); // controller 里实例化模型
    const data = await user.select();
    return this.success(data);
  }
}
```

#### service.model

实例化模型类，等同于 `think.model`

### 配置数据库

模型由于要支持多种数据库，所以配置文件的格式为 Adapter 的方式，文件路径为 `src/config/adapter.js`（多模块项目下为 `src/common/config/adapter.js`）。

```js
const mysql = require('think-model-mysql');
exports.model = {
  type: 'mysql',
  common: {
    logSql: true,
    logConnect: true
  },
  mysql: {
    handle: mysql,
    user: 'root',
    password: 'root',
    database: 'thinkjs',
    port: 3306
  }
}
```

#### Mysql

#### SQLite

#### PostgreSQL

### 创建模型文件

模型文件放在 `src/model/` 目录下（多模块项目为 `src/common/model` 以及 `src/[module]/model`），文件格式为：

```js
module.exports = class extends think.Model {
  getList() {
    return this.field('name').select();
  }
}
```

### CRUD 操作

#### 查询数据
#### 添加数据
#### 更新数据
#### 删除数据
#### 手动执行 SQL 语句

### 事务
#### 手工操作事务
#### transaction

### 关联查询

#### 一对一
#### 一对一（属于）
#### 一对多
#### 多对多

### 分布式/读写分离

### API