## MongoDB

The `think.model.mongo` class inherit from [think.model.base](./api_model.html)。

### Inheritence with ES6:6

```js
export default class extends think.model.mongo {
  getList(){

  }
}
```

### Inheritence With Normal Way

```js
module.exports = think.model('mongo', {
  getList: function(){

  }
})
```

### Method

#### model.indexes

Set indexes of field, before operate data it will set index automatically.

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    // set indexes
    this.indexes = { 

    }
  }
}
```

##### Single field index
```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    // set index
    this.indexes = { 
      name: 1
    }
  }
}
```

##### Unique index

With `$unique` to set unique index, like:

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    // set index 
    this.indexes = { 
      name: {$unique: 1}
    }
  }
}
```

##### Multi-field index

Multi-field index, like:

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    // set index
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

Primary key name, default is `_id`, get it with `this.getPk`.

### Function

#### model.where(where)

Where condition in mongo model is different from relational database.

##### equal condition

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: "snacks" }).select();
  }
}
```

##### AND condition

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: 'food', price: { $lt: 9.95 } }).select();
  }
}
```

##### OR condition

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

##### Inserted document


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

##### IN condition

```js
export default class extends think.model.mongo {
  where1(){
    return this.where({ type: { $in: [ 'food', 'snacks' ] } }).select();
  }
}
```

------

More details in <https://docs.mongodb.org/manual/reference/operator/query/#query-selectors>。

#### model.collection()

* `return` {Promise}

Get handler which operate current table.

```js
export default class extends think.model.mongo {
  async getIndexes(){
    let collection = await this.collection();
    return collection.indexes();
  }
}
```

#### model.aggregate(options)

Aggregate query, more details in <https://docs.mongodb.org/manual/core/aggregation-introduction/>。

#### model.mapReduce(map, reduce, out)

mapReduce operate, more details in <https://docs.mongodb.org/manual/core/map-reduce/>。


#### model.createIndex(indexes, options)

* `indexes` {Object} index options
* `options` {Object}

Create indexes.

#### model.getIndexes()

* `return` {Promise}

Get indexes.
