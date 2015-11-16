## Controller

The controller is a collection of operations, which responds to users’ the same type of request.

### The definition of controller

Creating a file `src/home/controller/article.js`, means that there’s a controller called `article` in the `home` module, 
and the file is similar to the following:

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
}
```

If you do not use ES6 syntax, then the file is similar to the following:

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function(self){
    //auto render template file index_index.html
    return self.display();
  }
});
```

NOTE: The `Base` word above represents the definition of a base class, other classes inherit the base class, so that you can do some general thing in the base class.

### Use generator function

You can easily use the Generator Function to handle asynchronous nesting problems in the `controller`.

##### The way of ES6 

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  * indexAction(){
    let model = this.model('user');
    let data = yield model.select();
    return this.success(data);
  }
}
```

##### The way of creating a class

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: function *(){
    var model = this.model('user');
    var data = yield model.select();
    return this.success(data);
  }
});
```

### Use async/await

With the Babel compilation, you can also `use async/await` in the ES7 in the controller.

##### The way of ES6

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let model = this.model('user');
    let data = await model.select();
    return this.success(data);
  }
}
```

##### The way of dynamic creation

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction: async function(){
    var model = this.model('user');
    var data = await model.select();
    return this.success(data);
  }
});
```

### init method

The class in ES6 has a constructor method, but the class dynamically created does not, in order to perform the initialization unified approach, the method is unifiedly defined as `init`.

This method is automatically called when the class is instantiated, without manually call.

##### The way of ES6 **
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  init(http){
    super.init(http); //call super-class's `init` method
    ...
  }
}
```

##### The way of dynamic creation

```js
'use strict';

var Base = require('./base.js');

module.exports = think.controller(Base, {
  init: function(http){
    this.super('init', http); //call super-class's `init` method
    ...
  }
});
```

when using the init method, you need to call the init method in the super-class and make the `http` parameters passed in.
### Pre-Operation __before

ThinkJS support pre-operation, the method called `__before`, it will be automatically called before a specific Action calls. If the pre-operation prevents subsequent code continuing to execute, it does not call specific Action, so you can end request in advance.

##### The way of ES6**
　
```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * Pre-Operation
   * @return {Promise} []
   */
  __before(){
    ...
  }
}
```


### Action

A action represents an operation to be performed. Such as: if url is `/home/article/detail`, parsed modules is `/home`, controller for the `article`, Action for the `detail`, so the Action to be executed is the `detailAction` method in the file `src/home/controller/aritcle`.

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * obtain detailed information
   * @return {Promise} []
   */
  detailAction(self){
    ...
  }
}
```

If Action value parsed contains `_` , it will automatically do the conversion, the specific strategies of conversion, see [Routing -> case](./route.html).

### Post-Operation __after

ThinkJS support post-operation called `__after`, it will be executed after a specific Action calls. If a specific Action prevents subsequent code continuing to execute, the post-operation is not invoked.

### No-operation __call

When the controller which is parsed by url exists, but the Action does not exist, it will attempt to call the `__call` magic method of the controller. The method which does not exist can be unifiedly treated.

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * @return {Promise} []
   */
  __call(){
    ...
  }
}
```

### Error handling

When the url does not exist or the present user has no permission and there are other unusual request, it will be called error handling. ThinkJS itself built a detailed error handling mechanism, see specific [extensions -> error] (./error_handle.html).

### Data validation

Before using the user-submitted data in the controller, it need to verify the legitimacy of data. In order to reduce the logic complexity of the controller, ThinkJS provides a layer of Logic designed to handle data validation and permission validation and other related operations.

For more information, please see [Extended Functions -> Data validation](./validation.html).

### Variable assignment and template rendering

The controller can do variable assignment and template rendering through `assign` and `display` method, specific information can be found [here](./view.html).

### Model instantiation

In the controller, you can quickly get an instance of a model by `this.model` method.

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model('user'); //instantiate mode `user`
    ...
  }
}
```

More usage of `model` method can be found [API -> think.http.base](./api_think_http_base.html#toc-e2b).

### http object

When the controller is instantiated, the `http` will be passed in. The `http` is a object that ThinkJS repack for the `req` and `res`, rather than built in Node.js.

If you want to get the object from Action, it can be obtained by `this.http`.

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  indexAction(){
    let http = this.http;
  }
}
```

Things about the properties and methods of `http` object can be found at [API -> http](./api_http.html).

### REST API

Sometimes, the project has to provide some `REST` interfaces for third party to use, these interfaces are nothing less than the CRUD operations.

If writing these operations by hand is very trouble, ThinkJS provides a REST Controller, that will automatically contains generic CRUD operations. If these actions do not satisfy demand, but also can be customized. Specifically, [see here](./rest_api.html).

### this the scoping issue

There often are many asynchronous operation in Node.js, and the common approach is to use a callback function or `Promise`. These treatments will increase a level of scope, making it impossible to use `this` directly in the callback function, the simple approach is to define a variable at the top, this will be assigned to this variable, and then use this variable in the callback function. Such as:

```js
module.exports = think.controller({
  indexAction: function(){
    var self = this; //这里将 this 赋值给变量 self，然后在后面的回调函数里都使用 self
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```

If user must manually write `var self = this` in each Action, it’s certainly very trouble. To solve this problem, ThinkJS provides a parameter directly in Action, which is equivalent to `var self = this`, as follows:

```js
module.exports = think.controller({
  //参数 self 等同于 var self = this
  indexAction: function(self){
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```
Of course, a better solution is recommended to use the Generator Function and Arrow Function of ES6, so you can solve the problem of `this` scope thoroughly.

##### Use Generator Function
```js
export default class extends think.controller.base {
  * indexAction(){
    let data = yield this.model('user').find();
    let result = yield this.model('article').where({user_id: data.id}).select();
    this.success(result);
  }
}
```


##### Use Arrow Function

```js
module.exports = think.controller({
  indexAction: function(){
    this.model('user').find().then(data => {
      return this.model('article').where({user_id: data.id}).select();
    }).then(data => {
      this.success(data);
    })
  }
})
```

### Output JSON

Projects often provide some interfaces, which generally output data in JSON format, and there will be a flag to indicate that the current interface is normal or not. If an exception occurs, the corresponding error message needs to be output together with the interface. The controller provides the `this.success` and `this.fail` such methods to output interface data.

#### Output normal JSON

The normal interface data can be output through `this.success` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let data = {name: "thinkjs"};
    this.success(data);
  }
}
```

The output is `{errno: 0, errmsg: "", data: {"name": "thinkjs"}}`, the client can determine whether there is an exception with the current interface through `errno` is 0 or not.

#### Output JSON contained the error message

Interface data contained error messages may output by the `this.fail` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.fail(1000, 'connect error'); //指定错误号和错误信息
  }
}
```

The output is `{errno: 1000, errmsg: "connect error"}`, the client determines `errno` is greater than zero, then know there are exceptions with the current interface, and to get specific error information through `errmsg`.

##### Configure error number and error message

If every place which need to output error data must specify error number and error message, it is bound to be very trouble, the better way is configurate the error code and error information in same place , then as long as specify error number when outputting, error information based on the error number will automatically read.

Error message supports internationalization, so the configuration is in the file `src/common/config/locale/[lang].js`. Such as:

```js
export default {
  10001: 'get data error'
}
```

By the above configuration, it will automatically read the corresponding error message when performing `this.fail (10001)`.

##### Friendly error number

Although it can output the correct error number and error message when performing the `this.fail (10001)` in the program, but we can not intuitively see what the error message of error number corresponding is.

Then you can configure the key to uppercase string, the value is the error number and error message. Such as:

```js
export default {
  GET_DATA_ERROR: [1234, 'get data error'] //key 必须为大写字符或者下划线才有效
}
```

When running `this.file ('GETDATA ERROR')`, it will automatically take the corresponding error number and error messages.

#### Format configuration

The key of the default error number is `errno`, error information is `errmsg`. If the demand is not satisfied, then you can modify the configuration file `src/common/config/error.js`.

```js
export default {
  key: 'errno', //error number
  msg: 'errmsg', //error message
}
```


#### Output the JSON that does not contain the error message

If you don’t want the output data in JSON contained `errno` and `errmsg`, you can output JSON by `this.json` method. Such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.json({name: 'thinkjs'});
  }
}
```

### Common functions

#### Get GET parameters

You can obtain GET parameters through the `get` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let name = this.get('name');
    let allParams = this.get(); //获取所有 GET 参数
  }
}
```

If the parameter does not exist, then the value is an empty string.

#### Get POST parameters

You can obtain POST parameters through the `post` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let name = this.post('name');
    let allParams = this.post(); //获取所有 POST 参数
  }
}
```

If the parameter does not exist, then the value is an empty string.

#### Get upload file 

You can obtain the file by `file` methods, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let file = this.file('image');
    let allFiles = this.file(); //获取所有上传的文件
  }
}
```

The return value is an object that contains the following attributes:

```js
{
  fieldName: 'file', //表单字段名称
  originalFilename: filename, //原始的文件名
  path: filepath, //文件保存的临时路径，使用时需要将其移动到项目里的目录，否则请求结束时会被删除
  size: 1000 //文件大小
}
```

If the file does not exist, then the value is an empty object `{}`.

#### JSONP format data output

You can output data in JSON format by `this.jsonp` method, the name of the callback request parameter defaults to `callback`. If you need to modify the name of the request parameter , it can be accomplished by modifying the configuration `callback_name`.

#### More methods

* `isGet()` Is it currently a GET request or not 
* `isPost()` Is it currently a POST request or not
* `isAjax()` Is it  a AJAX request or not 
* `ip()` Get requesting user’s ip
* `redirect(url)` Jump to a url
* `write(data)` Output data, automatically call JSON.stringify 
* `end(data)` End the current HTTP request
* `json(data)` Output the JSON data, automatically send JSON related the content-type
* `jsonp(data)` Output the json data, the request parameter name defaults to the `callback`
* `success(data)` Output normal JSON data, data format for `{errno: 0, errmsg: "", data: data}`
* `fail(errno, errmsg, data)` Output error JSON data, data format for `{errno: errno_value, errmsg: string, data: data}`
* `download(file)` download file
* `assign(name, value)` Set the template variables 
* `display()` Output a template
* `fetch()` Apply colours to a drawing template and access to content
* `cookie(name, value)` Get or set the cookie
* `session(name, value)` Get or set the session
* `header(name, value)` Get or set the header 
* `action(name, data)` Call other Controller method, across modules 
* `model(name, options)` Obtain a model instance

A complete list of methods please see [API -> Controller](./api_controller.html)。


