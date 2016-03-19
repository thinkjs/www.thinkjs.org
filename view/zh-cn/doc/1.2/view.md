## 视图

### 模版引擎

ThinkJS 里默认使用的模版引擎是 `ejs`，关于 `ejs` 的使用文档你可以看 [这里](https://github.com/visionmedia/ejs)。

ThinkJS 除了支持 `ejs` 模版，还支持如下的模版：

* `jade` 需要在项目里手动安装 [jade 模块](https://www.npmjs.org/package/jade)
* `swig` 需要在项目里手动安装 [swig 模块](https://www.npmjs.org/package/swig)


模版引擎相关的配置如下：

```js
// 模版引擎相关的配置
tpl_content_type: "text/html", // 模版输出时发送的 Content-Type 头信息
tpl_file_suffix: ".html", // 模版文件名后缀
tpl_file_depr: "_", //controller 和 action 之间的分隔符
tpl_engine_type: "ejs", // 模版引擎名称
tpl_engine_config: {}, // 这里定义模版引擎需要的一些额外配置，如：修改左右定界符
```


如果使用其他的模版引擎，那么需要扩展 Template 对应的 Driver，具体方式请见 ThinkJS 里的 Template Driver 写法。

### 模版文件

默认的模版文件路径使用的规则为：

** 视图目录 / 分组名 / 控制器名 + 控制器与操作之间的分隔符 (默认为 `_`)+ 操作名 + 模版文件后缀 (默认为 `.html`) **

如：访问 `/group/detail?id=10`，识别到的分组名为 `home`，控制器名为 `group`，操作名为 `detail`，那么对应的模版文件为：`App/View/Home/group_detail.html`

### 变量赋值

如果要在模版中使用变量，必须在控制器中把变量传递到模版，系统提供了 `assign` 方法对模版变量进行赋值。

```js
// 单个变量赋值
this.assign("name", "welefen");
//assign 除了可以变量赋值，可以进行读取之前赋值过的变量值
var name = this.assign("name");
// 多个变量通过一个对象一起赋值
this.assign({
    name: "welefen",
    email: "welefen@gmail.com",
    extra: {score: 100}
})
```

` 注：` `ejs` 模版中使用到的变量必须要在控制器里进行赋值，否则会报错。

除了手工进行赋值外，系统默认将所有配置和 http 对象也赋值到了模版中。模版中可以通过下面的方式获取配置值和 http 对象值：

```js
config.server_domain // 获取配置中 server_domain 的值
http.get.name // 从 http 对象中获取 get 参数 name 的值
```

### 模版渲染

模版定义后就可以渲染模版输出，系统也支持直接渲染内容输出，模版赋值必须在模版渲染之前进行。

模版渲染使用 `display` 方法，如：

```js
this.display(); // 自动识别模版路径
this.display("home:group:list"); // 渲染 Home/group_list.html 模版文件
this.display("/home/welefen/xxx/a.html"); //
```

模版渲染是一个异步的过程，`this.display` 返回的是一个 promise，为了方便错误捕获，需要将这个 promise 返回。如：

```js
// 分组详细页代码示例
detailAction: function(){var id = this.get("id");
    var self = this;
    // 需要将这个 promise 返回，系统会自动捕获异常
    // 如果进行不 return，那么需要额外添加 catch 来获取异常
    return D('Group').where({id: id}).find().then(function(data){
        self.assign("data", data);
        // 将模版渲染返回
        return self.display();})
}
```

### 获取内容

系统提供了 `fetch` 方法来获取渲染后的模版内容，如：

```js
// 获取模版内容
this.fetch().then(function(content){
    //content 为渲染后的模版内容
    // 对 content 进行额外的过滤和替换操作，然后可以通过 this.end(content) 进行输出
})
```

### ejs 的基本使用方法

ejs 通过 `<%` 和 `%>` 来构造基本的语法。

使用 `<%= %>` 与 `<%- %>` 来显示模板变量数据。 `=` 表示进行 html 转义，`-` 表示不转义。

使用 `<%if(condition){%> code <%}%>` 来进行条件判断

使用 `<%data.forEach(function(item){%> <%=item%> <%})%>` 来进行数据遍历
