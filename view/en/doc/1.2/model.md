## 模型（Mysql）

在 ThinkJS 中基础的模型类就是 `Model` 类，该类完成了基本的增删改查、连贯操作和统计查询，同时还有 thenadd, countSelect 等功能，更高级的功能封装在另外的模型扩展中。

### 模型定义

<div class="alert alert-info">
    模型并非必须定义，只有当存在独立的业务逻辑或者属性的时候才需要定义
</div>

模型类通常都需要继承系统的 `Model` 类，如：
```js
// 模型定义
module.exports = Model(function(){
    return {
        // 获取用户列表
        getList: function(){}
    }
})
```

该文件保存在：`App/Lib/Model/UserModel.js`。

模型类大多数情况下都是操作对应的数据表的，如果按照系统的规范来命名模型类，大多数情况下都可以自动关联到对应的数据表。

模型类的命名表现在对应的模型文件上，如上面的 `UserModel.js`，那么该模型名称为 `UserModel`。

模型类的命令采用驼峰时的规则，并且首字母大写，去除数据表的前缀。如：

* `UserModel` 对应的数据表为 `think_user`，这里的数据表前缀为 `think_`
* `UserGroupModel` 对应的数据表为 `think_user_group`，数据表前缀也为 `think_`

### 数据表定义

在模型中，有几个跟数据表名称相关的数据可以定义：

* `tablePrefix` 表前缀，默认对应配置：`db_prefix`
* `tableName` 表名称，默认情况下等于模型名称，即上面的 `User`
* `trueTableName` 包含前缀的数据表名称，也就是数据库中的实际表明，默认情况下不用设置。
* `dbName` 数据库名称

#### 默认属性

假设数据库 test 中有数据表 `think_user`，那么对应的模型类名称为 `UserModel`，对应的模型文件为：`App/Lib/Model/UserModel.js`。这时候计算出来的几个属性值为：

* `tablePrefix` = `think_`
* `tableName` = `user`
* `trueTableName` = `think_user`
* `dbName` = `test`

这几个值会自动计算，不用在 Model 类里设置。

#### 自定义属性

假设另一个数据库 test2 中有数据表 `think2_users`，但模型类文件为 `App/Lib/Model/UserModel.js`，那么就要在模型类中作如下的定义：
```js
// 自定义属性的模型
module.exports = Model(function(){
    return {
        dbName: 'test2',
        trueTableName: 'think2_users'
    }
})
```

### 模型实例化

#### 直接实例化
```js
// 通过 thinkRequire 加载 UserModel 对应的 js 文件
var userModel = thinkRequire("UserModel");
var instance = userModel();
// 传递参数实例化
var newInstance = userModel("users", {db_prefix: "think2_"});
```

模型类实例化的时候可以传 3 个参数，分别是：模型名、详细配置，也可以在详细配置里指定数据表前缀。

#### D 函数实例化

为了简化实例化模型的代码，提供一个全局的 `D` 函数:

```js
// 实例化模型类
var model = D('User');
```

效果和上面手工实例化是一样的，可以传入的参数也一致。

### 数据库

#### 数据库支持

ThinkJS 目前还只支持 `mysql` 数据库，后续会支持更多的数据库。

#### 数据库连接

模型实例化默认会读取如下的配置，需要在 `App/Conf/config.js` 中设置对应的值：    ：
```js
// 数据库连接信息
db_type: "mysql", // 数据库类型
db_host: "localhost", // 服务器地址
db_port: "", // 端口
db_name: "", // 数据库名
db_user: "root", // 用户名
db_pwd: "", // 密码
db_prefix: "think_", // 数据库表前缀
```

如果使用其他的配置信息连接数据库，可以在模型实例化的时候传入对应的配置：

```js
//App/Conf/config.js 里额外的数据库配置信息
'ext_db_config': {
    db_type: "mysql", // 数据库类型
    db_host: "localhost", // 服务器地址
    db_port: "", // 端口
    db_name: "", // 数据库名
    db_user: "root", // 用户名
    db_pwd: "", // 密码
    db_prefix: "think_", // 数据库表前缀
};
// 实例化时传入对应的配置
var model = D('User', C('ext_db_config'));
```

### 链式调用

ThinkJS 的基础模型类提供了很多链式调用的方法（类似于 jQuery里的链式调用方式），可以有效的提高数据存取的代码清晰度和开发效率，并且支持所有的 CURD 操作。

链式调用是通过方法里返回 `this` 来实现的。

使用非常简单，如：要查询用户表中 name 为 welefen 的部分用户信息，可以用下面的方式：

```js
var promise = D('User').where({name: 'welefen'}).field('sex,date').find().then(function(data){
    //data 为当前查询到用户信息，如果没有匹配到相关的数据，那么 data 为一个空对象
})
```

` 注意：` 由于数据库操作都是异步的，执行 find() 方法后，并不能返回结果，而是返回一个 promise，在 promise.then 方法里可以拿到对应的数据。 

系统支持的链式调用有：

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

对于每个方法的具体使用请见 [API](/api/model.html) 里的详细文档。

### CURD 操作

#### 添加数据

模型里添加数据使用 `add` 方法，示例如下：

```js
D("User").add({
    name: "welefen",
    pwd: "xxx",
    email: "welefen@gmail.com"
}).then(function(insertId){
    //insertId 为插入到数据库中的 id
}).catch(function(err){
    // 插入异常，比如：email 已经存在
})
```

也可以一次添加多条数据，使用 `addAll` 方法，示例如下：
```js
D('User').addAll([{
    name: "welefen",
    email: "welefen@gmail.com"
}, {
    name: "suredy",
    email: "suredy@gmail.com"
}]).then(function(insertId){

})
```

` 注意：` 这里的一次插入多条数据最终拼成的 sql 语句只有一条，不会智能切割。如果数据量非常大（如：>1W 条）的话，一次插入可能会导致报错，请自行切割分块插入。

#### 更新数据

更新数据使用 `update` 方法，如：
```js
// 更新 email 为 welefen@gmail.com 用户的密码
D('User').where({email: "welefen@gmail.com"}).update({pwd: "xxx"}).then(function(affectedRows){
    //affectedRows 为影响的行数
})
```

#### 查询数据

在 ThinkJS 中读取数据的方式有多种，通常分为：读取单条数据、读取多条数据和读取字段值。

数据查询方法支持很多的连贯操作方法，如：`where`, `table`, `field`, `order`, `group`, `having`, `join`, `cache` 等。

```js
// 查询 id=1 的用户数据，只需要 name,email 字段值
D('User').where({id: 1}).field('name,email').find().then(function(data){
    // 如果数据存在 data 为 {name: "welefen", "email": "welefen@gmail.com"}
    // 数据不存在 data 为 {}
});
// 查询 score>1000 的 10 条用户数据，按 score 降序
D('User').where({score: ['>', 1000]}).order('score DESC').limit(10).select().then(function(data){
    //data 为一个数组，数组里每一项为一个用户的详细信息
    // 如果没有数据，那么 data 为空数组
})
// 查询所有的用户数据
D('User').count().then(function(count){
    //count 为具体的用户数
})
```


#### 删除数据

删除数据的方法为 `delete`，如：

```js
// 删除 id 为 1 的数据
D('User').where({id: 1}).delete().then(function(affectedRows){
    //affectedRows 为影响的行数
});
```

#### thenAdd

数据库设计时，我们经常需要把某个字段设为唯一，表示这个字段值不能重复。那我们添加数据的时候只能先去查询下这个数据值是否存在，如果不存在才进行插入操作。

为了让使用者更加方便，这里提供了 `thenAdd` 的方法来简化这个问题的处理逻辑。

```js
// 第二个参数为插入条件，当使用这个插入条件查询时，如果没有查到相关的数据，则进行插入操作。
// 表示数据库中没有 email 为 `welefen@gmail.com` 数据时才进行插入操作
D('User').thenAdd({
    name: "welefen",
    email: "welefen@gmail.com"
}, {email: "welefen@gmail.com"}).then(function(id){
    //id 为 exist id 或者是 insert id
    // 如果需要返回详细的数据，可以传入第三个参数 true，那么返回的数据格式为 {type: "exist", id: "123"} type 值为 exist 或者 add
});
```

#### countSelect

页面中经常遇到按分页来展现某些数据，这种情况下就需要先查询总的条数，然后在查询当前分页下的数据。查询完数据后还要计算有多少页。

为了方便开发者使用，ThinkJS 提供了 `countSelect` 的方法。

```js
// 按每页 20 条数据来展现文件
D('Article').page(this.get("page"), 20).countSelect().then(function(data){
    //data 的数据格式为
    {
        count: 123, // 总条数
        total: 10, // 总页数
        page: 1, // 当前页
        num: 20, // 每页显示多少条
        data: [{}, {}] // 详细的数据
    }
});
// 如果传入一个不存在的页数，比如：总页数只有 10 页，如果传入的页数为 20，默认情况下返回的数据为空
// 可以传入参数来修正这个值
//countSelect(true)  修正到第一页
//countSelect(false) 修正到最后一页
```

关于模型接口的详细使用说明请见 [API - Model](/api/model.html) 。


### 自动校验

在把数据往数据库里添加或者更新的时候，我们需要对数据进行校验，防止非法的数据提交到数据库中。ThinkJS 支持在数据入库之前对数据进行校验。

`App/Lib/Model/ArticleModel.js`

```js
module.exports = Model({
    // 定义数据校验的字段
    fields: {
        title: {
            valid: ['required', 'length'],
            length_args: [10],
            msg: {
                required: '标题不能为空',
                length: '标题长度不能小于 10'
            }
        },
        url: {
            valid: ['url'],
            msg: 'url 格式不正确'
        }
    }
})
```

添加数据，如：

```js
indexAction: function(){
    var self = this;
    D('Article').add({
        title: 'xxx',
        url: 'xxx'
    }).catch(function(err){
        var data = JSON.parse(err.json_message);
        self.error(100, 'data error', data);
    })
}
```

这样在添加数据的时候，自定校验 title 和 url 的值是否合法。

具体是数据格式请见 [数据校验](./data_valid.html)。
