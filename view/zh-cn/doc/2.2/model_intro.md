## 模型介绍

项目开发中，经常要操作数据库，如：增删改查等操作。模型就是为了方便操作数据库进行的封装，一个模型对应数据库中的一个数据表。

目前支持的数据库有：`MySQL`，`MongoDB`，`PostgreSQL` 和 `SQLite`。

### 创建模型

可以在项目目录下通过命令 `thinkjs model [name]` 来创建模型：

```sh
thinkjs model user;
```

执行完成后，会创建文件 `src/common/model/user.js`。

默认情况下模型文件会创建在 `common` 模块下，如果想创建在其他的模块下，创建时需要指定模块名：

```sh
thinkjs model home/user
```


`注`：模型文件不是必须存在，如果没有自定义方法可以不创建模型文件，实例化时会取模型基类的实例。


### 模型属性

#### model.pk

主键 key，默认为 `id`。MongoDB 下为 `_id`。

#### model.schema

数据表字段定义，默认会从数据库中读取，读到的信息类似如下：

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
      default: function() { //first_name 和 last_name 的组合，这里不能用 Arrows Function
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

`default` 默认只在添加数据时有效。如果希望在更新数据时也有效，需要添加属性 `update: true`，该属性在 2.1.4 版本中开始支持。

`readonly` 只在更新时有效。

`注`：如果设置了 `readonly`，那么会忽略 `update` 属性。

-----

更多属性请见 [API -> Model](./api_model.html)。

### 模型实例化

模型实例化在不同的地方使用的方式有所差别，如果当前类含有 `model` 方法，那可以直接通过该方法实例化，如：

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model('user');
  }
}
```

否则可以通过调用 `think.model` 方法获取实例化，如：

```js
let getModelInstance = function(){
  let model = think.model('user', think.config('db'), 'home');
}
```

使用 `think.model` 获取模型的实例化时，需要带上模型的配置。



### 链式调用

模型中提供了很多链式调用的方法（类似 jQuery 里的链式调用），通过链式调用方法可以方便的进行数据操作。链式调用是通过返回 `this` 来实现的。

```js
export default class extends think.model.base {
  /**
   * 获取列表数据
   */
  async getList(){
    let data = await this.field('title, content').where({
      id: ['>', 100]
    }).order('id DESC').select();
    ...
  }
}
```

模型中支持链式调用的方法有：

* `where`, 用于查询或者更新条件的定义
* `table`, 用于定义要操作的数据表名称
* `alias`, 用于给当前数据表定义别名
* `data`, 用于新增或者更新数据之前的数据对象赋值
* `field`, 用于定义要查询的字段，也支持字段排除
* `order`, 用于对结果进行排序
* `limit`, 用于限制查询结果数据
* `page`, 用于查询分页，生成 sql 语句时会自动转换为 limit
* `group`, 用于对查询的 group 支持
* `having`, 用于对查询的 having 支持
* `join`, 用于对查询的 join 支持
* `union`, 用于对查询的 union 支持
* `distinct`, 用于对查询的 distinct 支持
* `cache` 用于查询缓存

链式调用方法具体使用方式请见 [API -> Model](./api_model.html)。

