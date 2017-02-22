## http

This http object is not the one in Node.js, it is a new object which packaged with request object and response object.

```js
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);
```

As the above code shows, when Node.js create service, it will pass request and respone to callback. For the convenience of invoke, ThinkJS packaged these two objects into its own http object, and offer some useful functions.

The `http` object will be passed to middleware, logic, controller and view.

`Note`: http object is an instance of EventEmitter, so you register event listeners to it.


### Properties

#### http.req

System native request object.

#### http.res

System native response object.

#### http.startTime

A start time of request, it is a `unix` timestamp.

#### http.url

Url of urrent request.

#### http.version

Http version of current request.

#### http.method

Type of current request.

#### http.headers

Header informations of current request.

#### http.pathname

Pathname of current request, router depended on it's value and will change it in some operations. so the return value of action maybe different from the initial value.

#### http.query

Query data of current request.

#### http.host

Host of current request, contain host port.

#### http.hostname

Host of current request, not contain host port.

#### http.payload

Payload data of current request, it has data only if the request is submit type.

#### http._payloadParsed

Means this payload of current request has parsed or not.

#### http._get

Store GET arguments.

#### http._post

Store POST arguments.

#### http._file

Store upload file data.

#### http._cookie

Store cookie data.

#### http.module

The module name of current request parsed.

#### http.controller

The controller name of current request parsed.

#### http.action

The action name of current request parsed.

### Methods

#### http.config(name)

* `name` {String} config name
* `return` {Mixed} return config value

Get the argument of current request config.

#### http.referrer()

* `return` {String} referrer of request

Return the referrer of current request.

#### http.userAgent()

* `return` {String} userAgent of request

Return the userAgent of current request.

#### http.isGet()

* `return` {Boolean}

Return current request is GET request or not.

#### http.isPost()

* `return` {Boolean}

Return current request is POST request or not.

#### http.isAjax(method)

* `method` {String} type of request
* `return` {Boolean}

Return current request is Ajax request or not.

```js
http.isAjax(); // judge request is ajax request or not
http.isAjax('GET'); // judge request is ajax request and is GET type or not
```

#### http.isJsonp(name)

* `name` {String} callback parameter name, default is callback
* `return` {Boolean}

Return current request is jsonp requst or not.

```js
//url is  /index/test?callback=testxxx
http.isJsonp(); //true
http.isJsonp('cb'); //false
```


#### http.get(name, value)

* `name` {String} parameter name
* `value` {Mixed} parameter value

Get or set GET parameter, it can be used to set GET argument for somewhere can get it.

```js
// url is /index/test?name=thinkjs
http.get('name'); // returns 'thinkjs'
http.get('name', 'other value');
http.get('name'); // returns 'other value'
```


#### http.post(name, value)

* `name` {String} parameter name
* `value` {Mixed} parameter value

Get or set POST parameter, it can be used to set POST argument for somewhere can get it.

```js
http.post('email'); // get the submited email
```

#### http.param(name)

* `name` {String} parameter name
* `return` {Mixed}

Get parameter value, firstly to get from POST, if return null, it will get the value from URL parameter.


#### http.file(name)

* `name` {String} field name
* `return` {Object} 

Get the uploaded file.

```js
http.file('image');
//returns 
{
  fieldName: 'image', // the filed name in form
  originalFilename: filename, // origin file name
  path: filepath, // the temp path of store files
  size: size // file size
}
```

#### http.header(name, value)

* `name` {String} header name
* `value` {String} header value

Get or set header information.

```js
http.header('accept'); // get accept
http.header('X-NAME', 'thinkjs'); // set header
```

#### http.expires(time)

* `time` {Number} expire time, unit is second.

Strange cache, set `Cache-Control` and `Expries` header inforamtion.

```js
http.header(86400); // set expire time is one day.
```

#### http.status(status)

set status code, if header has sent, it cannot set status code.

```js
http.status(400); // set status code to 400
```

#### http.ip()

Get user's ip, it will been incorrect if user used proxy.

#### http.lang(lang, asViewPath)

* `lang` {String} the setup of language.
* `asViewPath` {Boolean} whether add a directory layer for language template.

Get or set global language, it support more directory layer for language template.

##### Get language

```js
let lang = http.lang();
```

The order to get language is `http._lang` -> `get from cookie` -> `get from header`, if need to parse language from url, you can set `http._lang` with `http.lang(lang)` after get url.

##### set language

```js
let lang = getFromUrl();
http.lang(lang, true); // set language, and set a directory layer for language template.
```

#### http.theme(theme)

Get or set theme, after setting, it will generate a lay for theme.

#### http.cookie(name, value)

* `name` {String} cookie name
* `value` {String} cookie value

Read or set cookie.

```js
http.cookie('think_test'); // get cookie named think_test
http.cookie('name', 'value'); // get cookie, invalid if header has sent.
```


#### http.session(name, value)

* `name` {String} session name
* `value` {Mixed} session value
* `return` {Promise}

Read, set and clean session.

##### Read Session

```js
let value = await http.session('userInfo');
```

##### set Session

```js
await http.session('userInfo', data);
```

##### clean Session

```js
await http.session();
```

#### http.redirect(url, status)

* `url` {String} the url will jump
* `status` {Number} status code, 301 or 302, default is 302.

Jump page.

```js
http.redirect('/login'); // jump to login page.
```

#### http.type(contentType, encoding)

* `contentType` {String} contentType which need to modify
* `encoding` {String} encode to set

Read or set Content-Type.

```js
http.type(); // get Content-Type
http.type('text/html'); // get Content-Type, it will add charset automatically
http.type('audio/mpeg', false); // set Content-Type, not add charset
```

#### http.write(content, encoding)

* `content` {Mixed} the content to write
* `encoding` {String} charset

Write content, end request only invoke http.end.

#### http.end(content, encoding)

* `content` {Mixed} the content to write
* `encoding` {String} charset

Write content and stop current request.

#### http.success(data, message)

* `data` {Mixed} the content to write
* `message` {String} added message

Response a format normal data , always after operate success.

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

#### http.fail(errno, errmsg, data)

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

#### http.json(data)

* `data` {Object}

Output data in json way, it will set Content-Type to `application/json`, its config is `json_content_type`.

