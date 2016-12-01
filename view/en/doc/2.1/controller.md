## Controller

Controller is a collection of same type operations, they respond to same type user requests.

### The Definition of Controller

Creating a file `src/home/controller/article.js`, means that there’s a controller called `article` in the `home` module, and the content of each controller is similar to the following:

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

If you do not use ES6 syntax, then the content is similar to the following:

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

NOTE: The `Base` above represents the definition of a base class, other classes inherit it, so that you can do some general thing in it.

### Multi-levels Controller

For complicated projects, only have one level controller may not work well. Right now you can create multiple levels controller, the file `src/home/controller/group/article.js` for example will points to the second level controller `group/article`. Logic and View are the same.

### Use Generator Function

You can easily use the generator function to handle asynchronous nesting problems in the `controller`.

##### The ES6 Way

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

##### Dynamically Create Classes

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

With the Babel compilation, you can also use ES7's `async/await`.

##### The ES6 Way

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

##### Dynamic Creation

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

### init Method

The class in ES6 has a constructor method, but the classes that dynamically created do not, in order to perform the initialization uniformly, ThinkJS redefined it as `init`.

This method is automatically called when the class is instantiated, without manually call needed.

##### The ES6 Way
　
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

##### Dynamically Create Classes

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

When using `init` method, don't forget to call call super-class's `init` method and make sure pass the `http` in.

### Pre-Operation __before

ThinkJS supports pre-operation with the method called `__before`, it will be automatically called before a specific Action execution. If the pre-operation prevents subsequent code continuing to execute, it does not call the specific Action, so you can end request in advance.

##### The ES6 Way
　
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

A action represents an operation to be performed for response to an user request. Such as if URL is `/home/article/detail`, the module is `/home`, the controller is `article`,and the Action is `detail`, so the Action to be executed is the `detailAction` method in the file `src/home/controller/aritcle`.

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

If Action name parsed contains `_` , it will automatically do the conversion, for the details of specific strategies of the conversion, see [Routing -> case](./route.html).

### Post-Operation __after

ThinkJS supports post-operation called `__after`, it will be executed after a specific Action execution. If a specific Action prevents subsequent code continuing to execute, the post-operation will not be invoked.

### No-operation __call

If one controller is found to exist after parsed URL, but the Action does not exist, it will attempt to call the `__call` magic method of the controller. This way, we can unifiedly treated the missing Actions.

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

### Error Handling

If URL does not exist, the current user has no permission to do some operations or there are other unusual requests, it will enter the error handling process. ThinkJS itself built a complete error handling mechanism, for details see[extensions -> error] (./error_handle.html).

### Data Validation

Before using the user-submitted data in the controller, it needed to verify its legitimacy. In order to reduce the logic complexity, ThinkJS provides a logic layer that designed to handle data and permission validation and other related operations.

For more information, please see [Extended Functions -> Data Validation](./validation.html).

### Variable Assignment and Template Rendering

Controller can do variable assignment and template rendering through `assign` and `display` method, specific information can be found [here](./view.html).

### Model Instantiation

In controllers, you can quickly get an instance of a model by call `this.model` method.

```js
export default class extends think.controller.base {
  indexAction(){
    let model = this.model('user'); //instantiate mode `user`
    ...
  }
}
```

More usage of `model` method can be found at [API -> think.http.base](./api_think_http_base.html#toc-e2b).

### http Object

When a controller is instantiated, the `http` will be passed in. The `http` is a object that ThinkJS repacked for the `req` and `res`, it is not built in Node.js.

In Action, it can be obtained by `this.http`.

```js
'use strict';

import Base from './base.js';

export default class extends Base {
  indexAction(){
    let http = this.http;
  }
}
```

Details about the properties and methods of `http` object can be found at [API -> http](./api_http.html).

### REST API

Sometimes, the project has to provide some `REST` interfaces for third party to use, these interfaces are nothing more than the CRUD operations.

If you feel writing these operations by hand is very trouble, ThinkJS provides a REST Controller, that will automatically contains generic CRUD operations. If these actions do not satisfy your demand, it can also be customized. Specifically, [see here](./rest_api.html).

### The this Scoping Issue

There are often many asynchronous operations in Node.js development, and the common approach is to use a callback function or `Promise`. These treatments will increase a level of scope, making it impossible to use `this` directly in the callback function, the simple approach to solve it is to define a variable at the top, `this` will be assigned to the variable, and then use the variable in the callback function. Such as:

```js
module.exports = think.controller({
  indexAction: function(){
    var self = this; // assign the reference of this to self
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```

Writing `var self = this` in each Action must be very trouble. To solve this problem, ThinkJS provides a parameter directly in Action, which is equivalent to `var self = this`, as follows:

```js
module.exports = think.controller({
  // here, self is equivalent to var self = this
  indexAction: function(self){
    this.model('user').find().then(function(data){
      return self.model('article').where({user_id: data.id}).select();
    }).then(function(data){
      self.success(data);
    })
  }
})
```
Of course, the recommended and better solution is to use the Generator Function and Arrow Function of ES6.

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

Many projects need provide interfaces that output data in JSON format, and there also must be a flag to indicate whether the interface is normal or not. If an exception occurs, the corresponding error message needs to be output together. The controller provides the `this.success` and `this.fail` methods to output interface data.

#### Output Normal JSON

The normal interface data can be output through `this.success` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let data = {name: "thinkjs"};
    this.success(data);
  }
}
```

In this example, the output is `{errno: 0, errmsg: "", data: {"name": "thinkjs"}}`, the client can determine whether there is an exception with the current interface through `errno` is 0 or not.

#### Output JSON Contained the Error Message

Interface data contained error messages may output by the `this.fail` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.fail(1000, 'connect error'); //指定错误号和错误信息
  }
}
```

In this example, the output is `{errno: 1000, errmsg: "connect error"}`. When clients found `errno` is greater than zero, then it know there are exceptions with the current interface, so it can in turn to get specific error information through `errmsg`.

##### Configure Error Number and Error Message

It's recommended to configurate the error numbers and error messages in one place , then as long as specify error number when outputting, error information based on the error number will be automatically read out.

Error messages support internationalization, and the configuration is in the file `src/common/config/locale/[lang].js`. Such as:

```js
export default {
  10001: 'get data error'
}
```

With the above configuration, performing `this.fail(10001)` will automatically get corresponding error message, "get data error" in this case.

##### Friendly Error Number

Although it can output the correct error number and error message when performing the `this.fail (10001)`, but we can not intuitively see what error message corresponding it.

We recommend you to configure the keys using uppercase strings, and the value is an array with the error number and error message as its elements. Such as:

```js
export default {
  GET_DATA_ERROR: [1234, 'get data error'] //key 必须为大写字符或者下划线才有效
}
```

This way, when you calling `this.fail('GETDATA ERROR')`, you will automatically get the corresponding error number and error message.

#### Format Configuration

The keys of the default error number and error message are `errno` and `errmsg` respectively. If needed, you can modify the configuration file `src/common/config/error.js` to reset them.

```js
export default {
  key: 'errno', //error number
  msg: 'errmsg', //error message
}
```


#### Output The JSON That Does Not Contain The Error Message

If you don’t want the outputed JSON data contained `errno` and `errmsg`, you can output JSON by `this.json` method. Such as:

```js
export default class extends think.controller.base {
  indexAction(){
    this.json({name: 'thinkjs'});
  }
}
```

### Common Functions

#### Get GET Parameters

You can obtain GET parameters through the `get` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let name = this.get('name');
    let allParams = this.get(); // obtain all GET parameters
  }
}
```

If the parameter does not exist, the value will be an empty string.

#### Get POST Parameters

You can obtain POST parameters through the `post` method, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let name = this.post('name');
    let allParams = this.post(); // obtain all POST parameters
  }
}
```

If the parameter does not exist, then the value will be an empty string.

#### Get Uploaded Files 

You can obtain the uploaded files by using `file` methods, such as:

```js
export default class extends think.controller.base {
  indexAction(){
    let file = this.file('image');
    let allFiles = this.file(); // obtain all uploaded files
  }
}
```

The return value is an object that contains the following attributes:

```js
{
  fieldName: 'file', // form field's name
  originalFilename: filename, // original file's name
  path: filepath, // file's temporary path, the file will be deleted when request end 
  size: 1000 // file size
}
```

If the file does not exist, then the value will be an empty object `{}`.

#### JSONP Format Data Output

You can output data in JSONP format by `this.jsonp` method, the name of the callback request parameter defaults to `callback`. If you need to modify its name, you can modifying the configuration `callback_name`.

#### More Methods

* `isGet()` Used for check is it currently a GET request
* `isPost()` Used for check is it currently a POST request
* `isAjax()` Used for check is it currently a AJAX request
* `ip()` Used for get requesting user's ip
* `redirect(url)` Used for jump to an URL
* `write(data)` Output data, automatically call JSON.stringify 
* `end(data)` End the current HTTP request
* `json(data)` Output JSON data, automatically send content-type Headers that related to JSON
* `jsonp(data)` Output JSONP data, the request parameter name defaults to the `callback`
* `success(data)` Output success JSON data with error info, such as `{errno: 0, errmsg: "", data: data}`
* `fail(errno, errmsg, data)` Output error JSON data with error info, such as `{errno: errno_value, errmsg: string, data: data}`
* `download(file)` Used for download a file
* `assign(name, value)` Set a variable so that we can use it in the template
* `display()` Output a template
* `fetch()` Rendering the template and get the result
* `cookie(name, value)` Get or set the cookie
* `session(name, value)` Get or set the session
* `header(name, value)` Get or set the header 
* `action(name, data)` Call other Controller's method, included those in other modules
* `model(name, options)` Initiated a model instance

A complete list of methods please see [API -> Controller](./api_controller.html)。


