## MongoDB

ThinkJS supports MongoDB database, underlying module is [mongodb](https://www.npmjs.com/package/mongodb).

### Config

Change `type` in model configuration to `mongo` to use MongoDB database:

```js
export default {
  type: "mongo"
}
```

### Config options

In order to add additional params when connecting MongoDB service, add them to `options`:

```js
export default {
  type: "mongo",
  adapter: {
    mongo: {
      options: {
        authSource: 'admin',
        replicaSet: 'xxx'
      }
    }
  }
}
```

Based on this config, the connection URL will become to `mongodb://127.0.0.1:27017/?authSource=admin`.

For more additional options, please read [http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/](http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/).

### Create Model

Use command `thinkjs model [name] --mongo` to create model:

```js
thinkjs model user --mongo
```

After executing, `src/common/model/user.js` will be created. If you want to place it within other module, add the specific module name:

```js
thinkjs model home/user --mongo
```

This will create model file within `home` module, file name is `src/home/model/user.js`.

### Model Inheritence

Model has to inherit `think.model.mongo` class. If current class doesn't inherit it, you have to modify it:

#### ES6 Way

```js
export default class extends think.model.mongo {

}
```

#### Dynamically Creating

```js
module.exports = think.model("mongo", {

})
```

### CURD Operations

CURD operations are same as Mysql, just read [Model -> Introduction](https://thinkjs.org/zh-cn/doc/2.0/model_intro.html#toc-d84).

### Create Index

mongo model can config index, model will create index automatically before CURD operations. Configurations are placed in `indexes` property:

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //config index
    this.indexes = { 

    }
  }
}
```

#### Single Index

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //config index
    this.indexes = { 
      name: 1
    }
  }
}
```

#### Unique Index

Use `$unique` to set unique index:

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //config index
    this.indexes = { 
      name: {$unique: 1}
    }
  }
}
```

#### Multiple Fields Index

You can combine multiple fields to create index:

```js
export default class extends think.model.mongo {
  init(...args){
    super.init(...args);
    //config index
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

### Get Index

Use `getIndexes` to get created indexes: 

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model("user");
    let indexes = await model.getIndexes();
  }
}
```

### aggregate

Use `aggregate` method to do aggregation:

```js
export default class extends think.model.mongo {
  match(){
    return this.aggregate([
      {$match: {status: "A"}},
      {$group: {_id: "$cust_id", total: {$sum: "$amount"}}}
    ]);
  }
}
```

Details stay at [https://docs.mongodb.org/manual/core/aggregation-introduction/](https://docs.mongodb.org/manual/core/aggregation-introduction/).

### MapReduce

Use `mapReduce` method to do MapReduce operations:

```js
export default class extends think.model.mongo {
  execMapReduce(){
    let map = () => {
      emit(this.cust_id, this.amount);
    }
    let reduce = (key, values) => {
      return Array.sum(values);
    }
    return this.mapReduce(map, reduce, {
      query: {status: "A"},
      out: "order_totals"
    })
  }
}
```

Details stay at [https://docs.mongodb.org/manual/core/aggregation-introduction/#map-reduce](https://docs.mongodb.org/manual/core/aggregation-introduction/#map-reduce).

This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_mongodb.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_mongodb.md).
