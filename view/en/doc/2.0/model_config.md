## Config Database

## Config Database

Here is the model configuration, you can modify it in `src/common/config/db.js`:

```
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

You can use different configuration in different module, just config src/[module]/config/db.js.

## Define Data Table

By default, model name maps to table name. If your table's prefix is `think_`, `user` model will map to table `think_user` and `user_group` model will map to table `think_user_group`.

You can modify these by config the following two properties:

- `tablePrefix` table prefix
- `tableName` table name without prefix

### ES6 Way

```
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.tablePrefix = ""; //set the prefix to blank
    this.tableName = "user2"; //set the data table name to user2
  }
}
```

### Dynamic Class Creation

```
module.exports = think.model({
  tablePrefix: "", //use property to set prefix and table name
  tableName: "user2",
  init: function(){
    this.super("init", arguments);
  }
})
```

## Modify Primary Key

Model fault primary key is `id`, if it is not the primary key seting in data table, you need to reset it:

```
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.pk = "user_id"; // set primary key as user_id
  }
}
```

Operations like `count`, `sum`, `min` and `max` all will use primary key, when you need these operations, please reset the primary key.

## Distributed Database

In large-scale systems, there are often multiple databases to seperate the reading and writing operations. ThinkJS supports custom parsing through parser, you can modify it in `src/common/config/db.js`：

```
// reading configuration
const MYSQL_READ = {
  host: "10.0.10.1",
}

// writing configuration
const MYSQL_WRITE = {
  host: "10.0.10.2"
}

export default {
  host: "127.0.0.l",
  adapter: {
    mysql: { 
      parser: function(options){ // parsing method for mysql
        let sql = options.sql; // the SQL need to execute
        if(sql.indexOf("SELECT") === 0){ // SELECT query
          return MYSQL_READ;
        }
        return MYSQL_WRITE;
      }
    }
  }
}
```

The `options` of `parser` contains the SQL sentences that need to execute next, thus parser can return corresponding database configuration conveniently.

This doc stays at：[https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_config.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_config.md).