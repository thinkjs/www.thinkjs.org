## Model Introduction

- Create Model
- Config Model
- Define Data Table
- Model Instantiation
- Chaining Invoke
- CURD Operations
  - Create Data
  - Update Data
  - Query Data
  - Delete Data
- Query Cache

During project development, you always need to manipulate data table, such as CRUD operations. In order to facilite database manipulation, model is encapsoluted. A model maps to a table in databse.

Currently support databases: `MySQL`, `MongoDB`, `SQLite`.

### Create Model

You can use command `thinkjs model [name]` in project directory to create model:

```sh
thinkjs model user;
```

This will create file `src/common/model/user.js`.

Model file will be placed in `common` module by default, if you want to use other modules, you need to specify module name when creating:

```sh
thinkjs model home/user
```

### Config Model

Here is the model configuration, you can modify it in `src/common/config/db.js`:

```js
export default {
  type: "mysql", //database type
  host: "127.0.0.1", //database host
  port: "", //database port, default is 3306
  name: "", //database name
  user: "", //account
  pwd: "",  //password
  prefix: "think_", //database prefix. Blank means no prefix
  encoding: "utf8", //database encoding
  nums_per_page: 10, //number per page
  log_sql: true, //whether log sql commands executed
  log_connect: true, //whether log database connect information
  cache: { //database query cache configuration
    on: true,
    type: "",
    timeout: 3600
  }
};
```

You can use different configuration in different module, just config `src/[module]/config/db.js`.

### Define Data Table

By default, model name maps to table name. If your table's prefix is `think_`, table `think_user` and `user_group` will map to `think_user_group`.

You can modify these two properties:

- `tablePrefix` table prefix
- `tableName` table name without prefix

#### ES6 Way

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.tablePrefix = ""; //set the prefix to blank
    this.tableName = "user2"; //set the data table name to user2
  }
}
```

#### Dynamic Class creation

```js
module.exports = think.model({
  tablePrefix: "", //use property to set prefix and table name
  tableName: "user2",
  init: function(){
    this.super("init", arguments);
  }
})
```

### Model Instantiation

Model instantiation is different in different use cases. If current class has `model` method, it will be used directly to instantiate:

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model("user");
  }
}
```

You can also use `think.model` to instantiate:

```js
let getModelInstance = function(){
  let model = think.model("user", think.config("db"), "home");
}
```

You need to pass in configuration when using `think.model`.

#### Chaining Invoke

Model provides many chaining invoke methods(like jQuery does) which can facilite data manipulation. Chainning invoke is implemented by returning `this`:

```js
export default class extends think.model.base {
  /**
   * get list data
   */
  * getList(){
    let data = yield this.field("title, content").where({
      id: [">", 100]
    }).order("id DESC").select();
    ...
  }
}
```

Model supports chaining these methods:

- `where`, define query or update conditions
- `table`, define table name
- `alias`, define alias of current table
- `data`, assign value before creating or updating data
- `field`, define field for querying, support exclude
- `order`, sort results
- `limit`, limit results number
- `page`, results pagination, will be translated to limit when generate sql commands
- `group`, querying group support
- `having`, querying having support
- `join`, querying join support
- `union`, querying union support
- `distinct`, querying distinct support
- `cache`, query cache

### CURD Operations

#### Create Data

##### Create a row

Use `add` method to create a new row, return value is the id of inserted data:

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model("user");
    let insertId = yield model.add({name: "xxx", pwd: "yyy"});
  }
}
```

##### Create many rows

Use `addMany` create many rows:

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model("user");
    let insertId = yield model.addMany([
      {name: "xxx", pwd: "yyy"},
      {name: "xxx1", pwd: "yyy1"}
    ]);
  }
}
```

##### thenAdd

We often need to prevent a field from duplication when designing database. So it's common to query whether data exists before inserting and just insert if it doesn't exist.

Model provides `thenAdd` to support this manipulation:

```js
export default class extends think.controller.base {
  * addAction(){
    let model = this.model("user");
    //first param is the data need to add, second param is the condition, if there is no result when query use second param, the data will be added
    let result = yield model.thenAdd({name: "xxx", pwd: "yyy"}, {name: "xxx"});
    // result returns {id: 1000, type: "add"} or {id: 1000, type: "exist"}
  }
}
```

#### Update Data

Use `update` method to update data, return value is the influenced value:

```js
export default class extends think.controlle.base {
  * updateAction(){
    let model = this.model("user");
    let affectedRows = yield model.where({name: "thinkjs"}).update({email: "admin@thinkjs.org"});
  }
}
```

#### Query Data

Model provides many ways to query data, you can: query one line data, query many lines data, read the field value, read max value, read results count and so on.

##### Query One Line Data

Use `find` to query one line data, return value is the object:

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model("user");
    let data = yield model.where({name: "thinkjs"}).find();
    //data returns {name: "thinkjs", email: "admin@thinkjs.org", ...}
  }
}
```

If there doesn't exist the data you need, return value is blank object `{}`. You can use `think.isEmpty` to check whether it is blank.

##### Query Many Lines Data

Use `select` query many lines data, return value is results:

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model("user");
    let data = yield model.limit(2).select();
    //data returns [{name: "thinkjs", email: "admin@thinkjs.org"}, ...]
  }
}
```

If there doesn't exist the data you need, return value is blank array `[]`. You can use `think.isEmpty` to check whether it is blank.

##### Result Pagination

It's common to show paginated data in page. You need to query the total counts first, then calculate the number of pagination. Model provides `countSelect` method to facilite this operation, it can query total counts automatically.

```js
export default class extends think.controller.base {
  * listAction(){
    let model = this.model("user");
    let data = yield model.page(this.get("page"), 10).countSelect();
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

#### Delete Data

Use `delete` method to remove data, return the count of influenced row:

```js
export default class extends think.controller.base {
  * deleteAction(){
    let model = this.model("user");
    let affectedRows = yield model.where({id: [">", 100]}).delete();
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

##### Cache Configuration

Config cache in model configuration's `cache` field:

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

---

More operations in model can be found at [API -> model](TODO).

This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-CN/doc/2.0/model_intro.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-CN/doc/2.0/model_intro.md).