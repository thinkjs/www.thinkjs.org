## 模型介绍

项目开发中，经常要操作数据库，如：增删改查等操作。模型就是为了方便操作数据库进行的封装，一个模型对应数据库中的一个数据表。

### 创建模型

模型定义都是放在 `model/` 文件夹中，如：`src/home/model/user.js`，表示在 `home` 模块下创建了对应 `user` 数据表的模型。

** ES6 语法 **

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    ...
  }
  getList(){
    ...
  }
}
```

** 动态创建类的方式 **

```js
module.exports = think.model({
  init: function(){
    this.super('init', arguments);
    ...
  },
  getList: function(){
    ...
  }
})
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

** ES6 方式 **

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.tablePrefix = ''; //将数据表前缀设置为空
    this.tableName = 'user2'; //将对应的数据表名设置为 user2
  }
}
```

** 动态创建类方式 **

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

** 添加一条数据 **

使用 `add` 方法可以添加一条数据，返回值为插入数据的 id。如：

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model('user');
    let insertId = yield model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```

** 添加多条数据 **

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

** thenAdd **

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

** 查询单条数据 **

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

** 查询多条数据 **

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

** 分页查询数据 **

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


------

模型中更多的操作方式请见相关的 [API](./api_model.html)。