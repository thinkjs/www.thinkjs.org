## MongoDB

ThinkJS 支持使用 MongoDB 数据库，底层使用 [mongodb](https://www.npmjs.com/package/mongodb) 模块。

如果想在项目中使用 Mongoose 来代替默认的 Mongo 模型，可以参见： http://welefen.com/post/use-mongoose-in-thinkjs.html

### 配置

使用 MongoDB 数据库，需要将模型中的配置 `type` 改为 `mongo`，修改配置文件 `src/common/config/db.js`：

```js
export default {
  type: 'mongo'
}
```

#### 多 HOST

可以将配置里的 `host` 字段设置为数据支持多 host 的功能，如：

```js
export default {
  type: 'mongo',
  adapter: {
    mongo: {
      host: ['10.0.0.1', '10.0.0.2'],
      port: ['1234', '5678']
    }
  }
}
```

`注`：此配置项在 `2.0.14` 版本中支持。

#### 配置选项

如果要在连接 MongoDB 服务的时候添加额外的参数，可以通过在 `options` 里追加，如：

```js
export default {
  type: 'mongo',
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

上面的配置后，连接 MongoDB 的 URL 变成类似于 `mongodb://127.0.0.1:27017/?authSource=admin&replicaSet=xxx`。

更多额外的配置请见 <http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/>。

### 创建模型

可以通过命令 `thinkjs model [name] --mongo` 来创建模型，如：

```js
thinkjs model user --mongo
```

执行完成后，会创建文件 `src/common/model/user.js`。如果想创建在其他模块下，需要带上具体的模块名。如：

```js
thinkjs model home/user --mongo
```

会在 `home` 模块下创建模型文件，文件为 `src/home/model/user.js`。

### 模型继承

模型需要继承 `think.model.mongo` 类，如果当前类不是继承该类，需要手动修改。

#### ES6 语法

```js
export default class extends think.model.mongo {

}
```

#### 动态创建类的方式

```js
module.exports = think.model('mongo', {
  
})
```

### CRUD 操作

CRUD 操作和 Mysql 中接口相同，具体请见 [模型 -> 介绍](./model_intro.html#toc-d84)。

### 创建索引

mongo 模型可以配置索引，在增删改查操作之前模型会自动去创建索引，配置放在 `indexes` 属性里。如：

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

#### 单字段索引
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

#### 唯一索引

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

#### 多字段索引

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

### 获取索引

可以通过方法 `getIndexes` 获取创建的索引。如：

```js
export default class extends think.controller.base {
  async indexAction(){
    let model = this.model('user');
    let indexes = await model.getIndexes();
  }
}
```

### aggregate

可以通过 `aggregate` 方法进行混合操作。如：

```js
export default class extends think.model.mongo {
  match(){
    return this.aggregate([
      {$match: {status: 'A'}},
      {$group: {_id: "$cust_id", total: {$sum: "$amount"}}}
    ]);
  }
}
```

具体请见 <https://docs.mongodb.org/manual/core/aggregation-introduction/>。

### MapReduce

可以通过 `mapReduce` 方法进行 MapReduce 操作。如：

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

具体请见 <https://docs.mongodb.org/manual/core/aggregation-introduction/#map-reduce>。