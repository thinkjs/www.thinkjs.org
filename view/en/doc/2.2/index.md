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
    //take username to match data in database
    let result = await this.model('user').where({name: data.name}).find();
    if(!validateLogin(result)){
      return this.fail('login fail');
    }
    //write user info into session after reciving user infomation
    await this.session('userInfo', result);
    return this.success();
  }
}
```

We've used ES6 features like `class`, `export`, `let` and ES7 features like `async/await` in this example. Database queries and `Session` writing were all asynchronous actions, but here we are writing sync code to handle them with `async/await`. Last, it can run in Node.js environment stably after `Babel` compiling.

#### Supports TypeScript

[TypeScript](http://www.typescriptlang.org/) is an free and open source programming language designed by Microsoft. TypeScript is a typed superset of JavaScript that it has some useful function in large project such as optional static type.

ThinkJS 2.1 has supported TypeScript, the code will be auto compiled and updated during the develop process. You can know more from [here](./typescript.html)。

#### Supports variant project structures and environments

When using ThinkJS, you can apply single module mode, general mode or mutiple modules mode, and to develop projects with it's complexity range from very low to very high.

By default, there are three kinds of project environments: `development`, `testing` and `production`, you can use different configuration in different environment to support different requests. You can also custom and extend them in your projects.

#### Supports Abundant Database Type

ThinkJS supports `MySQL`, `MongoDB` and `SQLite`. It encapsulates many APIs of the database operations, without having to manually stitching SQL statements. You can automatically prevent SQL injection and other vulnerabilities. It also supports transaction and association and other advanced features.

#### Automatic Updating

ThinkJS has a mechanism that could automatically update codes after source files being modified without resort to restart Node.js server and other third party modules.

#### Automatic REST API Creation

You can use `thinkjs` command to create REST API automatically without writing any extra code. Meanwhile, you can also easily add filter or auth check if you want.

#### Supports multiple WebSocket libraries

ThinkJS supports some common WebSocket libraries like `socket.io` and `sockjs`, and packages them to provide the consistent APIs to developers.

#### Plentiful Test Cases

ThinkJS includes 1500+ test cases with the code coverage at 95%. Every change has its test case to insure the framework functions well.

#### Supports CLI to run cron job

`Action` in ThinkJS can both response to user request and the CLI invoke. With this feature, we can excute cron job more easily.

#### Hooks and Middlewares

ThinkJS supports Hooks and Middlewares, they make the requests handling much more flexible.

#### Detailed log

ThinkJS builds-in the detailed log function, it makes us read log and track problems easily.

#### HTTP request log
```
[2015-10-12 14:10:03] [HTTP] GET /favicon.ico 200 5ms
[2015-10-12 14:10:11] [HTTP] GET /zh-cn/doc.html 200 11ms
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

#### Configurable Routers

The routers ThinkJS supported include regex router, rule router and static router, and router can be set based on modules. That's very helpful for us to make URLs more simple and reserve their high performance at the same time.

#### Supports international and custom themes

ThinkJS provides us very simple methods to implement i18n and custom themes.


### Comparing With Other Frameworks

#### Express/Koa

Express and koa are simple frameworks, they all only provide the very basic functions. So for developing complex projects, one must introduces the third party plugins. Though small cores often mean big flexibility, the introducing of other plugins would increases the project's complexity. Besides, no one can ensure all the third party plugins are safety and efficient.

Koa 1.x solved asynchronous callbacks problem by using `*/yield` feature. But the newer `async/await` feature will replace `*/yield` at last. ThinkJS supports both features well.

On the other hand, ThinkJS choosed to provide the full set of solutions. But not only that, in ThinkJS, every function has been strictly tested for performance optimazition and prevent mermory leaks. And the important thing is that we can use all ES6/7 feature in the project directly.

#### Sails

Sails is another Node.js framework that also provides complete solution. It's convinient because of the encapsulation of databases, REST APIs and security features.

But Sails still uses callbacks in asynchronous code. That's too hard to develop, and can't use ES6/7 features naturally in the projects.

#### Disadvantages

Even though ThinkJS has many advantages, it has also a few disadvantages too, for example:

- ThinkJS is a relatively new framework, the community is not strong enough.
- ThinkJS is short of large scale applications.

#### Performance Comparsion

To evaluate whether a framework is good or not, the features it provided and the performance it could reach are qually important. Although ThinkJS more suits for large projects, features and complexity far exceeds Express and Koa, but its performance is not much less than them.

<img src="https://p.ssl.qhimg.com/t01897b6d34f6e0ea31.png" alt="thinkjs-performance" style="max-width:100%">


`tips`: The above data using distributed stress testing system to test.

All we can see is that there has just little distance between ThinkJS and Express/Koa. ThinkJS and Sails.js both more suit for large projects, but ThinkJS has higher performance than Sails.js.

You can go <https://github.com/thinkjs-team/thinkjs-performance-test> to clone all testing code and run it locally. If you use `ab` testing tool, note that it is instability on Mac.

### ES6/7 reference documentation

You can read more about ES6/7 features here:

* [learn-es2015](http://babeljs.io/docs/learn-es2015/)
* [ECMAScript 6 Guide](http://es6.ruanyifeng.com/)
* [ECMAScript 6 Features](https://github.com/lukehoban/es6features)
* [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)
* [ECMAScript 7 Features](https://github.com/hemanth/es7-features)
* [ECMAScript 7 compatibility table](http://kangax.github.io/compat-table/es7/)

