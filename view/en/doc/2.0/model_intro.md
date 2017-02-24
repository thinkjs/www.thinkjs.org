## Model Introduction

During project development, you always need to manipulate data tables, thus involes CRUD operations. The model is just an incapsulation in order to facilitate database manipulation. A model maps to a data table in database.

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

Model provides many chaining invoke methods(like jQuery does) which can facilitate data manipulation. Chaining invoke is implemented by returnning `this`:

```js
export default class extends think.model.base {
  /**
   * get list data
   */
  async getList(){
    let data = await this.field("title, content").where({
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