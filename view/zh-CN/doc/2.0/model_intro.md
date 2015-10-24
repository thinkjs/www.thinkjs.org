## 模型介绍

项目开发中，经常要操作数据库，如：增删改查等操作。模型就是为了方便操作数据库进行的封装，一个模型对应数据库中的一个数据表。

目前支持的数据库有：`Mysql`，`MongoDB` 和 `SQLite`。

### 创建模型

可以在项目目录下通过命令 `thinkjs model [name]` 来创建模型：

```sh
thinkjs model user;
```

执行完成后，会创建文件 `src/common/model/user.js`。

默认情况下模型文件会创建在 `common` 模块下，如果想创建在其他的模块下，创建时需要指定模块名：

```sh
thinkjs model home/user
```


### 模型配置

模型配置如下，可以在 `src/common/config/db.js` 中进行修改：

```js
export default {
  type: 'mysql', //数据库类型
  host: '127.0.0.1', //数据库 host
  port: '', //数据库端口，默认为 3306
  name: '', //数据库名
  user: '', //账号
  pwd: '',  //密码
  prefix: 'think_', //数据表前缀，如果不想要数据表前缀，可以设置为空
  encoding: 'utf8', //数据库编码
  nums_per_page: 10, //每页显示的条数
  log_sql: true, //是否记录执行的 sql 语句
  log_connect: true, //是否记录数据库连接信息
  cache: { // 数据库查询缓存配置
    on: true,
    type: '',
    timeout: 3600
  }
};
```

也可以在不同的模块下进行不同的模型配置，此时需要设置模块下对应的模型配置，配置文件为 `src/[module]/config/db.js` 。

### 数据表定义

默认情况下，模型名和数据表名都是一一对应的。假设数据表前缀是 `think_`，那么 `user` 模型对应的数据表为 `think_user`，`user_group` 模型对应的数据表为 `think_user_group`。

如果需要修改，可以通过下面 2 个属性进行：

* `tablePrefix` 表前缀
* `tableName` 表名，不包含前缀

##### ES6 方式

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.tablePrefix = ''; //将数据表前缀设置为空
    this.tableName = 'user2'; //将对应的数据表名设置为 user2
  }
}
```

##### 动态创建类方式

```js
module.exports = think.model({
  tablePrefix: '', //直接通过属性来设置表前缀和表名
  tableName: 'user2',
  init: function(){
    this.super('init', arguments);
  }
})
```


### 模型实例化

模型实例化在不同的地方使用的方式有所差别，如果当前类含有 `model` 方法，那可以直接通过该方法实例化，如：

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model('user');
  }
}
```

否则可以通过调用 `think.model` 方法获取实例化，如：

```js
let getModelInstance = function(){
  let model = think.model('user', think.config('db'), 'home');
}
```

使用 `think.model` 获取模型的实例化时，需要带上模型的配置。

### 链式调用

模型中提供了很多链式调用的方法（类似 jQuery 里的链式调用），通过链式调用方法可以方便的进行数据操作。链式调用是通过返回 `this` 来实现的。

```js
export default class extends think.model.base {
  /**
   * 获取列表数据
   */
  * getList(){
    let data = yield this.field('title, content').where({
      id: ['>', 100]
    }).order('id DESC').select();
    ...
  }
}
```

模型中支持链式调用的方法有：

* `where`, 用于查询或者更新条件的定义
* `table`, 用于定义要操作的数据表名称
* `alias`, 用于给当前数据表定义别名
* `data`, 用于新增或者更新数据之前的数据对象赋值
* `field`, 用于定义要查询的字段，也支持字段排除
* `order`, 用于对结果进行排序
* `limit`, 用于限制查询结果数据
* `page`, 用于查询分页，生成 sql 语句时会自动转换为 limit
* `group`, 用于对查询的 group 支持
* `having`, 用于对查询的 having 支持
* `join`, 用于对查询的 join 支持
* `union`, 用于对查询的 union 支持
* `distinct`, 用于对查询的 distinct 支持
* `cache` 用于查询缓存

### CURD 操作

#### 添加数据

##### 添加一条数据

使用 `add` 方法可以添加一条数据，返回值为插入数据的 id。如：

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model('user');
    let insertId = yield model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```

##### 添加多条数据

使用 `addMany` 方法可以添加一条数据，如：

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model('user');
    let insertId = yield model.addMany([
      {name: 'xxx', pwd: 'yyy'},
      {name: 'xxx1', pwd: 'yyy1'}
    ]);
  }
}
```

##### thenAdd

数据库设计时，我们经常需要把某个字段设为唯一，表示这个字段值不能重复。这样添加数据的时候只能先去查询下这个数据值是否存在，如果不存在才进行插入操作。

模型中提供了 `thenAdd` 方法简化这一操作。

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model('user');
    //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
    let result = yield model.thenAdd({name: 'xxx', pwd: 'yyy'}, {name: 'xxx'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```


#### 更新数据

更新数据使用 `update` 方法，返回值为影响的行数。如：

```js
export default class extends think.controlle.base {
  * updateAction(){
    let model = this.model('user');
    let affectedRows = yield model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

#### 查询数据

模型中提供了多种方式来查询数据，如：查询单条数据，查询多条数据，读取字段值，读取最大值，读取总条数等。

##### 查询单条数据

可以使用 `find` 方法查询单条数据，返回值为对象。如：

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model('user');
    let data = yield model.where({name: 'thinkjs'}).find();
    //data returns {name: 'thinkjs', email: 'admin@thinkjs.org', ...}
  }
}
```

如果数据表没有对应的数据，那么返回值为空对象 `{}`，可以通过 `think.isEmpty` 方法来判断返回值是否为空。

##### 查询多条数据

可以使用 `select` 方法查询多条数据，返回值为数据。如：

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model('user');
    let data = yield model.limit(2).select();
    //data returns [{name: 'thinkjs', email: 'admin@thinkjs.org'}, ...]
  }
}
```

如果数据表中没有对应的数据，那么返回值为空数组 `[]`，可以通过 `think.isEmpty` 方法来判断返回值是否为空。

##### 分页查询数据

页面中经常遇到按分页来展现某些数据，这种情况下就需要先查询总的条数，然后在查询当前分页下的数据。查询完数据后还要计算有多少页。模型中提供了 `countSelect` 方法来方便这一操作，会自动进行总条数的查询。

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model('user');
    let data = yield model.page(this.get('page'), 10).countSelect();
  }
}
```

返回值格式如下：

```js
 {
  numsPerPage: 10, //每页显示的条数
  currentPage: 1, //当前页
  count: 100, //总条数
  totalPages: 10, //总页数
  data: [{ //当前页下的数据列表
    name: 'thinkjs',
    email: 'admin@thinkjs.org'
  }, ...]
  }
```

如果传递的当前页数超过了页数范围，可以通过传递参数进行修正。`true` 为修正到第一页， `false` 为修正到最后一页，即： `countSelect(true)` 或 `countSelect(false)`。

如果总条数无法直接查询，可以将总条数作为参数传递进去，如： `countSelect(1000)`，表示总条数有1000条。

#### 删除数据

可以使用 `delete` 方法来删除数据，返回值为影响的行数。如：

```js
export default class extends think.controller.base {
  * deleteAction(){
    let model = this.model('user');
    let affectedRows = yield model.where({id: ['>', 100]}).delete();
  }
}
```

### 查询缓存

为了性能优化，项目中经常要对一些从数据库中查询的数据进行缓存。如果手工将查询的数据进行缓存，势必比较麻烦，模型中直接提供了 `cache` 方法来设置查询缓存。如：

```js
export default class extends think.model.base {
  getList(){
    //设定缓存 key 和缓存时间
    return this.cache('get_list', 3600).where({id: {'>': 100}}).select();
  }
}
```

上面的代码为对查询结果进行缓存，如果已经有了缓存，直接从缓存里读取，没有的话才从数据库里查询。缓存保存的 key 为 `get_list`，缓存时间为一个小时。

也可以不指定缓存 key，这样会自动根据 SQL 语句生成一个缓存 key。如：

```js
export default class extends think.model.base {
  getList(){
    //只设定缓存时间
    return this.cache(3600).where({id: {'>': 100}}).select();
  }
}
```


##### 缓存配置

缓存配置为模型配置中的 `cache` 字段，如：

```js
export default {
  cache: {
    on: true,
    type: '', 
    timeout: 3600
  }
}
```

* `on` 数据库缓存配置的总开关，关闭后即使程序中调用 `cache` 方法也无效。
* `type` 缓存配置类型，默认为内存，支持的缓存类型请见 [Adapter -> Cache](./adapter_cache.html)。
* `timeout` 默认缓存时间。

------

模型中更多的操作方式请见相关的 [API -> model](./api_model.html)。

