## CRUD Operations

### Create Data

#### add

Use `add` method to add a new record, return value is the id of inserted record:

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model("user");
    let insertId = await model.add({name: "xxx", pwd: "yyy"});
  }
}
```

#### addMany

Use `addMany` create many records:

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model("user");
    let insertId = await model.addMany([
      {name: "xxx", pwd: "yyy"},
      {name: "xxx1", pwd: "yyy1"}
    ]);
  }
}
```

#### thenAdd

We often need to prevent a field from duplication when designing database. So it's common to query whether data exists before inserting and just insert if it doesn't exist.

Model provides `thenAdd` to support this manipulation:

```js
export default class extends think.controller.base {
  async addAction(){
    let model = this.model("user");
    //first param is the data need to add, second param is the condition, if there is no result when query use second param, the data will be added
    let result = await model.thenAdd({name: "xxx", pwd: "yyy"}, {name: "xxx"});
    // result returns {id: 1000, type: "add"} or {id: 1000, type: "exist"}
  }
}
```

### Update Data


#### update

Use `update` method to update data, return value is the influenced records:

```js
export default class extends think.controlle.base {
  async updateAction(){
    let model = this.model("user");
    let affectedRows = await model.where({name: "thinkjs"}).update({email: "admin@thinkjs.org"});
  }
}
```

#### increment

Use `increment` method to increase one field's value:

```
export default class extends think.model.base {
  updateViewNums(id){
    return this.where({id: id}).increment("view_nums", 1); // increase one to reading number
  }
}
```

#### decrement

Use `decrement` method to decrease one field's value:

```
export default class extends think.model.base {
  updateViewNums(id){
    return this.where({id: id}).decrement("coins", 10); // decrease ten coins
  }
}
```

### Query Data

Model provides many ways to query data, you can: query one line data, query multiple lines data, read the field value, read max value, read results count and so on.

#### Query One Line Data

Use `find` to query one line data, return value is the object:

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model("user");
    let data = await model.where({name: "thinkjs"}).find();
    //data returns {name: "thinkjs", email: "admin@thinkjs.org", ...}
  }
}
```

If there doesn't exist the data you need, return value is blank object `{}`. You can use `think.isEmpty` to check whether it is blank.

#### Query Multiple Lines Data

Use `select` query many lines data, return value is results:

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model("user");
    let data = await model.limit(2).select();
    //data returns [{name: "thinkjs", email: "admin@thinkjs.org"}, ...]
  }
}
```

If there doesn't exist the data you need, return value is blank array `[]`. You can use `think.isEmpty` to check whether it is blank.

#### Result Pagination

It's common to show paginated data in page. You need to query the total counts first, then calculate the number of pagination. Model provides `countSelect` method to facilitate this operation, it can query total counts automatically.

```js
export default class extends think.controller.base {
  async listAction(){
    let model = this.model("user");
    let data = await model.page(this.get("page"), 10).countSelect();
  }
}
```

Return value's format:

```js
{
  numsPerPage: 10, //number per page
  currentPage: 1, //current page
  count: 100, //total counts
  totalPages: 10, //total page number
  data: [{ //data of current page
    name: "thinkjs",
    email: "admin@thinkjs.org"
  }, ...]
}
```

If current page number exceeds page range, you can fix it through parameters. `true` means fix to first page, `false` means fix to last page: `countSelect(true)`, `countSelect(false)`.

If total count cannot be queried, you can pass it as a parameter like `countSelect(1000)`, means total count is 1000.

#### count

Use `count` method to query total number of records that match the conditions:

```
export default class extends think.model.base {
  getCount(){
    // the total number where status = 'publish'
    return this.where({status: "publish"}).count();
  }
}
```

#### sum

Use `sum` method to compute the sum of values of the same fields that match the conditions:

```
export default class extends think.model.base {
  getSum(){
    // the sum of values of view_nums where status = 'publish'
    return this.where({status: "publish"}).sum("view_nums");
  }
}
```

#### max

Use `max` to find the largest value of the selected column:

```
export default class extends think.model.base {
  getMax(){
    // find the largest value of comments where status = 'publish'
    return this.where({status: "publish"}).max("comments");
  }
}
```

#### min

Use `min` to find the smallest value of the selected column:

```
export default class extends think.model.base {
  getMin(){
    // find the smallest value of comments where status = 'publish'
    return this.where({status: "publish"}).min("comments");
  }
}
```

### Query Cache

Considering performance, querying data from cache is common. Doing it manually is difficult, so model provides `cache` method to set query cache:

```js
export default class extends think.model.base {
  getList(){
    //set cache key and expire time
    return this.cache("get_list", 3600).where({id: {">": 100}}).select();
  }
}
```

These codes will cache query results. If cache matchs, results will be returned directly from cache. Otherwise, database will be used. The key of cache is `get_list`, will expire after one hour.

Key is optional, model will generate a cache key from sql command:

```js
export default class extends think.model.base {
  getList(){
    //only set cache time
    return this.cache(3600).where({id: {">": 100}}).select();
  }
}
```

#### Cache Configuration

Config cache in model configuration's `cache` field (config file is src/common/config/db.js):

```js
export default {
  cache: {
    on: true,
    type: "", 
    timeout: 3600
  }
}
```

- `on` controls the whole database cache configurations, `cache` will be disabled if it is off
- `type` type of cache, default is memory, supported types can be found at [Adapter -> Cache](TODO)
- `timeout` default expire time


### Delete Data

Use `delete` method to remove data, return the count of influenced row:

```js
export default class extends think.controller.base {
  async deleteAction(){
    let model = this.model("user");
    let affectedRows = await model.where({id: [">", 100]}).delete();
  }
}
```


More operations in model can be found at [API -> model](TODO).
