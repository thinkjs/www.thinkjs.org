## Model Introduction

During project development, you always need to manipulate data tables, thus involes CRUD operations. The model is just an incapsolation in order to facilite database manipulation. A model maps to a data table in database.

ThinkJS currently supports MySQL, MongoDB and SQLite.

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

`Note:` Model file is not required, you don't need to create it when there is no custom method, in this case the instance of base class will be used.


### 模型属性

#### model.pk

主键 key，默认为 `id`。MongoDB 下为 `_id`。

#### model.schema

数据表字段定义，默认会从数据库种读取，读到的信息类似如下：

```js
{
  id: {
    name: 'id',
    type: 'int', //类型
    required: true, //是否必填
    primary: true, //是否是主键
    unique: true, //是否唯一
    auto_increment: true //是否自增
  }
}
```

可以在模型添加额外的属性，如：默认值和是否只读，如：

```js
export default class extends think.model.base {
  /**
   * 数据表字段定义
   * @type {Object}
   */
  schema = {
    view_nums: { //阅读数
      default: 0  //默认为 0
    },
    fullname: { //全名
      default: () => { //first_name 和 last_name 的组合
        return this.first_name + this.last_name;
      }
    }
    create_time: { //创建时间
      default: () => { //获取当前时间
        return moment().format('YYYY-MM-DD HH:mm:ss')
      },
      readonly: true //只读，添加后不可修改
    }
  }
}
```

`default` 只在添加时有效，`readonly` 只在更新时有效。

-----

更多属性请见 [API -> Model](./api_model.html)。

### Model Instantiation

Model instantiation is different depend on use cases. If current class has `model` method, it will be used directly to instantiate:

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

### Chaining Invoke

Model provides many chaining invoke methods(like jQuery does) which can facilite data manipulation. Chaining invoke is implemented by returnning `this`:

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

Model supports chaining invoke the following methods:

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


This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_intro.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-cn/doc/2.0/model_intro.md).