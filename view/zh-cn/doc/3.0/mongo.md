## MongoDB

有时候关系数据库并不能满足项目的需求，需要 MongoDB 来存储数据。框架提供了 [think-mongo](https://github.com/thinkjs/think-mongo) 扩展来支持 MongoDB，该模块是基于 [mongodb](https://github.com/mongodb/node-mongodb-native) 实现的。

### 扩展 MongoDB 功能

修改扩展的配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加如下的配置：

```js
const mongo = require('think-mongo');

module.exports = [
  mongo(think.app) // 让框架支持模型的功能
]
```

添加完扩展后，会注入 `think.Mongo`、`think.mongo`、`ctx.mongo` 和 `controller.mongo` 方法，其中 think.Mongo 为 Mongo 模型的基类文件，其他为实例化 Mongo 模型的方法，ctx.mongo 和 controller.mongo 是 think.mongo 方法的包装。

### 配置 MongoDB 数据库

MongoDB 的数据库配置复用了关系数据库模型的配置，为 adapter 配置，放在 model 下。文件路径为 `src/config/adapter.js`（多模块项目下为 `src/common/config/adapter.js`）。


```js
exports.model = {
  type: 'mongo', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    user: '',
    password: '',
    database: '', // 数据库名称
    options: ''
  }
}
```

可以支持多个 host 和 port， 如：

```js
exports.model = {
  type: 'mongo', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mongo: {
    host: ['127.0.0.1', '10.16.1.2'],
    port: [27017, 27018],
    user: '',
    password: '',
    database: '', // 数据库名称
    options: ''
  }
}
```

更多配置选项请见 <http://mongodb.github.io/node-mongodb-native/2.0/tutorials/urls/>。

### 创建模型文件

模型文件放在 `src/model/` 目录下（多模块项目为 `src/common/model` 以及 `src/[module]/model`），继承模型基类 `think.Mongo`，文件格式为：

```js
// src/model/user.js
module.exports = class extends think.Mongo {
  getList() {
    return this.field('name').select();
  }
}
```

如果项目比较复杂，希望对模型文件分目录管理，那么可以在模型目录下建立子目录，如： `src/model/front/user.js`，`src/model/admin/user.js`，这样在模型目录下建立 `front` 和 `admin` 目录，分别管理前台和后台的模型文件。

含有子目录的模型实例化需要带上子目录，如：`think.mongo('front/user')`，具体见[这里](/doc/3.0/relation_model.html#toc-9d9)。


### 实例化模型

项目启动时，会扫描项目下的所有模型文件（目录为 `src/model/`，多模块项目下目录为 `src/common/model` 以及各种 `src/[module]/model`），扫描后会将所有的模型类存放在 `think.app.models` 对象上，实例化时会从这个对象上查找，如果找不到则实例化模型基类 `think.Mongo`。

#### think.mongo

实例化模型类。

```js
think.mongo('user'); // 获取模型的实例
think.mongo('user', 'sqlite'); // 获取模型的实例，修改数据库的类型
think.mongo('user', { // 获取模型的实例，修改类型并添加其他的参数
  type: 'sqlite',
  aaa: 'bbb'
}); 
think.mongo('user', {}, 'admin'); // 获取模型的实例，指定为 admin 模块（多模块项目下有效）
```
#### ctx.mongo

实例化模型类，获取配置后调用 `think.mongo` 方法，多模块项目下会获取当前模块下的配置。

```js
const user = ctx.mongo('user');
```

#### controller.mongo

实例化模型类，获取配置后调用 `think.mongo` 方法，多模块项目下会获取当前模块下的配置。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.mongo('user'); // controller 里实例化模型
    const data = await user.select();
    return this.success(data);
  }
}
```

#### service.mongo

实例化模型类，等同于 `think.mongo`

#### 含有子目录的模型实例化

如果模型目录下含有子目录，那么实例化时需要带上对应的子目录，如：

```js
const user1 = think.mongo('front/user'); // 实例化前台的 user 模型
const user2 = think.mongo('admin/user'); // 实例化后台的 user 模型

```

### 常见问题

#### 如何在项目中使用 mongoose？

提供了 [think-mongoose](https://github.com/thinkjs/think-mongoose) 模块，可以在项目直接使用 Mongoose 里的一些操作。

### API

#### mongo.pk

获取数据表的主键，默认值为 `_id`。如果数据表的主键不是 `_id`，需要自己配置，如：

```js
module.exports = class extends think.Mongo {
  get pk() {
    return 'user_id';
  }
}
```

有时候不想写模型文件，而是在控制器里直接实例化，这时候又想改变主键的名称，那么可以通过设置 `_pk` 属性的方式，如：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.mongo('user');
    user._pk = 'user_id'; // 通过 _pk 属性设置 pk
    const data = await user.select();
  }
}
```


#### mongo.tablePrefix

获取数据表前缀，从配置里的 `prefix` 字段获取。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Mongo {
  get tablePrefix() {
    return 'think_';
  }
}
```

#### mongo.mongo

获取数据表名，值为 `tablePrefix + modelName`。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Mongo {
  get tableName() {
    return 'think_user';
  }
}
```


#### mongo.model(name)

* `name` {String} 要实例化的模型名
* `return` {this} 模型实例

实例化别的模型，支持子目录的模型实例化。

```js
module.exports = class extends think.Mongo {
  async getList() {
    // 如果含有子目录，那么这里带上子目录，如： this.mongo('front/article')
    const article = this.mongo('article'); 
    const data = await article.select();
    ...
  }
}
```

#### mongo.db(db)

获取或者设置 db 的实例，db 为 Adapter handle 的实例。

```js
module.exports = class extends think.Mongo {
  async getList() {
    // 让 user 复用当前的 Apdater handle 实例，这样后续可以复用同一个数据库连接
    const user = this.mongo('user').db(this.db()); 
  }
}
```

#### mongo.modelName

实例化模型时传入的模型名

```js
const user = think.mongo('user');
```

实例化时传入的模型名为 `user`，那么 `model.modelName` 值为 `user`。

#### mongo.config

实例化模型时传入的配置，模型实例化时会自动传递，不用手工赋值。

```js
{
  host: '127.0.0.1',
  port: 27017,
  ...
}
```

#### mongo.limit(offset, length)

* `offset` {Number} 起始位置(类似于 SQL 语句里的 offset)
* `length` {Number} 长度(类俗语 SQL 语句里的 length)
* `return` {this}

设置 SQL 语句里的 `limit`，会赋值到 `this.options.limit` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo() {
  async getList() {
    // 前 10 条
    const list1 = await this.limit(10).select();
    // 11 ~ 20条
    const list2 = await this.limit(10, 20).select();
  }
}
```


#### mongo.page(page, pagesize)

* `page` {Number} 设置当前页数
* `pagesize` {Number} 每页条数，默认值为 `this.config.pagesize`
* `return` {this}

设置查询分页，会解析为 [limit](/doc/3.0/mongo.html#toc-769) 数据。

```js
module.exports = class extends think.Mongo() {
  async getList() {
    const list1 = await this.page(1).select(); // 查询第一页，每页 10 条
    const list2 = await this.page(2, 20).select(); // 查询第二页，每页 20 条
  }
}
```

每页条数可以通过配置项 `pageSize` 更改，如：

```js
// src/config/adapter.js
exports.model = {
  type: 'mongo',
  mongo: {
    database: '',
    ...
    pageSize: 20, // 设置默认每页为 20 条
  }
}
```

#### model.where(where)

* `where` {String} 设置查询条件
* `return` {this}

设置查询字段，设置后会赋值到 `this.options.where` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo{
  async getList() {
    const data = await this.where(where).select();
  }
}
```

#### model.field(field)

* `field` {String} 查询字段。
* `return` {this}

设置查询字段，设置后会赋值到 `this.options.field` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo{
  async getList() {
    const data1 = await this.field('d_name').select();

    const data2 = await this.field('c_id,d_name').select();
  }
}
```


#### model.table(table, hasPrefix)

* `table` {String} 表名，支持值为一个 SELECT 语句
* `hasPrefix` {Boolean} `table` 里是否已经含有了表前缀，默认值为 `false`
* `return` {this}

设置当前模型对应的表名，如果 hasPrefix 为 false，那么表名会追加 `tablePrefix`，最后的值会设置到 `this.options.table` 属性上。

如果没有设置该属性，那么最后解析时通过 `model.tableName` 属性获取表名。


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

#### model.order(order)

* `order` {String | Array | Object} 排序方式
* `return` {this}

设置排序方式。会添加 `this.options.order` 属性，便于后续分析。

#### model.group(group)

* `group` {String} 分组查询的字段
* `return` {this}

设定分组查询。会设置 `this.options.group` 属性，便于后续分析。

#### model.distinct(distinct)

* `distinct` {String} 去重的字段
* `return` {this}

去重查询。会设置 `this.options.distinct` 属性，便于后续分析。


#### model.add(data, options)

* `data` {Object} 要添加的数据，如果数据里某些字段在数据表里不存在会自动被过滤掉
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID

添加一条数据，返回值为插入数据的 id。

如果数据表没有主键或者没有设置 `auto increment` 等属性，那么返回值可能为 0。如果插入数据时手动设置主键的值，那么返回值也可能为 0。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.mongo('user');
    let insertId = await model.add({name: 'xxx', pwd: 'yyy'});
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
    const model = this.mongo('user');
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
    const model = this.mongo('user');
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
    let model = this.mongo('user');
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
    let model = this.mongo('user');
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
    let model = this.mongo('user');
    let affectedRows = await model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

默认情况下更新数据必须添加 where 条件，以防止误操作导致所有数据被错误的更新。如果确认是更新所有数据的需求，可以添加 `1=1` 的 where 条件进行，如：

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.mongo('user');
    let affectedRows = await model.where('1=1').update({email: 'admin@thinkjs.org'});
  }
}
```

有时候更新值需要借助数据库的函数或者其他字段，这时候可以借助 `exp` 来完成。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.mongo('user');
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

#### model.updateMany(dataList, options)

* `dataList` {Array} 要更新的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 影响的行数

更新多条数据，dataList 里必须包含主键的值，会自动设置为更新条件。

```js
this.mongo('user').updateMany([{
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
module.exports = class extends think.Mongo {
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
module.exports = class extends think.Mongo {
  updateViewNums(id){
    return this.where({id: id}).decrement('coins', 10); //将金币减 10 
  }
}
```


#### model.find(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回单条数据

查询单条数据，返回的数据类型为对象。如果未查询到相关数据，返回值为 `{}`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
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
    let model = this.mongo('user');
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
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
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
module.exports = class extends think.Controller {
  async listAction(){
    const model = this.mongo('user');
    const total = 256;
    // 指定总条数查询
    const data = await model.page(this.get('page')).countSelect(total);
  }
}
```
#### model.sum(field)

* `field` {String} 字段名
* `return` {Number|Array} 返回求和结果

没有分组情况下，默认返回数字，有人组的情况下返回分组信息以及求和结果，如下示例：

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
    // ret1 = 123  没有分组情况下，返回数字
    let ret1 = await m.sum('age');		
    // ret2 = [{group:'thinkjs1',total:6},{group:'thinkjs2',total:8}]
    // 有分组的情况返回[{group:xxx,total:xxx}...]
    let ret2 = await m.group('name').sum('age'); 
	// ret3 = [{group:{name:'thinkjs',version'1.0'},total:6},{group:{name:'thinkjs',version'2.0'},total:8},]
    let ret3 = await m.where({name:'thinkjs'}).order('version ASC').group('name,version').sum('age'); 
  }
}
```

#### model.aggregate(options)
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise}

聚合操作，详见[Aggregation](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)

#### model.mapReduce(map,reduce,out)
* `map` {	function | string} mapping方法
* `reduce` {	function | string} reduce方法
* `out` {Object} 其他配置
* `return` {Promise}
* 
集合中 Map-Reduce 操作，详见[MapReduce](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#mapReduce)

#### model.createIndex(indexes,options)
* `indexes` {	string | object} 索引名
* `options` {Object} 操作选项
* `return` {Promise}

创建索引，详见[ensureIndex](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#ensureIndex)

#### model.getIndexes()
* `return` {Promise}

获取索引