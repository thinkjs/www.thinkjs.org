## 变量过滤器

在项目中，访问有些页面时需要带上各种各样的参数。如：显示某个数据列表需要带上分页的参数，这时候需要在控制器里获取这个分页参数值，如果不为数值或者不存在的话，就设置个默认值。

```js
listAction: function(){
    // 获取当前分页数，并转化为数字
    var page = this.get("page") | 0;
    // 默认在第一页
    page = page || 1;
}
```

项目中有很多类似分页这样的参数，如果每个都在控制器里写这样的逻辑就非常麻烦。

ThinkJS 里提供了变量过滤器的功能，通过下面的方式加载 Filter。

```js
// 加载变量过滤器
var filter = thinkRequire("Filter").filter;
// 通过过滤器来转化分页的值
var page = filter(this.get("page"), "page");
```

### 支持格式

* `page` 过滤分页值，默认为 1。ThinkJS 建议分页值从 1 开始
* `order` 数据库排序方式。如：`"id DESC"`, `"id DESC,name ASC"`
* `id` 转化为数字，默认为 0
* `ids` 将逗号分割的多个 id 值转化为数组。如：`"1,2,3" => [1, 2, 3]`
* `in` 是否在一个范围中，如果不在，返回空字符串
* `strs` 将逗号格式的多个字符串转化为数组，如：`"xx,yy" => ["xx", "yy"]`


### 自动转化

如果在某个操作里调用变量过滤器来过滤也很麻烦，这时候就可以使用 ThinkJS 里的行为功能。

修改 `App/Conf/tag.js` 文件，添加如下的代码：

```js
// 自定义个行为
var filter = thinkRequire("Filter").filter;
module.exports = {action_init: [function(http){
    var types = ["id", "ids", "page", "order"];
        // 对 get 请求参数进行变量过滤器
        for(key in http.get){
            // 使用对应的类型转化
            if(types.indexOf(key) > -1){
                http.get[key] = filter(http.get[key], key);
            }else if(/_id$/.test(key)){ // 如果参数名是_id 结尾的，使用 `id` 转化
                http.get[key] = filter(http.get([key], "id"));
            }
        }
    }]
}
```

当然，你可以根据项目里的定义来修改这里的过滤逻辑。 这里统一过滤后，在 Action 里拿到的参数值就是统一过来后的了。

```js
listAction: function(){
    // 这里拿到的 page 值是个数值，且默认值为 1
    var page = this.get("page");
}
```