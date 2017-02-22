## model

The `think.model.base` class inherit from [think.base](./api_think_base.html) class.

##### Inheritence with ES6:

```js
export default class extends think.model.base {
  getList(){

  }
}
```

##### Inheritence With Normal Way

```js
module.exports = think.model({
  getList: function(){

  }
})
```

### Properties

#### model.pk

The primary key of databse, defautl is `id`.

#### model.name

Model name, default is current file name.

Suppose current file path is for/bar/app/home/model/user.js, then the model name is `user`.

#### model.tablePrefix

The Prefiex of table in database, default is `think_`.

#### model.tableName

The name of data table, not contains prefiex name, default equals to model name.

#### model.fields

The fields of data table,  auto analyse the data table.

#### model.indexes

The indexes of data table, auto analyse the data table.

#### model.readonlyFields

The readonly fields list, when data updated, these fields will not been updated.

#### model.config

Config, specify when instancing.

#### model._db

Handler of connect database.

#### model._data

Data of operation.

#### model._options

Options of operation.

### Methods

#### model.model(name, options, module)

* `name` {String} model name
* `options` {Object} confing options
* `module` {String} module name
* `return` {Object}

Get instance of model, it can read cross module.

```js
export default class extends think.model.base {
  async getList(){
    // get instance of user model
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

Get the prefix of table.

#### model.getConfigKey()

* `return` {String}

Get config key, use it when cache db handler.

#### model.db()

* `return` {Object}

Based on current config to get instance of db, if exist, return directly.

#### model.getModelName()

* `return` {String} model name

Return directly if configed, or parse current file name.

#### model.getTableName()

* `return` {String} get table name, contains prefix

Get table name, contains prefix.

#### model.cache(key, timeout)

* `key` {String}  cache key
* `timeout` {Number} cache expire time, the unit is seconds.
* `return` {this}

Set cache config.

##### Set key and time of cache

```js
export default class extends think.model.base {
  getList(){
    return this.cache('getList', 1000).where({id: {'>': 100}}).select();
  }
}
```

##### Only set cache time, cache key auto generate

```js
export default class extends think.model.base {
  getList(){
    return this.cache(1000).where({id: {'>': 100}}).select();
  }
}
```

##### Set more cache information 

```js
export default class extends think.model.base {
  getList(){
    return this.cache({
      key: 'getList',
      timeout: 1000,
      type: 'file' // use file cache
    }).where({id: {'>': 100}}).select();
  }
}
```

#### model.limit(offset, length)

* `offset` {Number} set the start position of query 
* `length` {Number} set the length of query
* `return` {this}

Set the limit of query result.

##### Set length of data

```js
export default class extends think.model.base {
  getList(){
    // query twenty data
    return this.limit(20).where({id: {'>': 100}}).select();
  }
}
```

##### Limit data start position and length

```js
export default class extends think.model.base {
  getList(){
    // start from position 100, query twenty data
    return this.limit(100, 20).where({id: {'>': 100}}).select();
  }
}
```

#### model.page(page, listRows)

* `page` {Number} current page, start with one
* `listRows` {Number} number of per page
* `return` {this}

Set query pagination data, convert to `limit` data automatically.

```js
export default class extends think.model.base {
  getList(){
    // query the second page data, ten data of per page.
    return this.page(2, 10).where({id: {'>': 100}}).select();
  }
}
```

#### model.where(where)

* `where` {String | Object} where condition
* `return` {this}

Set where query condition, it can set logic with method `_logic`, default is `AND`. Mulpty query with method `__complex`.

`Noatice`: 1. example below don't suit for mengo model.in mongo, seting where condition to seen in model.mongo. 2.where condition need to been validated in Logic, or maybe cause some bug.

##### Normal condition

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

##### null condition

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

##### EXP condition

ThinkJS will transfer field and value by default for security bugs. sometimes, if not want to transfer in some special case, you can use EXP way, like:

```js
export default class extends think.model.base {
  where1(){
    //SELECT * FROM `think_user` WHERE ( (`name` ='name') )
    return this.where({name: ['EXP', "=\"name\""]}).select();
  }
}
```

##### LIKE condition

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
  //like mult-value
  where3(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE 'welefen' OR `title` LIKE 'suredy') )
    return this.where({title: ['like', ['welefen', 'suredy']]}).select();
  }
  // muti-field or relation like one value
  where4(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') OR (`content` LIKE '%welefen%') )
    return this.where({'title|content': ['like', '%welefen%']}).select();
  }
  // muti-filed and relation like one value
  where5(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') AND (`content` LIKE '%welefen%') )
    return this.where({'title&content': ['like', '%welefen%']}).select();
  }
}
```


##### IN condition

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

##### BETWEEN query

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

##### muti-field query

```js
export default class extends think.model.base {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) AND ( `title` = 'www' )
    return this.where({id: 10, title: "www"}).select();
  }
  // modify logic to OR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) OR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'OR'}).select();
  }
  // modify logic to XOR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) XOR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'XOR'}).select();
  }
}
```

##### muti-condition query

```js
export default class extends think.model.base {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` > 10 AND `id` < 20 )
    return this.where({id: {'>': 10, '<': 20}}).select();
  }
  // modify logic to OR 
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` < 10 OR `id` > 20 )
    return this.where({id: {'<': 10, '>': 20, _logic: 'OR'}}).select()
  }
}
```

##### complex query

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

* `field` {String | Array} set query field, can be string or array
* `return` {this}

Set query field.

##### String way

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    // set string need to query, in string way, use comma to split
    let data = await model.field('name,title').select();
  }
}
```

##### Invoke SQL function

```js
export default class extends think.controller.base {
  // invoke sql function in field
  async listAction(){
    let model = this.model('user');
    let data = await model.field('id, INSTR(\'30,35,31,\',id + \',\') as d').select();
  }
}
```

##### array way

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    // set query string in array way
    let data = await model.field(['name','title']).select();
  }
}
```

#### model.fieldReverse(field)

* `field` {String | Array} reverse field, means query except this field
* `return` {this}

Set reverse field, it will filter this filed when querying, it support string way and array way.

#### model.table(table, hasPrefix)

* `table` {String} table way
* `hasPrefix` {Boolean} whether tabel has prefix or not, if table value contains space, then don't add prefix.
* `return` {this}

Set table name, which can named a SQL statement.

##### Set current table name

```js
export default class extends think.model.base {
  getList(){
    return this.table('test', true).select();
  }
}
```

##### SQL statement as table name

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

* `union` {String | Object} union query SQL or table name
* `all` {Boolean} Whether is UNION ALL way or not
* `return` {this}

Union query.

##### SQL union query联合查询

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` UNION (SELECT * FROM think_pic2)
    return this.union('SELECT * FROM think_pic2').select();
  }
}
```

##### union query table name

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` UNION ALL (SELECT * FROM `think_pic2`)
    return this.union({table: 'think_pic2'}, true).select();
  }
}
```

#### model.join(join)

* `join` {String | Object | Array} conbine statement, default is `LEFT JOIN`
* `return` {this}

Conbine query, support string, array, object and so on.

##### String

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id
    return this.join('think_cate ON think_group.cate_id=think_cate.id').select();
  }
}
```

##### Array

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

##### Object: single table

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` INNER JOIN `think_cate` AS c ON think_user.`cate_id`=c.`id`
    return this.join({
      table: 'cate', 
      join: 'inner', //join way, contains left, right, inner three ways
      as: 'c', // table alias name
      on: ['cate_id', 'id'] //ON condition
    }).select();
  }
}
```

##### Object: multi-JOIN

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


##### Object: muti-table

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
        join: 'left', // has left,right,inner three values
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

##### Object: ON condition has muti-field

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN `think_cate` ON think_user.`id`=think_cate.`id` LEFT JOIN `think_group_tag` ON think_user.`id`=think_group_tag.`group_id` LEFT JOIN `think_tag` ON (think_user.`id`=think_tag.`id` AND think_user.`title`=think_tag.`name`)
    return this.join({
      cate: {on: 'id, id'},
      group_tag: {on: ['id', 'group_id']},
      tag: {
        on: { // multi-field's ON
          id: 'id',
          title: 'name'
        }
      }
    }).select()
  }
}
```

##### Object: table value is SQL statement

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

* `order` {String | Array | Object} sort order
* `return` {this}

Set sort order.

##### String

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



##### Array

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC,name ASC
    return this.order(['id DESC', 'name ASC']).select();
  }
}
```

##### Object

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

* `tableAlias` {String} table alias name
* `return` {this}

Set tabel alias name.

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM think_user AS a;
    return this.alias('a').select();
  }
}
```

#### model.having(having)

* `having` {String} query string with having
* `return` {this}

Set having query.

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` HAVING view_nums > 1000 AND view_nums < 2000
    return this.having('view_nums > 1000 AND view_nums < 2000').select();
  }
}
```

#### model.group(group)

* `group` {String} group query field
* `return` {this}

Set group query.

```js
export default class extends think.model.base {
  getList(){
    //SELECT * FROM `think_user` GROUP BY `name`
    return this.group('name').select();
  }
}
```

#### model.distinct(distinct)

* `distinct` {String} distinct field
* `return` {this}

Distinct field

```js
export default class extends think.model.base {
  getList(){
    //SELECT DISTINCT `name` FROM `think_user`
    return this.distinct('name').select();
  }
}
```

#### model.explain(explain)

* `explain` {Boolean} Whether add explain execution or not
* `return` {this}

Whether add explain execution before SQL for performance of SQL or not.

#### model.optionsFilter(options)

Options for filter.

#### model.dataFilter(data)

* `data` {Object | Array} data to operate

Filter data.

#### model.beforeAdd(data)

* `data` {Object} data will add

Add before operate.

#### model.afterAdd(data)

* `data` {Object} data will add

Add after data.

#### model.afterDelete(data)

Delete after operation.

#### model.beforeUpdate(data)

* `data` {Object} data will add

Update before operation.

#### model.afterUpdate(data)

* `data` {Object} data will add

Update after operation.

#### model.afterFind(data)

* `data` {Object} single data to query
* `return` {Object | Promise}

After `find` query operation.

#### model.afterSelect(data)

* `data` [Array] data to query
* `return` {Array | Promise}

After `select` query operation.

#### model.data(data)

* `data` {Object}

The data which to added and updated.

#### model.options(options)

* `options` {Object} 

Config operate options, like:

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

Close database connection, normally donot invoke directly.


#### model.getTableFields(table)

* `table` {String} table name
* `return` {Promise}

Get table filed information, read from database directly.

#### model.getLastSql()

* `return` {String}

Get the last SQL statement.

#### model.buildSql()

* `return` {Promise}

Make current query condition to generate a SQL statement.

#### model.parseOptions(oriOpts, extraOptions)

* `oriOpts` {Object}
* `extraOptions` {Object}
* `return` {Promise}

Options which are based on some conditions to parse current operation.

#### model.getPk()

* `return` {Promise}

Return value of `pk`, returning is a Promise.

#### model.parseType(field, value)

* `field` {String} the field name of data table
* `value` {Mixed}
* `return` {Mixed}

Based on filed type of data table to pase value.

#### model.parseData(data)

* `data` {Object} data to pase
* `return` {Object}

Invoke `paseType` to parse data.

#### model.add(data, options, replace)

* `data` {Object} data to add
* `options` {Object} operate options
* `replace` {Boolean} whether is replace or not
* `return` {Promise} return inserted ID

add one data.

#### model.thenAdd(data, where)

* `data` {Object} data to add
* `where` {Object} where condition
* `return` {Promise}

When where condition didn't passed any data then to add data.

#### model.addMany(dataList, options, replace)

* `dataList` {Array} data list to add
* `options` {Object} operate options
* `replace` {Boolean} is replace or not
* `return` {Promise} return the inserted ID

Add many data in one time.

#### model.delete(options)

* `options` {Object} operate options
* `return` {Promise} return affected row

Delete data.

#### model.update(data, options)

* `data` {Object} data to update
* `options` {Object} operate options
* `return` {Promise} return affected rows

Updata data.

#### updateMany(dataList, options)

* `dataList` {Array} data to update
* `options` {Object} operate options
* `return` {Promise}

Update multi-data, dataList must contains value of primay key, it will set to update condition automatically.

#### model.increment(field, step)

* `field` {String} field name
* `step` {Number} add value, default is 1
* `return` {Promise}

Increase value of field.

#### model.decrement(field, step)

* `field` {String} field name
* `step` {Number} decrease value, default is 1
* `return` {Promise}

Decrease value of field.

#### model.find(options)

* `options` {Object} operate options
* `return` {Promise} return one data

Query one data, type of data is object, if there is not result, return `{}`.

#### model.select(options)

* `options` {Object} operate options
* `return` {Promise} return multi-data

Query many data, type of data is array, if there is not result, return `[]`.

#### model.countSelect(options, pageFlag)

* `options` {Object} operate options
* `pageFlag` {Boolean} if page number is illegal, true means changed to first page, false means changed to last page, default is no change.
* `return` {Promise}

Page query, normally need to use with `page`, like:

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.page(this.get('page')).countSelect();
  }
}
```

returned data structure like this below:

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

* `field` {String} field name, split with comma
* `one` {Boolean | Number} the number of result
* `return` {Promise}

Get value of specify field.

#### model.count(field)

* `field` {String} field name
* `return` {Promise} return the number of fields

Get the number of fields.

#### model.sum(field)

* `field` {String} field name
* `return` {Promise}

Get the sum of field value

#### model.min(field)

* `field` {String} field name
* `return` {Promise}

Get the minimum of field

#### model.max(field)

* `field` {String} field name
* `return` {Promise}

Get the maximum of field

#### model.avg(field)

* `field` {String} field name
* `return` {Promise}

Get the avg of field

#### model.query(...args)

* `return` {Promise}

Specify SQL statement to query.

#### model.execute(...args)

* `return` {Promise}

Execute SQL statement.


#### model.parseSql(sql, ...args)

* `sql` {String} to parsed SQL statement
* `return` {String}

Paser SQL statement, invoke `util.format` to parse SQL statement, and parse `__TABLENAME__` of SQL statement to tabel name.

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

Start transaction.

#### model.commit()

* `return` {Promise}

Commit transaction.

#### model.rollback()

* `return` {Promise}

rollback transaction.

#### model.transaction(fn)

* `fn` {Function} to executed function
* `return` {Promise}

Use transaction to execute passed function, which must return Promise.

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


