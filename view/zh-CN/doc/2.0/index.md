## 介绍

ThinkJS 2.0 是一款使用 ES6/7 特性全新开发的 Node.js MVC框架。该框架使用ES7中`async`和`await`，或者ES6中的`Generator Function`彻底解决了Node.js中异步嵌套的问题。同时吸收了国内外众多框架的设计理念和思想，让开发 Node.js 项目更加简单、高效。

### 特性

#### 使用ES6/7特性来开发项目

在 ThinkJS 2.0 中，可以使用ES6里的`class`和`Generator Function`等特性，甚至可以使用ES7里的`async`和`await`等特性来开发项目。虽然最新的Node.js和io.js还不能全部支持这些特性，但可以借助 [Babel](http://babeljs.io/) 对代码进行编译，让其稳定运行在Node.js的环境中。

```js
//user controller, home/controller/user.js
export default class extends think.controller.base {
  //login action
  async loginAction(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    let data = this.post();
    let md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    let result = await this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    await this.session('userInfo', result);
    return this.success();
  }
}
```

上面的代码我们使用了ES6里的`class`, `export`, `let`以及ES7里的`async`和`await`等特性，虽然查询数据库和写入 Session 都是异步操作，但借助`await`，代码都是同步书写的。最后使用Babel进行编译，就可以稳定运行在Node.js的环境中了。

如果不想使用Babel编译，但Node.js环境支持`Generator Function`，那么可以使用`yield`和`*`。

```js
//user controller, home/controller/user.js
module.exports = think.controller({
  //login action
  loginAction: function *(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    var data = this.post();
    var md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    var result = yield this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    yield this.session('userInfo', result);
    return this.success();
  }
})
```

#### 支持丰富的数据库

#### 代码自动更新

#### 自动创建Rest接口

#### 支持多种websocket库    

#### 丰富的测试用例

#### 支持命令行调用执行定时任务

#### Hook和Middleware

#### 详细的错误日志