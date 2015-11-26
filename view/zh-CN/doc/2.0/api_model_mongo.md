## MongoDB

`think.model.mongo` 继承类 [think.model.base](./api_model.html)。

##### 使用 ES6 的语法继承该类

```js
export default class extends think.model.mongo {
  getList(){

  }
}
```

##### 使用普通方式继承该类

```js
module.exports = think.model('mongo', {
  getList: function(){

  }
})
```

### 属性

#### model.fields

设置字段，如：

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //设置字段
    this.fields = {
      name: {
        type: 'string'
      },
      pwd: {
        type: 'string'
      }
    }
  }
}
```

`注`：目前框架并不会对字段进行检查。

#### model.indexes

设置字段索引，数据操作之前会自动创建索引。

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //配置索引
    this.indexes = { 

    }
  }
}
```

##### 单字段索引
```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //配置索引
    this.indexes = { 
      name: 1
    }
  }
}
```

##### 唯一索引

通过 `$unique` 来指定为唯一索引，如：

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //配置索引
    this.indexes = { 
      name: {$unique: 1}
    }
  }
}
```

##### 多字段索引

可以将多个字段联合索引，如：

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //配置索引
    this.indexes = { 
      email: 1
      test: {
        name: 1,
        title: 1,
        $unique: 1
      }
    }
  }
}
```

#### model.pk

主键名，默认为 `_id`，可以通过 `this.getPk` 方法获取。

### 方法

#### model.where(where)

mongo 模型中的 where 条件设置和关系数据库中不太一样。

##### 等于判断

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: "snacks" }).select();
  }
}
```

##### AND 条件

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: 'food', price: { $lt: 9.95 } }).select();
  }
}
```

##### OR 条件

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({
     $or: [ { qty: { $gt: 100 } }, { price: { $lt: 9.95 } } ]
    }).select();
  }
  where2(){
    return this.where({
     type: 'food',
     $or: [ { qty: { $gt: 100 } }, { price: { $lt: 9.95 } } ]
   }).select();
  }
}
```

##### 内嵌文档


```js
export default class extends think.model.mongo {
  where1(){
    return this.where( {
      producer:
        {
          company: 'ABC123',
          address: '123 Street'
        }
    }).select();
  }
  where2(){
    return this.where({ 'producer.company': 'ABC123' } ).select();
  }
}
```

##### IN 条件

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: { $in: [ 'food', 'snacks' ] } }).select();
  }
}
```

------

更多文档请见 <https://docs.mongodb.org/manual/reference/operator/query/#query-selectors>。

#### model.collection()

* `return` {Promise}

获取操作当前表的句柄。

```js
export default class extends think.model.mongo {
  async getIndexes(){
    let collection = await this.collection();
    return collection.indexes();
  }
}
```

#### model.aggregate(options)

聚合查询。具体请见 <https://docs.mongodb.org/manual/core/aggregation-introduction/>。

#### model.mapReduce(map, reduce, out)

mapReduce 操作，具体请见 <https://docs.mongodb.org/manual/core/map-reduce/>。


#### model.createIndex(indexes, options)

* `indexes` {Object} 索引配置
* `options` {Object}

创建索引。

#### model.getIndexes()

* `return` {Promise}

获取索引。
