## CRUD 操作

### 添加数据

#### 添加一条数据

使用 `add` 方法可以添加一条数据，返回值为插入数据的 id。如：

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```

#### 添加多条数据

使用 `addMany` 方法可以添加多条数据，如：

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.addMany([
      {name: 'xxx', pwd: 'yyy'},
      {name: 'xxx1', pwd: 'yyy1'}
    ]);
  }
}
```

#### thenAdd

数据库设计时，我们经常需要把某个字段设为唯一，表示这个字段值不能重复。这样添加数据的时候只能先去查询下这个数据值是否存在，如果不存在才进行插入操作。

模型中提供了 `thenAdd` 方法简化这一操作。

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model('user');
    //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
    let result = await model.thenAdd({name: 'xxx', pwd: 'yyy'}, {name: 'xxx'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```


### 更新数据

#### update

更新数据使用 `update` 方法，返回值为影响的行数。如：

```js
export default class extends think.controlle.base {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

默认情况下更新数据必须添加 where 条件，以防止误操作导致所有数据被错误的更新。如果确认是更新所有数据的需求，可以添加 `1=1` 的 where 条件进行，如：

```js
export default class extends think.controlle.base {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where('1=1').update({email: 'admin@thinkjs.org'});
  }
}
```

#### increment

可以通过 `increment` 方法给符合条件的字段增加特定的值，如：

```js
export default class extends think.model.base {
  updateViewNums(id){
    return this.where({id: id}).increment('view_nums', 1); //将阅读数加 1
  }
}
```

#### decrement

可以通过 `decrement` 方法给符合条件的字段减少特定的值，如：

```js
export default class extends think.model.base {
  updateViewNums(id){
    return this.where({id: id}).decrement('coins', 10); //将金币减 10 
  }
}
```

### 查询数据

模型中提供了多种方式来查询数据，如：查询单条数据，查询多条数据，读取字段值，读取最大值，读取总条数等。

#### 查询单条数据

可以使用 `find` 方法查询单条数据，返回值为对象。如：

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.where({name: 'thinkjs'}).find();
    //data returns {name: 'thinkjs', email: 'admin@thinkjs.org', ...}
  }
}
```

如果数据表没有对应的数据，那么返回值为空对象 `{}`，可以通过 `think.isEmpty` 方法来判断返回值是否为空。

#### 查询多条数据

可以使用 `select` 方法查询多条数据，返回值为数据。如：

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.limit(2).select();
    //data returns [{name: 'thinkjs', email: 'admin@thinkjs.org'}, ...]
  }
}
```

如果数据表中没有对应的数据，那么返回值为空数组 `[]`，可以通过 `think.isEmpty` 方法来判断返回值是否为空。

#### 分页查询数据

页面中经常遇到按分页来展现某些数据，这种情况下就需要先查询总的条数，然后在查询当前分页下的数据。查询完数据后还要计算有多少页。模型中提供了 `countSelect` 方法来方便这一操作，会自动进行总条数的查询。

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model('user');
    let data = await model.page(this.get('page'), 10).countSelect();
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

#### count

可以通过 `count` 方法查询符合条件的总条数，如：

```js
export default class extends think.model.base {
  getMin(){
    //查询 status 为 publish 的总条数
    return this.where({status: 'publish'}).count();
  }
}
```

#### sum

可以通过 `sum` 方法查询符合条件的字段总和，如：

```js
export default class extends think.model.base {
  getMin(){
    //查询 status 为 publish 字段 view_nums 的总和
    return this.where({status: 'publish'}).sum('view_nums');
  }
}
```

#### max

可以通过 `max` 方法查询符合条件的最大值，如：

```js
export default class extends think.model.base {
  getMin(){
    //查询 status 为 publish，字段 comments 的最大值
    return this.where({status: 'publish'}).max('comments');
  }
}
```

#### min

可以通过 `min` 方法查询符合条件的最小值，如：

```js
export default class extends think.model.base {
  getMin(){
    //查询 status 为 publish，字段 comments 的最小值
    return this.where({status: 'publish'}).min('comments');
  }
}
```

#### 查询缓存

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

缓存配置为模型配置中的 `cache` 字段（ 配置文件在 src/common/config/db.js），如：

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


### 删除数据

可以使用 `delete` 方法来删除数据，返回值为影响的行数。如：

```js
export default class extends think.controller.base {
  async deleteAction(){
    let model = this.model('user');
    let affectedRows = await model.where({id: ['>', 100]}).delete();
  }
}
```


------

模型中更多的操作方式请见相关的 [API -> model](./api_model.html)。
