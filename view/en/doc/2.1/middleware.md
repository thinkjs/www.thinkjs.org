## Middleware

Handling user requests needs to take a lot of processes, such as parsing parameters, determining whether it is a static resource access or not, route parsing, page staticize judgment, executing actions, searching templates, rendering templates and so on. The project may also increase some other processes according to the requirements, like determining whether the IP is in the blacklist, CSRF detection and so on.

ThinkJS uses middlewares to handle these logics, each logic is an independent middleware. Many hooks are buried in the request process, each hook executes a series of middleware serially. And finally, one request logic process is completed.


### Hook List

ThinkJS contains the following hooks.

* `request_begin` request start
* `payload_parse` parse the data submitted
* `payload_validate` verify the data submitted
* `resource` static resource request process
* `route_parse` route parse
* `logic_before` before logic process
* `logic_after` after logic process
* `controller_before` before controller process
* `controller_after` after controller process
* `view_before` before view process
* `view_template` view process
* `view_parse` view parse
* `view_filter` view content filter
* `view_after` after view process
* `response_end` response end

Each hook calls one or more middleware to complete processing. The included middlewares are as the following:

```js
export default {
  request_begin: [],
  payload_parse: ['parse_form_payload', 'parse_single_file_payload', 'parse_json_payload', 'parse_querystring_payload'],
  payload_validate: ['validate_payload'],
  resource: ['check_resource', 'output_resource'],
  route_parse: ['rewrite_pathname', 'subdomain_deploy', 'parse_route'],
  logic_before: ['check_csrf'],
  logic_after: [],
  controller_before: [],
  controller_after: [],
  view_before: [],
  view_template: ['locate_template'],
  view_parse: ['parse_template'],
  view_filter: [],
  view_after: [],
  response_end: []
};
```

### Config Hook

The middlewares executed default by hook usually can not meet the needs of the project. By this time, you can modify the middleware corresponding to the hook. The config file of hook is `src/common/config/hook.js`.

```js
export default {
  payload_parse: ['parse_xml'], // parse xml
}
```

The above config will override the default config. If you want to add them in the original config, you can use the following ways.


##### Append in Front

```js
export default {
  payload_parse: ['prepend', 'parse_xml'], //append parse xml in front
}
```

##### Append in End

```js
export default {
  payload_parse: ['append', 'parse_xml'], //append parse xml in end
}
```

`Note`: It is recommended to use the way of append to config middleware, the name of system middleware may be modified in subsequent versions.

### Execute Hook

Use the method `think.hook` to execute the corresponding hook. eg.

```js
await think.hook('payload_parse', http, data); //return a Promise
```

Use `this.hook` to execute hook directly in the class containing `http` object. eg.

```js
await this.hook('payload_parse', data);
```

### Create Middlewares 

ThinkJS supports two modes of middleware, they are class mode and funcion mode. You can determine which mode to use depending on the complexity of middleware.

#### Class Mode

If middleware needs to execute complex logic, you need to define it as class mode. Use the command `thinkjs` to create middleware, execute the following command in the project directory.

```sh
thinkjs middleware xxx
```

After execution, you will see the corresponding file `src/common/middleware/xxx.js`.

##### ES6 Mode

```js
'use strict';
/**
 * middleware
 */
export default class extends think.middleware.base {
  /**
   * run
   * @return {} []
   */
  run(){
    
  }
}
```

##### Dynamic Creation Class Mode

```js
'use strict';

/**
 * middleware
 */
module.exports = think.middleware({
  /**
   * run
   * @return {} []
   */
  run: function(){

  }
})
```

Middlewares will be passed in `http`, you can use `this.http` to get it. The logic codes are executed in the method `run`. If they contain asynchronous operation, you need to return a `Promise` or use `*/yield`.


#### Function Mode

If middlewares need to execute simple logic, you could define it as function mode. This middleware is not recommended to be created as a separate file, but to put together instead.

You could create the file `src/common/bootstrap/middleware.js`, which will be loaded automatically when service starts. And you can add one or more function mode middleware in this file. eg.


```js
think.middleware('parse_xml', http => {
  if (!http.payload) {
    return;
  }
  ...
});
```

Function mode middlewares will be passed `http` object as a param. If the middleware has asynchronous operation, it need to return a `Promise` or use Generator Function.

The following is the implementation of parsing json payload in framework.

```js
think.middleware('parse_json_payload', http => {
  let types = http.config('post.json_content_type');
  if (types.indexOf(http.type()) === -1) {
    return;
  }
  return http.getPayload().then(payload => {
    try{
      http._post = JSON.parse(payload);
    }catch(e){}
  });
});
```

### Set Value After Parsed

Some middlewares may parse the corresponding datas, and want to reassign `http` object. Such as parse the xml data passed, but hope to use the method `http.get` to get later.


* `http._get` store the value of GET params, http.get(xxx) to get data from this object
* `http._post` store the value of POST params, http.post(xxx) to get data from this object
* `http._file` store the value of uploaded file, http.file(xxx) to get data from this object

```js
think.middleware('parse_xml', http => {
  if (!http.payload) {
    return;
  }
  return parseXML(http.payload).then(data => {
    http._post = data; //assign the parsed data to http._post, use http.post to get value later
  });
});
```

See [API -> http](./api_http.html) for more information about `http`.


### Prevent the Subsequent Execution

When executing the certain conditions, some middlewares may want to prevent the subsequent logic to execute. such as IP blacklist judgement, if hit the blacklist, then directly refuse the current request and no longer execute the subsequent logic.

ThinkJS provides the method `think.prevent` for preventing the subsequent logic to execute. This method returns a specific type of Reject Promise.

```js
think.middleware('parse_xml', http => {
  if (!http.payload) {
    return;
  }
  var ip = http.ip();
  var blackIPs = ['123.456.789.100', ...];
  if(blackIPs.indexOf(ip) > -1){
    http.end();// directly end the current request
    return think.prevent(); // prevent the subsequent codes to execute
  }
});
```

In order to prevent the subsequent logic to execute, beside using the method `think.prevent`, you can also use `think.defer().promise` to return a Pending Promise.

If you don't want to end the current request directly, but return an error page instead, ThinkJS provides the method  `think.statusAction`. See [Extend Function -> Error Handle](./error_handle.html) for detailed usage.


### Use Third-Party Middlewares

You can use third-party middlewares by use `think.middleware`. The corresponding code is in `src/common/bootstrap/middleware.js`. eg.

```js
var parseXML = require('think-parsexml');

think.middleware('parseXML', parseXML);
```

Then just put  `parseXML`  config into hook.

-----

It is recommanded to release the common middlewares of project to npm repository. And the name of middleware is suggested to use `think-xxx`.


### Third-party Middleware List

See [plugin -> middleware](/plugin.html#middleware) for the third-party middleware list.
