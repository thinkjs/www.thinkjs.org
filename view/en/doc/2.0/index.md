## Introduction

ThinkJS is the first Node.js MVC framework that supporting use full ES6/7 features to develop Node.js application. By using `async/await` in ES7 or `*/yield` in ES6, ThinkJS totally resovled the hard problem of asynchronous callbacks nesting hell. It absorbs the design and ideas of lots of other framworks around the world, and makes develop Node.js projects faster and efficient than ever before.

Using ES6/7 features to build projects is very efficent, that must be the trend. The lastest version of Node.js has supported the features of ES6 more friendly, though not all features. At this time, [Babel](http://babeljs.io) can help us to compile ES6 code to ES5 code.

### Features

#### Using ES6/7 features

Babel compile our code to ES5 so we don't need worry about the browser compatibility. So we can resolve the asynchronous callbacks problem by using `async/await` or `*/yield` features.


```js
//user controller, home/controller/user.js
export default class extends think.controller.base {
  //login action
  async loginAction(self){
    //if it's a get request, then display them
    if(this.isGet()){
      return this.display();
    }
    //here you can use post() method to get all request data which has checked in logic
    let data = this.post();
    let md5 = think.md5('think_' + data.pwd);
    //take username and encrypted password to match data in database
    let result = await this.model('user').where({name: data.name, pwd: md5}).find();
    //if no result found, it means username or password error
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //write user info into session after reciving user infomation
    await this.session('userInfo', result);
    return this.success();
  }
}
```

Here, we've used ES6 features like `class`, `export`, `let` and ES7 features like `async/await` in this example. Database query and `Session` writing was all async action, but we write sync code to handle them with `async/await` feature. Last, it can run in Node.js environment stably after `Babel` compiling.

#### Support multiple project structure and environment

ThinkJS is compatiable with multiple project structure like single module mode, normal mode and splitting module mode. It supports to develop various of complicated project.

Default there have 3 project environment: `development`, `testing` and `production`, you can use different configuration in different environment to support different demands. You can also custom and extend them in your project.

#### Support abundant database type

ThinkJS supports mosts database like `MySQL`, `MongoDB` and `SQLite`. It encapsulates many API about operation of the database, without having to manually stitching SQL statements. You can automatically prevent SQL injection and other vulnerabilities. It also supports transaction and association and other advanced features.

#### Atuomatic update

ThinkJS has a mechanism to automatic update code after file modified without restart Node.js service and other third party module.

#### Automatic REST API creation

You can use `thinkjs` command to create REST API automaticly without writing any other code. you can easily add filter or auth check if you want.

#### Support multiple WebSocket libray

ThinkJS supports some common Websocket library like `socket.io` and `sockjs`. And it package those library to take same API into different library.

#### Lots of test case

ThinkJS includes 1500+ test case which covering 95% code. Every change has its test case to protect framework function well.

#### Support call command to run cron job

`Action` method can be responsed by user's request, it also support request in terminal. With this feature, we can excute cron job easily.

#### Hook and Middleware

ThinkJS support Hook and Middleware, they can handle request flexability.

#### Detailed log

ThinkJS internal has detailed log function, it can read log and track problem easily.

#### HTTP request log
```
[2015-10-12 14:10:03] [HTTP] GET /favicon.ico 200 5ms
[2015-10-12 14:10:11] [HTTP] GET /zh-CN/doc.html 200 11ms
[2015-10-12 14:10:11] [HTTP] GET /static/css/reset.css 200 3ms
```
#### Socket connection log

```
[2015-10-12 14:13:54] [SOCKET] Connect mysql with mysql://root:root@127.0.0.1:3306
```

#### Error log

```
[2015-10-12 14:15:32] [Error] Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root3'@'localhost' (using password: YES)

[2015-10-12 14:16:12] [Error] Error: Address already in use, port:8360. http://www.thinkjs.org/doc/error.html#EADDRINUSE
```

#### Multiple router

ThinkJS supports regex router, rule router, static router and other router, and it can be set by module. Those can make URL simply and high performance.

#### Support international and custom theme

You can just use simple method to support i18n and custome theme method in ThinkJS.


## Compare with other framework

#### Express/Koa

express and koa are simple framework to support primary function, and high flexibility develop with much more third party plugin. But It increases project's complexity by using third party component, and the other hand we can't ensure all the third party plugin are safety and efficient.

Koa replace async callback problem by using `*/yield` feature. But the newer `async/await` feature will replace `*/yield` at last.

ThinkJS provides complete solutions, every function has strait test about performance and mermory leaks. And the important is we can use all ES6/7 feature in the project directly.

#### sails

sails , a Node.js framework, also provides complete solutions. It's convinient because of packaging many database, REST API and security hand.

But sails still uses callbak style in async. It's too hard to develop, and can't use ES6/7 fetaure naturally in the project.

#### Disadvantage

Althought ThinkJS has many advantage, there also has little disadvantage like:

- ThinkJS is a new framework without much support from community
- ThinkJS lacks of huge project

### ES6/7 reference documentation

You can read more about ES6/7 features:

* [learn-es2015](http://babeljs.io/docs/learn-es2015/)
* [ECMAScript 6 Guide](http://es6.ruanyifeng.com/)
* [ECMAScript 6 Features](https://github.com/lukehoban/es6features)
* [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)
* [ECMAScript 7 Features](https://github.com/hemanth/es7-features)
* [ECMAScript 7 compatibility table](http://kangax.github.io/compat-table/es7/)

