## 指导规范

### 全局函数

全局函数都定义在 `App/Common/common.js` 文件中，函数名为驼峰式命名。如：

```js
// 全局函数定义
global.getPicModel = function(groupId){
    var model = D('Model');
    //extra code
}
```

这样函数 `getPicModel` 在控制器里就可以直接使用了。

### 类文件

所有的类文件都通过函数 `Class` 来创建，没有特殊情况，直接赋值给 module.exports。如：

```js
//require 模块放在 module.exports 前面
var marked = require("markded");
var toc = require("marked-toc");

module.exports = Class(function(){
    // 类里面用到的一些变量放在这里，最好不要放在 Class 之外
    var keyList = { }
    return {
        init: function(){

        }
    }
});
```

如果创建的类还有一些属性或者方法，那么可以重新定义一个变量，如：

```js
var App = module.exports = Class(function(){...})
//listener 方法
App.listener = function(){}
```

ThinkJS 里包装了很多功能的基类，如：`Model`, `Db`, `Controller`，需要开发这些功能时，可以直接继承这些基类。

### 异步

ThinkJS 是基于 es6-promise 来实现的，大大简化了异步回调的代码逻辑。如果你的项目比较复杂，需要开发一些独立的模块，建议也使用 promise 的方式。

ThinkJS 提供了 `getDefer()` 获取 deferred 对象，`getPromise()` 获取 promise 对象。参见如下示例：

```js
// 获取页面内容
function getPageContent(){
    var deferred = getDefer();
    request.get('http://www.ThinkJS.org', function(err, response, body){
        if(err || response.statusCode !== 200){
            deferred.reject(err || new Error('statusCode:' + response.statusCode))
        }else{
            deferred.resolve(body);
        }
    })
    return deferred.promise
}
```
