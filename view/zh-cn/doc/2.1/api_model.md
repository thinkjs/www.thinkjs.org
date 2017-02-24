## model

`think.model.base` 继承自 [think.base](./api_think_base.html) 类。

##### 使用 ES6 的语法继承该类

```js
export default class extends think.model.base {
  getList(){

  }
}
```

##### 使用普通方式继承该类

```js
module.exports = think.model({
  getList: function(){

  }
})
```

### 属性

#### model.pk

数据表主键，默认为 `id`。

#### model.name

模型名，默认从当前文件名中解析。

当前文件路径为 for/bar/app/home/model/user.js，那么解析的模型名为 `user`。

#### model.tablePrefix

数据表名称前缀，默认为 `think_`。

#### model.tableName

数据表名称，不包含前缀。默认等于模型名。

#### model.schema

数据表字段，关系型数据库默认自动从数据表分析。

#### model.indexes

数据表索引，关系数据库会自动从数据表分析。

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
  async getList(){
    //获取 user 模型实例
    let instance = this.model('user');
    let list = await instance.select();
    let ids = list.map(item => {
      return item.id;
    });
    let data = await this.where({id: ['IN', ids]}).select();
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

##### 设置缓存 key 和时间

```js
export default class extends think.model.base {
  getList(){
    return this.cache('getList', 1000).where({id: {'>': 100}}).select();
  }
}
```

##### 只设置缓存时间，缓存 key 自动生成

```js
export default class extends think.model.base {
  getList(){
    return this.cache(1000).where({id: {'>': 100}}).select();
  }
}
```

##### 设置更多的缓存信息 

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

##### 限制数据长度

```js
export default class extends think.model.base {
  getList(){
    //查询20条数据
    return this.limit(20).where({id: {'>': 100}}).select();
  }
}
```

##### 限制数据起始位置和长度

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

设置 where 查询条件。可以通过属性 `_logic` 设置逻辑，默认为 `AND`。可以通过属性 `_complex` 设置复合查询。

`注`：1、以下示例不适合 mongo model，mongo 中设置 where 条件请见 model.mongo 里的 where 条件设定。2、where 条件中的值需要在 Logic 里做数据校验，否则可能会有漏洞。

##### 普通条件

```js
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
  where1(){
    //SELECT * FROM `think_user` WHERE ( (`name` ='name') )
    return this.where({name: ['EXP', "=\"name\""]}).select();
  }
}
```

##### LIKE 条件

```js
export default class extends think.model.base {
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
export default class extens think.model.base {
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
export default class extens think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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

* `field` {String | Array} 设置要查询的字段，可以是字符串，也可以是数组
* `return` {this}

设置要查询的字段。

##### 字符串方式

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    //设置要查询的字符串，字符串方式，多个用逗号隔开
    let data = await model.field('name,title').select();
  }
}
```

##### 调用 SQL 函数

```js
export default class extends think.controller.base {
  //字段里调用 SQL 函数
  async listAction(){
    let model = this.model('user');
    let data = await model.field('id, INSTR(\'30,35,31,\',id + \',\') as d').select();
  }
}
```

##### 数组方式

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    //设置要查询的字符串，数组方式
    let data = await model.field(['name','title']).select();
  }
}
```

#### model.fieldReverse(field)

* `field` {String | Array} 反选字段，即查询的时候不包含这些字段
* `return` {this}

设置反选字段，查询的时候会过滤这些字段，支持字符串和数组 2 种方式。

#### model.table(table, hasPrefix)

* `table` {String} 表名
* `hasPrefix` {Boolean} 是否已经有了表前缀，如果 table 值含有空格，则不在添加表前缀
* `return` {this}

设置表名，可以将一个 SQL 语句设置为表名。

##### 设置当前表名

```js
export default class extends think.model.base {
  getList(){
    return this.table('test', true).select();
  }
}
```

##### SQL 语句作为表名

```js
export default class extends think.model.base {
  async getList(){
    let sql = await this.model('group').group('name').buildSql();
    let data = await this.table(sql).select();
    return data;
  }
}
```


#### model.union(union, all)

* `union` {String | Object} 联合查询 SQL 或者表名
* `all` {Boolean} 是否是 UNION ALL 方式
* `return` {this}

联合查询。

##### SQL 联合查询

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` UNION (SELECT * FROM think_pic2)
    return this.union('SELECT * FROM think_pic2').select();
  }
}
```

##### 表名联合查询

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` UNION ALL (SELECT * FROM `think_pic2`)
    return this.union({table: 'think_pic2'}, true).select();
  }
}
```

#### model.join(join)

* `join` {String | Object | Array} 要组合的查询语句，默认为 `LEFT JOIN`
* `return` {this}

组合查询，支持字符串、数组和对象等多种方式。

##### 字符串

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id
    return this.join('think_cate ON think_group.cate_id=think_cate.id').select();
  }
}
```

##### 数组

```js
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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
export default class extends think.model.base {
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

设置排序方式。

##### 字符串

```js
export default class extends think.model.base {
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
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC,name ASC
    return this.order(['id DESC', 'name ASC']).select();
  }
}
```

##### 对象

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` ORDER BY `id` DESC,`name` ASC
    return this.order({
      id: 'DESC',
      name: 'ASC'
    }).select();
  }
}
```


#### model.alias(tableAlias)

* `tableAlias` {String} 表别名
* `return` {this}

设置表别名。

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM think_user AS a;
    return this.alias('a').select();
  }
}
```

#### model.having(having)

* `having` {String} having 查询的字符串
* `return` {this}

设置 having 查询。

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` HAVING view_nums > 1000 AND view_nums < 2000
    return this.having('view_nums > 1000 AND view_nums < 2000').select();
  }
}
```

#### model.group(group)

* `group` {String} 分组查询的字段
* `return` {this}

设定分组查询。

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` GROUP BY `name`
    return this.group('name').select();
  }
}
```

#### model.distinct(distinct)

* `distinct` {String} 去重的字段
* `return` {this}

去重查询。

```js
export default class extends think.model.base {
  getList(){
    //SELECT DISTINCT `name` FROM `think_user`
    return this.distinct('name').select();
  }
}
```

#### model.explain(explain)

* `explain` {Boolean} 是否添加 explain 执行
* `return` {this}

是否在 SQL 之前添加 explain 执行，用来查看 SQL 的性能。

#### model.optionsFilter(options)

操作选项过滤。

#### model.dataFilter(data)

* `data` {Object | Array} 要操作的数据

数据过滤。

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

#### model.data(data)

* `data` {Object}

添加和更新操作时设置操作的数据。

#### model.options(options)

* `options` {Object} 

设置操作选项。如：

```js
export default class extends think.model.base {
  getList(){
    return this.options({
      where: 'id = 1',
      limit: [10, 1]
    }).select();
  }
}
```

#### model.close()

关闭数据库连接，一般情况下不要直接调用。


#### model.getSchema(table)

* `table` {String} 表名
* `return` {Promise}

获取表的字段信息，自动从数据库中读取。

#### model.getTableFields(table)

`已废弃`，使用 model.getSchema 方法替代。

#### model.getLastSql()

* `return` {String}

获取最后执行的 SQL 语句。

#### model.buildSql()

* `return` {Promise}

将当前的查询条件生成一个 SQL 语句。

#### model.parseOptions(oriOpts, extraOptions)

* `oriOpts` {Object}
* `extraOptions` {Object}
* `return` {Promise}

根据已经设定的一些条件解析当前的操作选项。

#### model.getPk()

* `return` {Promise}

返回 `pk` 的值，返回一个 Promise。

#### model.parseType(field, value)

* `field` {String} 数据表中的字段名称
* `value` {Mixed}
* `return` {Mixed}

根据数据表中的字段类型解析 value。

#### model.parseData(data)

* `data` {Object} 要解析的数据
* `return` {Object}

调用 `parseType` 方法解析数据。

#### model.add(data, options, replace)

* `data` {Object} 要添加的数据
* `options` {Object} 操作选项
* `replace` {Boolean} 是否是替换操作
* `return` {Promise} 返回插入的 ID

添加一条数据。

#### model.thenAdd(data, where)

* `data` {Object} 要添加的数据
* `where` {Object} where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时才添加数据。

#### model.addMany(dataList, options, replace)

* `dataList` {Array} 要添加的数据列表
* `options` {Object} 操作选项
* `replace` {Boolean} 是否是替换操作
* `return` {Promise} 返回插入的 ID

一次添加多条数据。

#### model.delete(options)

* `options` {Object} 操作选项
* `return` {Promise} 返回影响的行数

删除数据。

删除 id 为 7 的数据。

```js
model.delete({
  where: {id: 7}
});
```

#### model.update(data, options)

* `data` {Object} 要更新的数据
* `options` {Object} 操作选项
* `return` {Promise} 返回影响的行数

更新数据。

#### updateMany(dataList, options)

* `dataList` {Array} 要更新的数据列表
* `options` {Object} 操作选项
* `return` {Promise}

更新多条数据，dataList 里必须包含主键的值，会自动设置为更新条件。

#### model.increment(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值增加。

#### model.decrement(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值减少。

#### model.find(options)

* `options` {Object} 操作选项
* `return` {Promise} 返回单条数据

查询单条数据，返回的数据类型为对象。如果未查询到相关数据，返回值为 `{}`。

#### model.select(options)

* `options` {Object} 操作选项
* `return` {Promise} 返回多条数据

查询多条数据，返回的数据类型为数组。如果未查询到相关数据，返回值为 `[]`。

#### model.countSelect(options, pageFlag)

* `options` {Object} 操作选项
* `pageFlag` {Boolean} 当页数不合法时处理，true 为修正到第一页，false 为修正到最后一页，默认不修正
* `return` {Promise}

分页查询，一般需要结合 `page` 方法一起使用。如：

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.page(this.get('page')).countSelect();
  }
}
```

返回值数据结构如下：

```js
{
  numsPerPage: 10, //每页显示的条数
  currentPage: 1, //当前页
  count: 100, //总条数
  totalPages: 10, //总页数
  data: [{ //当前页下的数据列表
    name: "thinkjs",
    email: "admin@thinkjs.org"
  }, ...]
}
```

#### model.getField(field, one)

* `field` {String} 字段名，多个字段用逗号隔开
* `one` {Boolean | Number} 获取的条数
* `return` {Promise}

获取特定字段的值。

#### model.count(field)

* `field` {String} 字段名
* `return` {Promise} 返回总条数

获取总条数。

#### model.sum(field)

* `field` {String} 字段名
* `return` {Promise}

对字段值进行求和。

#### model.min(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最小值。

#### model.max(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最大值。

#### model.avg(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的平均值。

#### model.query(...args)

* `return` {Promise}

指定 SQL 语句执行查询。

#### model.execute(...args)

* `return` {Promise}

执行 SQL 语句。


#### model.parseSql(sql, ...args)

* `sql` {String} 要解析的 SQL 语句
* `return` {String}

解析 SQL 语句，调用 `util.format` 方法解析 SQL 语句，并将 SQL 语句中的 `__TABLENAME__` 解析为对应的表名。

```js
export default class extends think.model.base {
  getSql(){
    let sql = 'SELECT * FROM __GROUP__ WHERE id=%d';
    sql = this.parseSql(sql, 10);
    //sql is SELECT * FROM think_group WHERE id=10
  }
}
```

#### model.startTrans()

* `return` {Promise}

开启事务。

#### model.commit()

* `return` {Promise}

提交事务。

#### model.rollback()

* `return` {Promise}

回滚事务。

#### model.transaction(fn)

* `fn` {Function} 要执行的函数
* `return` {Promise}

使用事务来执行传递的函数，函数要返回 Promise。

```js
export default class extends think.model.base {
  updateData(data){
    return this.transaction(async () => {
      let insertId = await this.add(data);
      let result = await this.model('user_cate').add({user_id: insertId, cate_id: 100});
      return result;
    })
  }
}
```


