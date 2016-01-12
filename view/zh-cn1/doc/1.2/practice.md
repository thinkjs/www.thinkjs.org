
## 最佳实践

### 控制器基类

同一个分组下的 `Controller` 一般会有一些共同的特性，那么就可以把这些共同的特性放在一个控制器基类里，其他的控制器继承该控制器。

建议控制器基类名为 `BaseController`，如：

```js
// App/Lib/Controller/Home/BaseController.js
module.exports = Controller(function(){
    return {
        init: function(http){
            this.super("init", http);
            // 给模版里设置 title 等一些字段
            this.assign({
                title: "ThinkJS 官网",
                navType: "home"
            })
        },
        // 获取页面顶部的分类，几乎每个页面都会使用
        // 那么可以放在基类里，供子类调用
        getCate: function(){
            var self = this;
            return D('Cate').select().then(function(data){
                self.assign("cateList", data);
            })
        }
    }
})
```

基类可以通过 `BaseController` 来继承，如：

```js
// App/Lib/Controller/Home/IndexController.js
module.exports = Controller("Home/BaseController", function(){
    return {
        indexAction: function(){
            var self = this;
            // 获取分类列表
            var catePromise = this.getCate();
            // 获取文章列表
            var articlePromise = D('Article').page(this.page("page")).select().then(function(data){
                self.assign("articleList", data);
            })
            // 分类和文章列表数据都 OK 后渲染模版
            return Promise.all([catePromise, articlePromise]).then(function(){
                return self.display();
            })
        }
    }
})
```

### 用户登录后才能访问

在项目中，经常要判断当前访问的用户是否有权限，如果没有权限那么后续的代码就不能在执行。最基本的案例就是判断用户是否已经登录，比如：后台管理

```js
// App/Lib/Controller/Admin/BaseController.js
module.exprots = Controller(function(){
    return {
        //__before 会在执行具体的 action 之前执行
        __before: function(){
            // 登录页面不检测用户是否已经登录
            if(this.http.action === 'login'){return;}
            return this.session("userInfo").then(function(userInfo){
                // 用户信息为空
                if(isEmpty(userInfo)){
                    //ajax 访问返回一个 json 的错误信息
                    if(self.isAjax()){
                        return self.error(403, "用户未登录，不能访问")
                    }else{
                        // 跳转到登录页
                        return self.redirect("/index/login");
                    }
                }else{
                    // 用户已经登录
                    self.userInfo = userInfo;
                    self.assign("userInfo", userInfo);
                }
            })
        }
    }
})
```

由于 `error` 和 `redirect` 方法返回的都是 `pendding promise`，如果未登录的话，可以阻止后续的代码继续执行。

```js
indexAction: function(){
    //init 方法里将用户信息赋值到 this.userInfo 上，那么这里就可以直接获取了
    var userInfo = this.userInfo;
    var id = userInfo.id;
}
```