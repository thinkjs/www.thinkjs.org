## model

`think.model.base`继承自 [think.base](./api_think_base.html) 类。

** 使用 ES6 的语法继承该类 **

```js
export default class extends think.model.base {
  getList(){

  }
}
```

** 使用普通方式继承该类 **

```js
module.exports = think.model({
  getList: function(){

  }
})
```

### 属性

#### model.pk

数据表主键，默认为`id`。

#### model.name

模型名，默认从当前文件名中解析。

当前文件路径为 for/bar/app/home/model/user.js，那么解析的模型名为`user`。

#### model.tablePrefix

数据表名称前缀，默认为`think_`。

#### model.tableName

数据表名称，不包含前缀。默认等于模型名。

#### model.fields

数据表字段，默认自动从数据表分析。

#### model.indexes

数据表索引，默认自动从数据表分析。

#### model.readonlyFields

只读字段列表，数据更新时不会更新这些字段。

#### model.config

配置，实例化的时候指定。

#### model._db

连接数据库句柄。

#### model._data

操作的数据。

#### model._options

操作选项。

### 方法

#### model.model(name, options, module)

* `name` {String} 模型名称
* `options` {Object} 配置项
* `module` {String} 模块名
* `return` {Object}

获取模型实例，可以跨模块获取。

```js
export default class extends think.model.base {
  * getList(){
    //获取 user 模型实例
    let instance = this.model('user');
    let list = yield instance.select();
    let ids = list.map(item => {
      return item.id;
    });
    let data = yield this.where({id: ['IN', ids]}).select();
    return data;
  }
}
```

#### model.getTablePrefix()

* `return` {string}

获取表名前缀。

#### model.getConfigKey()

* `return` {String}

获取配置对应的 key，缓存 db 句柄时使用。

#### model.db()

* `return` {Object}

根据当前的配置获取 db 实例，如果已经存在则直接返回。

#### model.getModelName()

* `return` {String} 模型名称

如果已经配置则直接返回，否则解析当前的文件名。

#### model.getTableName()

* `return` {String} 获取表名，包含表前缀

获取表名，包含表前缀。

#### model.cache(key, timeout)

* `key` {String}  缓存 key
* `timeout` {Number} 缓存有效时间，单位为秒
* `return` {this}

设置缓存选项。

** 设置缓存 key 和时间 **

```js
export default class extends think.model.base {
  getList(){
    return this.cache('getList', 1000).where({id: {'>': 100}}).select();
  }
}
```

** 只设置缓存时间，缓存 key 自动生成 **

```js
export default class extends think.model.base {
  getList(){
    return this.cache(1000).where({id: {'>': 100}}).select();
  }
}
```

** 设置更多的缓存信息 ** 

```js
export default class extends think.model.base {
  getList(){
    return this.cache({
      key: 'getList',
      timeout: 1000,
      type: 'file' //使用文件方式缓存
    }).where({id: {'>': 100}}).select();
  }
}
```

#### model.limit(offset, length)

* `offset` {Number} 设置查询的起始位置 
* `length` {Number} 设置查询的数据长度
* `return` {this}

设置查询结果的限制条件。

** 限制数据长度 **

```js
export default class extends think.model.base {
  getList(){
    //查询20条数据
    return this.limit(20).where({id: {'>': 100}}).select();
  }
}
```

** 限制数据起始位置和长度 **

```js
export default class extends think.model.base {
  getList(){
    //从起始位置100开始查询20调数据
    return this.limit(100, 20).where({id: {'>': 100}}).select();
  }
}
```

#### model.page(page, listRows)

* `page` {Number} 当前页，从 1 开始
* `listRows` {Number} 每页的条数
* `return` {this}

设置查询分页数据，自动转化为 `limit` 数据。

```js
export default class extends think.model.base {
  getList(){
    //查询第 2 页数据，每页 10 条数据
    return this.page(2, 10).where({id: {'>': 100}}).select();
  }
}
```

#### model.where(where)

* `where` {String | Object} where 条件
* `return` {this}

设置 where 查询条件。



#### model.field(field)

设置要查询的字段。

```js

```

#### model.fieldReverse(field)

#### model.table(table, hasPrefix)

#### model.union(union, all)

#### model.join(join)

#### model.order(order)

#### model.alias(tableAlias)

#### model.having(having)

#### model.group(group)

#### model.lock(lock)

#### model.distinct(distinct)

#### model.explain(explain)

#### model._optionsFilter(options)

#### model._dataFilter(data)

#### model._beforeAdd(data)

#### model._afterAdd(data)

#### model._afterDelete(data)

#### model._beforeUpdate(data)

#### model._afterUpdate(data)

#### model._afterFind(data)

#### model._afterSelect(data)

#### model.data(data)

#### model.options(options)

#### model.close()

