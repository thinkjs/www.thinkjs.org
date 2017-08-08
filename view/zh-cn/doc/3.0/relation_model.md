## 关系数据库

### 介绍

在项目开发中，经常需要操作数据库（如：增删改查等功能），同时还要注意 SQL 注入等安全问题。为此框架提供了模型功能，方便操作数据库。

### 扩展模型功能

框架默认没有提供模型的功能，需要加载对应的扩展才能支持，对应的模块为 [think-model](https://github.com/thinkjs/think-model)。修改扩展的配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加如下的配置：

```js
const model = require('think-model');

module.exports = [
  model(think.app) // 让框架支持模型的功能
]
```

添加模型的扩展后，会添加方法 [think.Model](/doc/3.0/relation_model.html#toc-c4c)、[think.model](/doc/3.0/relation_model.html#toc-3f0)、[ctx.model](/doc/3.0/relation_model.html#toc-876)、[controller.model](/doc/3.0/relation_model.html#toc-7ff)、[service.model](/doc/3.0/relation_model.html#toc-af8)。


### 配置数据库

模型由于要支持多种数据库，所以配置文件的格式为 Adapter 的方式，文件路径为 `src/config/adapter.js`（多模块项目下为 `src/common/config/adapter.js`）。

```js
const mysql = require('think-model-mysql');
exports.model = {
  type: 'mysql', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logSql: true, // 是否打印 SQL 语句
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mysql: { // mysql 配置
    handle: mysql
  },
  mysql2: { // 另一个 mysql 的配置
    handle: mysql
  },
  sqlite: {  // sqlite 配置

  },
  postgresql: { // postgresql 配置

  }
}
```

如果项目里要用到同一个类型的多个数据库配置，那么可以通过不同的 type 区分，如：`mysql`，`mysql2`，调用时可以指定参数切换。

```js
const user1 = think.model('user'); // 使用默认的数据库配置，默认的 type 为 mysql，那么就是使用 mysql 的配置
const user2 = think.model('user', 'mysql2'); // 使用 mysql2 的配置
const user3 = think.model('user', 'sqlite'); // 使用 sqlite 的配置
const user4 = think.model('user', 'postgresql'); // 使用 postgresql 的配置
```

由于可以调用时指定使用哪个 `type`，理论上可以支持无限多的类型配置，项目中可以根据需要进行配置。

#### Mysql

Mysql 的 Adapter 为 [think-model-mysql](https://github.com/thinkjs/think-model-mysql)，底层基于 [mysql](https://github.com/mysqljs/mysql) 库实现，使用连接池的方式连接数据库，默认连接数为 1。

```js
const mysql = require('think-model-mysql');
exports.model = {
  type: 'mysql',
  mysql: {
    handle: mysql, // Adapter handle
    user: 'root', // 用户名
    password: '', // 密码
    database: '', // 数据库
    host: '127.0.0.1', // host 
    port: 3306, // 端口
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    prefix: '', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  }
}
```

除了用 host 和 port 连接数据库外，也可以通过 `socketPath` 来连接，更多配置选项请见 <https://github.com/mysqljs/mysql#connection-options>

#### SQLite

#### PostgreSQL

#### 其他

### 创建模型文件

模型文件放在 `src/model/` 目录下（多模块项目为 `src/common/model` 以及 `src/[module]/model`），继承模型基类 `think.Model`，文件格式为：

```js
// src/model/user.js
module.exports = class extends think.Model {
  getList() {
    return this.field('name').select();
  }
}
```
也可以在项目根目录下通过 `thinkjs model modelName` 快速创建模型文件。

------

如果项目比较复杂，希望对模型文件分目录管理，那么可以在模型目录下建立子目录，如： `src/model/front/user.js`，`src/model/admin/user.js`，这样在模型目录下建立 `front` 和 `admin` 目录，分别管理前台和后台的模型文件。

含有子目录的模型实例化需要带上子目录，如：`think.model('front/user')`，具体见[这里](/doc/3.0/relation_model.html#toc-9d9)。

### 实例化模型

项目启动时，会扫描项目下的所有模型文件（目录为 `src/model/`，多模块项目下目录为 `src/common/model` 以及各种 `src/[module]/model`），扫描后会将所有的模型类存放在 `think.app.models` 对象上，实例化时会从这个对象上查找，如果找不到则实例化模型基类 `think.Model`。

#### think.model

实例化模型类。

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

#### 含有子目录的模型实例化

如果模型目录下含有子目录，那么实例化时需要带上对应的子目录，如：

```js
const user1 = think.model('front/user'); // 实例化前台的 user 模型
const user2 = think.model('admin/user'); // 实例化后台的 user 模型
```

### CRUD 操作

`think.Model` 基类提供了丰富的方法进行 CRUD 操作，下面来一一介绍。

#### 查询数据

模型提供了多种方法来查询数据，如:

* [find](/doc/3.0/relation_model.html#toc-a74) 查询单条数据
* [select](/doc/3.0/relation_model.html#toc-3ad) 查询多条数据
* [count](/doc/3.0/relation_model.html#toc-274) 查询总条数
* [countSelect](/doc/3.0/relation_model.html#toc-a39) 分页查询数据
* [max](/doc/3.0/relation_model.html#toc-df2) 查询字段的最大值
* [avg](/doc/3.0/relation_model.html#toc-8d2) 查询字段的平均值
* [min](/doc/3.0/relation_model.html#toc-1d7) 查询字段的最小值
* [sum](/doc/3.0/relation_model.html#toc-c11) 对字段值进行求和
* [getField](/doc/3.0/relation_model.html#toc-f0a) 查询指定字段的值

同时模型支持通过下面的方法指定 SQL 语句中的特定条件，如：

* [where](/doc/3.0/relation_model.html#toc-d47) 指定 SQL 语句中的 where 条件
* [limit](/doc/3.0/relation_model.html#toc-47d) / [page](/doc/3.0/relation_model.html#toc-a43) 指定 SQL 语句中的 limit
* [field](/doc/3.0/relation_model.html#toc-68b) / [fieldReverse](/doc/3.0/relation_model.html#toc-ad6) 指定 SQL 语句中的 field
* [order](/doc/3.0/relation_model.html#toc-973) 指定 SQL 语句中的 order
* [group](/doc/3.0/relation_model.html#toc-55a) 指定 SQL 语句中的 group
* [join](/doc/3.0/relation_model.html#toc-48b) 指定 SQL 语句中的 join
* [union](/doc/3.0/relation_model.html#toc-ad1) 指定 SQL 语句中的 union
* [having](/doc/3.0/relation_model.html#toc-be2) 指定 SQL 语句中的 having

#### 添加数据

模型提供了下列的方法来添加数据：

* [add](/doc/3.0/relation_model.html#toc-c73) 添加单条数据
* [thenAdd](/doc/3.0/relation_model.html#toc-3e2) where 条件不存在时添加
* [addMany](/doc/3.0/relation_model.html#toc-a55) 添加多条数据

#### 更新数据

模型提供了下列的方法来更新数据：

* [update](/doc/3.0/relation_model.html#toc-b86) 更新单条数据
* [updateMany](/doc/3.0/relation_model.html#updatemany-datalist-options) 更新多条数据
* [thenUpdate](/doc/3.0/relation_model.html#toc-1b0) 条件式更新
* [increment](/doc/3.0/relation_model.html#toc-990) 字段增加值
* [decrement](/doc/3.0/relation_model.html#toc-41c) 字段减少值

#### 删除数据

模型提供了下列的方法来删除数据：

* [delete](/doc/3.0/relation_model.html#toc-866) 删除数据

#### 手动执行 SQL 语句

有时候模型包装的方法不能满足所有的情况，这时候需要手工指定 SQL 语句，可以通过下面的方法进行：

* [query](/doc/3.0/relation_model.html#toc-89d) 手写 SQL 语句查询
* [execute](/doc/3.0/relation_model.html#toc-a1e) 手写 SQL 语句执行


### 事务

对于数据安全要求很高的业务（如：订单系统、银行系统）操作时需要使用事务，这样可以保证数据的原子性、一致性、隔离性和持久性，模型提供了操作事务的方法。

#### 手工操作事务

可以手工通过 [model.startTrans](/doc/3.0/relation_model.html#toc-0ae)、[model.commit](/3.0/relation_model.html#toc-9fc) 和 [model.rollback](/3.0/relation_model.html#toc-0f2) 方法操作事务。

#### transaction

每次操作事务时都手工执行 startTrans、commit 和 rollback 比较麻烦，模型提供了 [model.transaction](/doc/3.0/relation_model.html#toc-e30) 方法快速操作事务。

### 设置主键

可以通过 `pk` 属性设置数据表的主键，具体见 [model.pk](/doc/3.0/relation_model.html#toc-c88)。

### 设置 schema

可以通过 `schema` 属性设置数据表的主键，具体见 [model.schema](/doc/3.0/relation_model.html#toc-2d3)。

### 关联查询

数据库中表经常会跟其他数据表有关联，数据操作时需要连同关联的表一起操作。如：一个博客文章会有分类、标签、评论，以及属于哪个用户。支持的类型如下：

* `think.Model.HAS_ONE` 一对一模型
* `think.Model.BELONG_TO` 一对一（属于）
* `think.Model.HAS_MANY` 一对多
* `think.Model.MANY_TO_MANY` 多对多

#### 一对一
#### 一对一（属于）
#### 一对多
#### 多对多

### 分布式/读写分离

有时候数据库需要用到分布式数据库，或者进行读写分离，这时候可以给配置里添加 `parser` 完成，如：

```js
exports.model = {
  type: 'mysql',
  mysql: {
    user: 'root',
    password: '',
    parser: sql => {
      // 这里会把当前要执行的 SQL 传递进来
      const sqlLower = sql.toLowerCase();
      if(sql.indexOf('select ') === 0) {
        return {
          host: '',
          port: ''
        }
      } else {
        return {
          host: '',
          port: ''
        }
      }
    }
  }
}
```

`parser` 里可以根据 sql 返回不同的配置，会将返回的配置和默认的配置进行合并。

### API

#### model.schema

设置表结构，默认从数据表中获取，也可以自己配置增加额外的配置项。

```js
module.exports = class extends think.Model {
  get schema() {
    return {
      id: { // 字段名称
        type: 'int(11)',
        ...
      }
    }
  }
}
```
支持的字段为：

* `type` {String} 字段的类型，包含长度属性
* `required` {Boolean} 是否必填
* `default` {mixed} 默认值，可以是个值，也可以是函数
  ```js
  module.exports = class extends think.Model {
    get schema() {
      return {
        type: { // 字段名称
          type: 'varchar(10)',
          default: 'small'
        },
        create_time: {
          type: 'datetime',
          default: () => think.datetime() // default 为一个函数
        },
        score: {
          type: 'int',
          default: data => { // data 为添加/更新时的数据
            return data.grade * 1.5;
          }
        }
      }
    }
  }
  ```
* `primary` {boolean} 是否为主键
* `unique` {boolean} 字段是否唯一
* `autoIncrement` {boolean} 自动是否 `auto increment`
* `readonly` {boolean} 字段是否只读，也就是只能创建时添加，不让更新该字段
* `update` {boolean} 默认值是否在更新时也有效。如果设置了 `readonly`，那么该字段无效。


#### model.relation

配置数据表的关联关系。

```js
module.exports = class extends think.Model {
  get relation() {
    return {
      cate: { // 配置跟分类的关联关系
        type: think.Model.MANY_TO_MANY,
        ...
      },
      comment: { // 配置跟评论的关联关系

      } 
    }
  }
}
```

每个关联关系支持的配置如下：

* `type` 关联关系类型，支持的类型有：`think.Model.HAS_ONE`、`think.Model.BELONG_TO`、`think.Model.HAS_MANY`、`think.Model.MANY_TO_MANY`
* `model` 关联表的模型名，默认为配置的 key，这里为 `cate`
* `name` 对应的数据字段名，默认为配置的 key，这里为 `cate`
* `key` 当前模型的关联 key
* `fKey` 关联表与只对应的 key
* `field` 关联表查询时设置的 field，如果需要设置，必须包含 `fKey` 对应的值
* `where` 关联表查询时设置的 where 条件
* `order` 关联表查询时设置的 order
* `limit` 关联表查询时设置的 limit
* `page` 关联表查询时设置的 page
* `rModel` 多对多关系下，对应的关联关系模型名
* `rfKey` 多对多关系下，对应里的关系关系表对应的 key

#### model.setRelation()

#### model.db(db)

获取或者设置 db 的实例，db 为 Adapter handle（如：think-model-mysql） 的实例。事务操作时由于要复用一个连接需要使用该方法。

```js
module.exports = class extends think.Model {
  async getList() {
    // 让 user 复用当前的 Apdater handle 实例，这样后续可以复用同一个数据库连接
    const user = this.model('user').db(this.db()); 
  }
}
```

#### model.modelName

实例化模型时传入的模型名

```js
const user = think.model('user');
```

实例化时传入的模型名为 `user`，那么 `model.modelName` 值为 `user`。

#### model.config

实例化模型时传入的配置

#### model.tablePrefix

获取数据表前缀，从配置里的 `prefix` 字段获取。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Model {
  get tablePrefix() {
    return 'think_';
  }
}
```

#### model.tableName

获取数据表名，值为 `tablePrefix + modelName`。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Model {
  get tableName() {
    return 'think_user';
  }
}
```

#### model.pk

获取数据表的主键，默认值为 `id`。如果数据表的主键不是 `id`，需要自己配置，如：

```js
module.exports = class extends think.Model {
  get pk() {
    return 'user_id';
  }
}
```

#### model.options

模型操作的一些选项，设置 where、limit、group 等操作时最终都会解析到 options 选项上，格式为：

```js
{
  where: {}, // 存放 where 条件的配置项
  limit: {}, // 存放 limit 的配置项
  group: {},
  ...
}
```

#### model.lastSql

获取最近一次执行的 SQL 语句，默认值为空。

```js
const user = think.model('user');
console.log(user.lastSql); // 打印最近一条的 sql 语句，如果没有则为空
```

#### model.model(name)

* `name` {String} 要实例化的模型名
* `return` {this} 模型实例

实例化别的模型，支持子目录的模型实例化。

```js
module.exports = class extends think.Model {
  async getList() {
    // 如果含有子目录，那么这里带上子目录，如： this.model('front/article')
    const article = this.model('article'); 
    const data = await article.select();
    ...
  }
}
```

#### model.limit(offset, length)

* `offset` {Number} SQL 语句里的 offset
* `length` {Number} SQL 语句里的 length
* `return` {this}

设置 SQL 语句里的 `limit`，会赋值到 `this.options.limit` 属性上，便于后续解析。

```js
module.exports = class extends think.Model() {
  async getList() {
    // SQL: SELECT * FROM `test_d` LIMIT 10
    const list1 = await this.limit(10).select();
    // SQL: SELECT * FROM `test_d` LIMIT 10,20
    const list2 = await this.limit(10, 20).select();
  }
}
```

#### model.page(page, pagesize)

* `page` {Number} 设置当前页数
* `pagesize` {Number} 每页条数，默认值为 `this.config.pagesize`
* `return` {this}

设置查询分页，会解析为 [limit](/doc/3.0/relation_model.html#toc-47d) 数据。

```js
module.exports = class extends think.Model() {
  async getList() {
    // SQL: SELECT * FROM `test_d` LIMIT 0,10
    const list1 = await this.page(1).select(); // 查询第一页，每页 10 条
    // SQL: SELECT * FROM `test_d` LIMIT 20,20
    const list2 = await this.page(2, 20).select(); // 查询第二页，每页 20 条
  }
}
```

每页条数可以通过配置项 `pageSize` 更改，如：

```js
// src/config/adapter.js
exports.model = {
  type: 'mysql',
  mysql: {
    database: '',
    ...
    pageSize: 20, // 设置默认每页为 20 条
  }
}
```

#### model.where(where)

* `where` {String | Object} 设置查询条件
* `return` {this}

设置 where 查询条件，会添加 `this.options.where` 属性，方便后续解析。可以通过属性 `_logic` 设置逻辑，默认为 `AND`。可以通过属性 `_complex` 设置复合查询。

`注`：where 条件中的值需要在 Logic 里做数据校验，否则可能会有漏洞。

##### 普通条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user`
    return this.where().select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 )
    return this.where({id: 10}).select();
  }
  where3(){
    //SELECT * FROM `think_user` WHERE ( id = 10 OR id < 2 )
    return this.where('id = 10 OR id < 2').select();
  }
  where4(){
    //SELECT * FROM `think_user` WHERE ( `id` != 10 )
    return this.where({id: ['!=', 10]}).select();
  }
}
```

##### null 条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` where ( title IS NULL );
    return this.where({title: null}).select();
  }
  where2(){
    //SELECT * FROM `think_user` where ( title IS NOT NULL );
    return this.where({title: ['!=', null]}).select();
  }
}
```

##### EXP 条件

ThinkJS 默认会对字段和值进行转义，防止安全漏洞。有时候一些特殊的情况不希望被转义，可以使用 EXP 的方式，如：

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( (`name` ='name') )
    return this.where({name: ['EXP', "=\"name\""]}).select();
  }
}
```

##### LIKE 条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `title` NOT LIKE 'welefen' )
    return this.where({title: ['NOTLIKE', 'welefen']}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `title` LIKE '%welefen%' )
    return this.where({title: ['like', '%welefen%']}).select();
  }
  //like 多个值
  where3(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE 'welefen' OR `title` LIKE 'suredy') )
    return this.where({title: ['like', ['welefen', 'suredy']]}).select();
  }
  //多个字段或的关系 like 一个值
  where4(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') OR (`content` LIKE '%welefen%') )
    return this.where({'title|content': ['like', '%welefen%']}).select();
  }
  //多个字段与的关系 Like 一个值
  where5(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') AND (`content` LIKE '%welefen%') )
    return this.where({'title&content': ['like', '%welefen%']}).select();
  }
}
```


##### IN 条件

```js
module.exports = class extens think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` IN ('10','20') )
    return this.where({id: ['IN', '10,20']}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` IN (10,20) )
    return this.where({id: ['IN', [10, 20]]}).select();
  }
  where3(){
    //SELECT * FROM `think_user` WHERE ( `id` NOT IN (10,20) )
    return this.where({id: ['NOTIN', [10, 20]]}).select();
  }
}
```

##### BETWEEN 查询

```js
module.exports = class extens think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE (  (`id` BETWEEN 1 AND 2) )
    return this.where({id: ['BETWEEN', 1, 2]}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE (  (`id` BETWEEN '1' AND '2') )
    return this.where({id: ['between', '1,2']}).select();
  }
}
```

##### 多字段查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) AND ( `title` = 'www' )
    return this.where({id: 10, title: "www"}).select();
  }
  //修改逻辑为 OR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) OR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'OR'}).select();
  }
  //修改逻辑为 XOR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) XOR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'XOR'}).select();
  }
}
```

##### 多条件查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` > 10 AND `id` < 20 )
    return this.where({id: {'>': 10, '<': 20}}).select();
  }
  //修改逻辑为 OR 
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` < 10 OR `id` > 20 )
    return this.where({id: {'<': 10, '>': 20, _logic: 'OR'}}).select()
  }
}
```

##### 复合查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `title` = 'test' ) AND (  ( `id` IN (1,2,3) ) OR ( `content` = 'www' ) )
    return this.where({
      title: 'test',
      _complex: {id: ['IN', [1, 2, 3]],
        content: 'www',
        _logic: 'or'
      }
    }).select()
  }
}
```


#### model.field(field)

* `field` {String} 查询字段，支持 `AS`。
* `return` {this}

设置 SQL 语句中的查询字段，默认为 `*`。设置后会赋值到 `this.options.field` 属性上，便于后续解析。

```js
module.exports = class extends think.Model{
  async getList() {
    // SQL: SELECT `d_name` FROM `test_d`
    const data1 = await this.field('d_name').select();

    // SQL: SELECT `c_id`,`d_name` FROM `test_d`
    const data2 = await this.field('c_id,d_name').select();

    // SQL: SELECT c_id AS cid,`d_name` FROM `test_d`
    const data3 = await this.field('c_id AS cid, d_name').select();
  }
}
```

#### model.fieldReverse(field)

* `field` {String} 查询字段，不支持 `AS`。
* `return` {this}

查询时设置反选字段（即：不查询配置的字段，而是查询其他的字段），会添加 `this.options.field` 和 `this.options.fieldReverse` 属性，便于后续分析。

该功能的实现方式为：查询数据表里的所有字段，然后过滤掉配置的字段。


```js
module.exports = class extends think.Model{
  async getList() {
    // SQL: SELECT `id`, `c_id` FROM `test_d`
    const data1 = await this.fieldReverse('d_name').select();
  }
}
```

#### model.table(table, hasPrefix)

* `table` {String} 表名，支持值为一个 SELECT 语句
* `hasPrefix` {Boolean} `table` 里是否已经含有了表前缀，默认值为 `false`
* `return` {this}

设置当前模型对应的表名，如果 hasPrefix 为 false 且 table 不是 SQL 语句，那么表名会追加 `tablePrefix`，最后的值会设置到 `this.options.table` 属性上。

如果没有设置该属性，那么最后解析 SQL 时通过 `mode.tableName` 属性获取表名。

#### model.union(union, all)

* `union` {String} union 查询字段
* `all` {boolean} 是否使用 UNION ALL
* `return` {this}

设置 SQL 中的 UNION 查询，会添加 `this.options.union` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` UNION (SELECT * FROM think_pic2)
    return this.union('SELECT * FROM think_pic2').select();
  }
  getList2(){
    //SELECT * FROM `think_user` UNION ALL (SELECT * FROM `think_pic2`)
    return this.union({table: 'think_pic2'}, true).select();
  }
}
```

#### model.join(join)

* `join` {String | Object | Array} 要组合的查询语句，默认为 `LEFT JOIN`
* `return` {this}

组合查询，支持字符串、数组和对象等多种方式。会添加 `this.options.join` 属性，便于后续分析。

##### 字符串

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id
    return this.join('think_cate ON think_group.cate_id=think_cate.id').select();
  }
}
```

##### 数组

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id RIGHT JOIN think_tag ON think_group.tag_id=think_tag.id
    return this.join([
      'think_cate ON think_group.cate_id=think_cate.id', 
      'RIGHT JOIN think_tag ON think_group.tag_id=think_tag.id'
    ]).select();
  }
}
```

##### 对象：单个表

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` INNER JOIN `think_cate` AS c ON think_user.`cate_id`=c.`id`
    return this.join({
      table: 'cate', 
      join: 'inner', //join 方式，有 left, right, inner 3 种方式
      as: 'c', // 表别名
      on: ['cate_id', 'id'] //ON 条件
    }).select();
  }
}
```

##### 对象：多次 JOIN

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a LEFT JOIN `think_cate` AS c ON a.`cate_id`=c.`id` LEFT JOIN `think_group_tag` AS d ON a.`id`=d.`group_id`
    return this.alias('a').join({
      table: 'cate',
      join: 'left',
      as: 'c',
      on: ['cate_id', 'id']
    }).join({
      table: 'group_tag',
      join: 'left',
      as: 'd',
      on: ['id', 'group_id']
    }).select()
  }
}
```


##### 对象：多个表

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN `think_cate` ON think_user.`id`=think_cate.`id` LEFT JOIN `think_group_tag` ON think_user.`id`=think_group_tag.`group_id`
    return this.join({
      cate: {
        on: ['id', 'id']
      },
      group_tag: {
        on: ['id', 'group_id']
      }
    }).select();
  }
}
```

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a LEFT JOIN `think_cate` AS c ON a.`id`=c.`id` LEFT JOIN `think_group_tag` AS d ON a.`id`=d.`group_id`
    return this.alias('a').join({
      cate: {
        join: 'left', // 有 left,right,inner 3 个值
        as: 'c',
        on: ['id', 'id']
      },
      group_tag: {
        join: 'left',
        as: 'd',
        on: ['id', 'group_id']
      }
    }).select()
  }
}
```

##### 对象：ON 条件含有多个字段

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN `think_cate` ON think_user.`id`=think_cate.`id` LEFT JOIN `think_group_tag` ON think_user.`id`=think_group_tag.`group_id` LEFT JOIN `think_tag` ON (think_user.`id`=think_tag.`id` AND think_user.`title`=think_tag.`name`)
    return this.join({
      cate: {on: 'id, id'},
      group_tag: {on: ['id', 'group_id']},
      tag: {
        on: { // 多个字段的 ON
          id: 'id',
          title: 'name'
        }
      }
    }).select()
  }
}
```

##### 对象：table 值为 SQL 语句

```js
module.exports = class extends think.Model {
  async getList(){
    let sql = await this.model('group').buildSql();
    //SELECT * FROM `think_user` LEFT JOIN ( SELECT * FROM `think_group` ) ON think_user.`gid`=( SELECT * FROM `think_group` ).`id`
    return this.join({
      table: sql,
      on: ['gid', 'id']
    }).select();
  }
}
```

#### model.order(order)

* `order` {String | Array | Object} 排序方式
* `return` {this}

设置 SQL 中的排序方式。会添加 `this.options.order` 属性，便于后续分析。

##### 字符串

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC, name ASC
    return this.order('id DESC, name ASC').select();
  }
  getList1(){
    //SELECT * FROM `think_user` ORDER BY count(num) DESC
    return this.order('count(num) DESC').select();
  }
}
```



##### 数组

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC,name ASC
    return this.order(['id DESC', 'name ASC']).select();
  }
}
```

##### 对象

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY `id` DESC,`name` ASC
    return this.order({
      id: 'DESC',
      name: 'ASC'
    }).select();
  }
}
```


#### model.alias(aliasName)

* `aliasName` {String} 表别名
* `return` {this}

设置表别名。会添加 `this.options.alias` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a;
    return this.alias('a').select();
  }
}
```

#### model.having(having)

* `having` {String} having 查询的字符串
* `return` {this}

设置 having 查询。会设置 `this.options.having` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` HAVING view_nums > 1000 AND view_nums < 2000
    return this.having('view_nums > 1000 AND view_nums < 2000').select();
  }
}
```


#### model.group(group)

* `group` {String} 分组查询的字段
* `return` {this}

设定分组查询。会设置 `this.options.group` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` GROUP BY `name`
    return this.group('name').select();
  }
}
```

#### model.distinct(distinct)

* `distinct` {String} 去重的字段
* `return` {this}

去重查询。会设置 `this.options.distinct` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT DISTINCT `name` FROM `think_user`
    return this.distinct('name').select();
  }
}
```


#### model.beforeAdd(data)

* `data` {Object} 要添加的数据

添加前置操作。

#### model.afterAdd(data)

* `data` {Object} 要添加的数据

添加后置操作。

#### model.afterDelete(data)

删除后置操作。

#### model.beforeUpdate(data)

* `data` {Object} 要更新的数据

更新前置操作。

#### model.afterUpdate(data)

* `data` {Object} 要更新的数据

更新后置操作。

#### model.afterFind(data)

* `data` {Object} 查询的单条数据
* `return` {Object | Promise}

`find` 查询后置操作。

#### model.afterSelect(data)

* `data` [Array] 查询的数据数据
* `return` {Array | Promise}

`select` 查询后置操作。



#### model.add(data, options)

* `data` {Object} 要添加的数据
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID

添加一条数据，返回值为插入数据的 id。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```

有时候需要借助数据库的一些函数来添加数据，如：时间戳使用 mysql 的 `CURRENT_TIMESTAMP` 函数，这时可以借助 `exp` 表达式来完成。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.add({
      name: 'test',
      time: ['exp', 'CURRENT_TIMESTAMP()']
    });
  }
}
```

#### model.thenAdd(data, where)

* `data` {Object} 要添加的数据
* `where` {Object} where 条件，会通过 [where](/doc/3.0/relation_model.html#toc-d47) 方法设置 where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时才添加数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.model('user');
    //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
    const result = await model.thenAdd({name: 'xxx', pwd: 'yyy'}, {email: 'xxx'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```

也可以把 where 条件通过 `this.where` 方法直接指定，如：

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.model('user');
    const result = await model.where({email: 'xxx'}).thenAdd({name: 'xxx', pwd: 'yyy'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```


#### model.addMany(dataList, options)

* `dataList` {Array} 要添加的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID 列表

一次添加多条数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertIds = await model.addMany([
      {name: 'xxx', pwd: 'yyy'},
      {name: 'xxx1', pwd: 'yyy1'}
    ]);
  }
}
```


#### model.delete(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

删除数据。

```js
module.exports = class extends think.Controller {
  async deleteAction(){
    let model = this.model('user');
    let affectedRows = await model.where({id: ['>', 100]}).delete();
  }
}
```


#### model.update(data, options)

* `data` {Object} 要更新的数据
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

更新数据。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

默认情况下更新数据必须添加 where 条件，以防止误操作导致所有数据被错误的更新。如果确认是更新所有数据的需求，可以添加 `1=1` 的 where 条件进行，如：

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where('1=1').update({email: 'admin@thinkjs.org'});
  }
}
```

有时候更新值需要借助数据库的函数或者其他字段，这时候可以借助 `exp` 来完成。

```js
export default class extends think.controlle.base {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where('1=1').update({
      email: 'admin@thinkjs.org',
      view_nums: ['exp', 'view_nums+1'],
      update_time: ['exp', 'CURRENT_TIMESTAMP()']
    });
  }
}
```


#### model.thenUpdate(data, where)

* `data` {Object} 要更新的数据
* `where` {Object} where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时添加数据，命中数据则更新该数据。

#### updateMany(dataList, options)

* `dataList` {Array} 要更新的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise}

更新多条数据，dataList 里必须包含主键的值，会自动设置为更新条件。

```js
this.model('user').updateMany([{
  id: 1, // 数据里必须包含主键的值
  name: 'name1'
}, {
  id: 2,
  name: 'name2'
}])
```

#### model.increment(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值增加。

```js
module.exports = class extends think.Model {
  updateViewNums(id){
    return this.where({id: id}).increment('view_nums', 1); //将阅读数加 1
  }
}
```

#### model.decrement(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值减少。

```js
module.exports = class extends think.Model {
  updateViewNums(id){
    return this.where({id: id}).decrement('coins', 10); //将金币减 10 
  }
}
```


#### model.find(options)

* `options` {Object} 操作选项
* `return` {Promise} 返回单条数据

查询单条数据，返回的数据类型为对象。如果未查询到相关数据，返回值为 `{}`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.model('user');
    let data = await model.where({name: 'thinkjs'}).find();
    //data returns {name: 'thinkjs', email: 'admin@thinkjs.org', ...}
    if(think.isEmpty(data)) {
      // 内容为空时的处理
    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.select(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回多条数据

查询多条数据，返回的数据类型为数组。如果未查询到相关数据，返回值为 `[]`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.model('user');
    let data = await model.limit(2).select();
    //data returns [{name: 'thinkjs', email: 'admin@thinkjs.org'}, ...]
    if(think.isEmpty(data)){

    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.countSelect(options, pageFlag)

* `options` {Number | Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `pageFlag` {Boolean} 当页数不合法时处理，true 为修正到第一页，false 为修正到最后一页，默认不修正
* `return` {Promise}

分页查询，一般需要结合 `page` 方法一起使用。如：

```js
module.exports = class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.page(this.get('page')).countSelect();
  }
}
```

返回值数据结构如下：

```js
{
  pagesize: 10, //每页显示的条数
  currentPage: 1, //当前页
  count: 100, //总条数
  totalPages: 10, //总页数
  data: [{ //当前页下的数据列表
    name: "thinkjs",
    email: "admin@thinkjs.org"
  }, ...]
}
```

有时候总条数是放在其他表存储的，不需要再查当前表获取总条数了，这个时候可以通过将第一个参数 `options` 设置为总条数来查询。

```js
module.exports = class extends think.controller.base {
  async listAction(){
    const model = this.model('user');
    const total = 256;
    // 指定总条数查询
    const data = await model.page(this.get('page')).countSelect(total);
  }
}
```

#### model.getField(field, num)

* `field` {String} 字段名，多个字段用逗号隔开
* `num` {Boolean | Number} 需要的条数
* `return` {Promise}

获取特定字段的值。

#### model.count(field)

* `field` {String} 字段名，如果不指定那么值为 `*`
* `return` {Promise} 返回总条数

获取总条数。

```js
module.exports = class extends think.Model{
  // 获取字段值之和
  getScoreCount() {
    // SELECT COUNT(score) AS think_count FROM `test_d` LIMIT 1
    return this.count('score');
  }
}
```

#### model.sum(field)

* `field` {String} 字段名
* `return` {Promise}

对字段值进行求和。

```js
module.exports = class extends think.Model{
  // 获取字段值之和
  getScoreSum() {
    // SELECT SUM(score) AS think_sum FROM `test_d` LIMIT 1
    return this.sum('score');
  }
}
```

#### model.min(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最小值。


```js
module.exports = class extends think.Model{
  // 获取最小值
  getScoreMin() {
    // SELECT MIN(score) AS think_min FROM `test_d` LIMIT 1
    return this.min('score');
  }
}
```

#### model.max(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最大值。

```js
module.exports = class extends think.Model{
  // 获取最大值
  getScoreMax() {
    // SELECT MAX(score) AS think_max FROM `test_d` LIMIT 1
    return this.max('score');
  }
}
```

#### model.avg(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的平均值。

```js
module.exports = class extends think.Model{
  // 获取平均分
  getScoreAvg() {
    // SELECT AVG(score) AS think_avg FROM `test_d` LIMIT 1
    return this.avg('score');
  }
}
```

#### model.query(sqlOptions)

* `sqlOptions` {String | Object} 要执行的 sql 选项
* `return` {Promise} 查询的数据

指定 SQL 语句执行查询，`sqlOptions` 会通过 [parseSql](/doc/3.0/relation_model.html#toc-a15) 方法解析。

```js
module.exports = class extends think.Model {
  getMysqlVersion() {
    return this.query('select version();');
  }
}
```


#### model.execute(sqlOptions)

* `sqlOptions` {String | Object} 要操作的 sql 选项
* `return` {Promise} 

执行 SQL 语句，`sqlOptions` 会通过 [parseSql](/doc/3.0/relation_model.html#toc-a15) 方法解析。

```js
module.exports = class extends think.Model {
  xxx() {
    return this.execute('set @b=5;call proc_adder(2,@b,@s);');
  }
}
```


#### model.parseSql(sqlOptions)

* `sql` {String | Object} 要解析的 SQL 语句
* `return` {Object}

解析 SQL 语句，将 SQL 语句中的 `__TABLENAME__` 解析为对应的表名。

```js
module.exports = class extends think.Model {
  getSql(){
    const sql = 'SELECT * FROM __GROUP__ WHERE id=10';
    const sqlOptions = this.parseSql(sql);
    //{sql: "SELECT * FROM think_group WHERE id=10"}
  }
  getSql2(){
    const sql = 'SELECT * FROM __GROUP__ WHERE id=10';
    const sqlOptions = this.parseSql({sql, debounce: false});
    //{sql: SELECT * FROM think_group WHERE id=10", debounce: false}
  }
}
```

#### model.parseOptions(options)

* `options` {Object} 要合并的 options，会合并到 `this.options` 中一起解析
* `return` {Promise}

解析 options。where、limit、group 等操作会将对应的属性设置到 `this.options` 上，该方法会对 `this.options` 进行解析，并追加对应的属性，以便在后续的处理需要这些属性。

```js
const options = await this.parseOptions({limit: 1});
/**
options = {
  table: '',
  tablePrefix: '',
  pk: '',
  field: '',
  where: '',
  limit: '',
  group: '',
  ...
}
*/
```

调用 `this.parseOptions` 解析后，`this.options` 属性会被置为空对象 `{}`。


#### model.startTrans()

* `return` {Promise}

开启事务。

#### model.commit()

* `return` {Promise}

提交事务。

#### model.rollback()

* `return` {Promise}

回滚事务。

```js
module.exports = class extends think.Model {
  async addData() {
    // 如果添加成功则 commit，失败则 rollback
    try {
      await this.startTrans();
      const result = await this.add({});
      await this.commit();
      return result;
    } catch(e){
      await this.rollback();
    }
  }
}
```

如果事务操作过程中需要实例化多个模型操作，那么需要让模型之间复用同一个数据库连接，具体见 [model.db](/doc/3.0/relation_model.html#toc-f95)。

#### model.transaction(fn)

* `fn` {Function} 要执行的函数，如果有异步操作，需要返回 Promise
* `return` {Promise}

使用事务来执行传递的函数，函数要返回 Promise。如果函数返回值为 Resolved Promise，那么最后会执行 commit，如果返回值为 Rejected Promise（或者报错），那么最后会执行 rollback。

```js
module.exports = class extends think.Model {
  async updateData(data){
    const result = await this.transaction(async () => {
      const insertId = await this.add(data);
      return insertId;
    })
  }
}
```
由于事务里的操作需要在同一个连接里执行，如果处理过程中涉及多个模型的操作，需要多个模型复用同一个数据库连接，这时可以通过 `model.db` 方法达到复用数据库连接的效果。

```js
module.exports = class extends think.Model {
  async updateData(data){
    const result = await this.transaction(async () => {
      const insertId = await this.add(data);
      // 通过 db 方法让 user_cate 模型复用当前模型的数据库连接
      const userCate = this.model('user_cate').db(this.db());
      let result = await userCate.add({user_id: insertId, cate_id: 100});
      return result;
    })
  }
}
```