## 数据库配置

### 数据库配置

数据库默认配置如下，可以在 `src/common/config/db.js` 中进行修改：

```js
export default {
  type: 'mysql',
  log_sql: true,
  log_connect: true,
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '',
      database: '', //数据库名称
      user: '', //数据库帐号
      password: '', //数据库密码
      prefix: 'think_',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};
```

也可以在其他模块下配置，这样请求该模块时就会使用对应的配置。

### 数据表定义

默认情况下，模型名和数据表名都是一一对应的。假设数据表前缀是 `think_`，那么 `user` 模型对应的数据表为 `think_user`，`user_group` 模型对应的数据表为 `think_user_group`。

如果需要修改，可以通过下面 2 个属性进行：

* `tablePrefix` 表前缀
* `tableName` 表名，不包含前缀

#### ES6 方式

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.tablePrefix = ''; //将数据表前缀设置为空
    this.tableName = 'user2'; //将对应的数据表名设置为 user2
  }
}
```

#### 动态创建类方式

```js
module.exports = think.model({
  tablePrefix: '', //直接通过属性来设置表前缀和表名
  tableName: 'user2',
  init: function(){
    this.super('init', arguments);
  }
})
```

### 修改主键

模型默认的主键为 `id`，如果数据表里的 Primary Key 设置不是 id，那么需要在模型中设置主键。

```js
export default class extends think.model.base {
  init(...args){
    super.init(...args);
    this.pk = 'user_id'; //将主键字段设置为 user_id
  }
}
```

`count`，`sum`，`min`，`max` 等很多查询操作都会用到主键，用到这些操作时需要修改主键。

### 配置多个数据库

如果项目中有连接多个数据库的需求，可以通过下面的方式连接多个数据库。

```js
//src/common/config/db.js
export default {
  type: 'mysql',
  mysql: {
    host: '127.0.0.1',
    port: '',
    database: 'test1',
    user: 'root1',
    password: 'root1',
    prefix: '',
    encoding: 'utf8'
  },
  mysql2: {
    type: 'mysql', //这里需要将 type 重新设置为 mysql
    host: '127.0.0.1',
    port: '',
    database: 'test2',
    user: 'root2',
    password: 'root2',
    prefix: '',
    encoding: 'utf8'
  }
}
```

`注意`： `mysql2` 的配置中需要额外增加 `type` 字段将类型设置为 `mysql`。

配置完成后，调用的地方可以通过下面的方式调用。

```js
export default class extends think.controller.base {
  indexAction(){
    let model1 = this.model('test'); //
    let model2 = this.model('test', 'mysql2'); //指定使用 mysql2 的配置连接数据库
  }
}
```

### 分布式数据库

大的系统中，经常有多个数据库用来做读写分离，从而提高数据库的操作性能。ThinkJS 里可以通过 `parser` 来自定义解析，可以在文件 `src/common/config/db.js` 中修改：

```js
//读配置
const MYSQL_READ = {
  host: '10.0.10.1',
}
//写配置
const MYSQL_WRITE = {
  host: '10.0.10.2'
}
export default {
  host: '127.0.0.1',
  adapter: {
    mysql: { 
      parser: function(options){ //mysql 的配置解析方法
        let sql = options.sql; //接下来要执行的 SQL 语句
        if(sql.indexOf('SELECT') === 0){ //SELECT 查询
          return MYSQL_READ;
        }
        return MYSQL_WRITE;
      }
    }
  }
}
```
parser 解析的参数 `options` 里会包含接下来要执行的 SQL 语句，这样就很方便的在 parser 里返回对应的数据库配置。
