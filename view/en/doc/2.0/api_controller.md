## controller

The `think.controller.base` class inherit from [think.http.base](./api_think_http_base.html) class, controllers in project need to inherit it.


### Inheritence with ES6:

```js
export default class extends think.controller.base {
  indexAction(){

  }
}
```

### Inheritence With Normal Way

```js
module.exports = think.controller({
  indexAction(){

  }
})
```


### Property

#### controller.http

Passed [http](./api_http.html) object.

### Methods

#### controller.ip()

* `return` {String}

Get user ip of current request, it is equal to `http.ip`.

```js
export default class extends think.controller.base {
  indexAction(){
    let ip = this.ip();
  }
}
```

#### controller.method()

* `return` {String}

Get type of current request, and convert to lowercase.

```js
export default class extends think.controller.base {
  indexAction(){
    let method = this.method(); //get or post ...
  }
}
```

#### controller.isMethod(method)

* `method` {String} method
* `return` {Boolean}

Judge type of current request is named types.

#### controller.isGet()

* `return` {Boolean}

Judge is GET request or not.

#### controller.isPost()

* `return` {Boolean}

Judge is POST request.

#### controller.isAjax(method)

* `method` {String}
* `return` {Boolean}

Judge is Ajax request, if named method, then as same as the type of request.

```js
export default class extends think.controller.base {
  indexAction(){
    // is ajax and request type is POST
    let isAjax = this.isAjax('post');
  }
}
```

#### controller.isWebSocket()

* `return` {Boolean}

Whether is websocket request or not.

#### controller.isCli()

* `return` {Boolean}

Whether is run in command mode or not.

#### controller.isJsonp(callback)

* `callback` {String} callback name
* `return` {Boolean}

Whether is jsonp request.

#### controller.get(name)

* `name` {String} parameter name

Get parameter of GET.

```js
export default class extends think.controller.base {
  indexAction(){
    // get a parameter
    let value = this.get('xxx');
    // get all parameter
    let values = this.get();
  }
}
```

#### controller.post(name)

* `name` {String} parameter name

Get parameter of POST data.

```js
export default class extends think.controller.base {
  indexAction(){
    // get a value of parameter
    let value = this.post('xxx');
    // get all parameter of POST
    let values = this.post();
  }
}
```

#### controller.param(name)

* `name` {String} parameter name

Get parameter value, first to read from POST, if return null, then get from GET.


#### controller.file(name)

* `name` {String} field name of upload file

Get uploaded file, return value is a object, contains these method below:

```js
{
  fieldName: 'file', // field name
  originalFilename: filename, // original file name
  path: filepath, // path of temp store file, need to move this path when using, or exists until request ends.
  size: 1000 // file size
}
```

If file not exist, this returning is an empty object `{}`.

#### controller.header(name, value)

* `name` {String} header name
* `value` {String} header value

Get or set header。

```js
export default class extends think.controller.base {
  indexAction(){
    let accept = this.header('accept'); // get header
    this.header('X-NAME', 'thinks'); // set header
  }
}
```

#### controller.expires(time)

* `time` {Number} expires time, the unit is seconds

Strong cache, set `Cache-Control` and `Expires` header information.

```js
export default class extends think.controller.base {
  indexAction(){
    this.expires(86400); // set expire time to one day.
  }
}
```

#### controller.userAgent()

Get userAgent。

#### controller.referrer(onlyHost)

* `referrer` {Boolean} whether only need host

Get referrer。

#### controller.cookie(name, value, options)

* `name` {String} cookie name
* `value` {String} cookie value
* `options` {Object}

Get or set cookie。

```js
export default class extends think.controller.base {
  indexAction(){
    // get value of cookie
    let value = this.cookie('think_name');
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    // get value of cookie
    this.cookie('think_name', value, {
      timeout: 3600 * 24 * 7 // expires time is one week
    });
  }
}
```

#### controller.session(name, value)

* `name` {String} session name
* `value` {Mixed} session value
* `return` {Promise}

Read, set and clean session。

##### Read Session

```js
export default class extends think.controller.base {
  async indexAction(){
    // read session
    let value = await this.session('userInfo');
  }
}
```

##### set Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //set session
    await this.session('userInfo', data);
  }
}
```

##### Clean Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //清除当前用户的 session
    await this.session();
  }
}
```

#### controller.lang(lang, asViewPath)

* `lang` {String} the setup of language
* `asViewPath` {Boolean} whether add a directory layer for language template.

Read or set language.

#### controller.locale(key)

* `key` {String} 

Based on language to get the language version.


#### controller.redirect(url, statusCode)

* `url` {String} the url to jump
* `statusCode` {Number} status code, default is 302

Page jump.

#### controller.assign(name, value)

* `name` {String | Object} variable name
* `value` {Mixed} variable value

Assign variable into template.

```js
export default class extends think.controller.base {
  indexAction(){
    // single assign
    this.assign('title', 'thinkjs');
    // multi-assign
    this.assign({
      name: 'xxx',
      desc: 'yyy'
    })
  }
}
```

#### controller.fetch(templateFile)

* `templateFile` {String} tempate file path
* `return` {Promise}

Get the parsed template content.

##### Get directly ##### 

```js
// suppose the file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_index.html
    let content = await this.fetch();
  }
}
```

##### Change action ##### 

```js
// suppose file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_detail.html
    let content = await this.fetch('detail');
  }
}
```

##### Change controller and action ##### 

```js
// suppose file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/user_detail.html
    let content = await this.fetch('user/detail');
  }
}
```

##### Change module, controller 和 action ##### 

```js
// suppose file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // admin/user_detail.html
    let content = await this.fetch('admin/user/detail');
  }
}
```

##### Change file extension ##### 

```js
// suppose file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_detail.xml
    let content = await this.fetch('detail.xml');
  }
}
```

##### Get absoulte file path ##### 

```js
// suppose file path is /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // /home/xxx/aaa/bbb/c.html
    let content = await this.fetch('/home/xxx/aaa/bbb/c.html');
  }
}
```

#### controller.display(templateFile)

* `templateFile` {String} template file path

Output template content to browser side. strategy of finding template is the same as `controller.fetch`.

#### controller.jsonp(data)

* `data` {Mixed} content to output

Using the way of jsonp to output content, after getting callback's name and security filter then output.

```js
export default class extends think.controller.base {
  indexAction(){
    this.jsonp({name: 'thinkjs'});
    //writes
    'callback_fn_name({name: "thinkjs"})'
  }
}
```

#### controller.json(data)

* `data` {Mixed} the output content

Json way to output.

#### controller.status(status)

* `status` {Number} status code, default is 404

Set status code.

#### controller.deny(status)

* `status` {String} status code, default is 403

Deny current request.

#### controller.write(data, encoding)

* `data` {mixed} the output content
* `encoding` {String} charset

Output content.

#### controller.end(data, encoding)

* `data` {mixed} the output content
* `encoding` {String} charset

After output content, end current request.

#### controller.type(type, charset)

* `type` {String} Content-Type
* `charset` {Boolean} wheher append charset or not

Set Content-Type。

#### controller.download(filePath, contentType, fileName)

* `filePath` {String} specified path of download file
* `content-Type` {String} Content-Type
* `fileName` {String} error file name

Download file.

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.txt';
    // auto identify Content-Type, save file to a.txt
    this.download(filePath);
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    // auto identify Content-Type, save file to b.txt
    this.download(filePath, 'b.txt');
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    // specify Content-Type to text/html, save file to b.txt
    this.download(filePath, 'text/html', 'b.txt');
  }
}
```

#### controller.success(data, message)

* `data` {Mixed} the output data
* `message` {String} appended message

Output an normal formatted data, often after operate success.

```js
http.success({name: 'thinkjs'});
//writes
{
  errno: 0,
  errmsg: '',
  data: {
    name: 'thinkjs'
  }
}
```

Client can based on `error` is `0` or not to judge current request is success.

#### controller.fail(errno, errmsg, data)

* `errno` {Number} error number
* `errmsg` {String} error message
* `data` {Mixed} extra data

Output an unusual formatted data, normally after operate failed.

`Notice`: field name `errno` and `errmsg` can been modified in config.

```js
http.fail(100, 'fail')
//writes
{
  errno: 100,
  errmsg: 'fail',
  data: ''
}
```

In this way, client will get detail error number and error message, then show message according to the need.

`Notice`: filed name `errno` and `errmsg` can been modified in config.

#### controller.sendTime(name)

* `name` {String} header key

The execute time of send request, send with header.
