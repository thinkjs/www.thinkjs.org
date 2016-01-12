## Route

When an user visit an URL, eventually which module, controller and operation will be performed is decided by the parsed route.

ThinkJS provides a flexible route mechanism, in addition to the default resolution, it also support a variety forms of custom route, let the URLs more simple and friendly.

### Resolving URL to pathname

When a user accesses to the service, the server first of all, will get a full URL, such as `http://www.thinkjs.org/zh-cn/doc/2.0/route.html`.

The pathname resolved by URL is `/zh-cn/doc/2.0/route.html`.

### pathname Filter

Sometimes for the sake of SEO or other reasons, the URL will be added a few more things. Say the current page is a dynamic page, but the URL ended with suffix `.html` is more friendly to search engines. But the suffix is useless in the subsequent route resolution, it needs to be removed.

ThinkJS offer the following configuration, it can remove the prefix and postfix content of `pathname`:

```js
export default {
  pathname_prefix: '', 
  pathname_suffix: '.html',
}
```

Above configuration can be modified in the `src/common/config/config.js`.

When filtering, the `/` before and after pathname will be removed, and this logic is not affected by the configuration above. After filtering the pathname, the clean pathname you get is `zh-cn/doc/2.0/route`.

`Note`: If the URL is `http://www.thinkjs.org/`, then the clean pathname you get is an empty string.

### Subdomain Deployment

For complex projects, we may want to deploy different function under the different domain, but the code is still in a single project. For example thought the domain name `admin.exanple.com` was deployed to host the administraion functions, we still hope that it can be mapped to the `admin` module.

ThinkJS provides the following configuration that it can undertake subdomain deployment, the configuration can be set in the `config/config.js`:

```js
export default {
  subdomain: {
    admin: 'admin', // means map admin.example.com to the admin module
    ...
  }
}
```

If the filtered pathname is `group/detail` ,and the ULR hit the subdomain admin.example.com, the pathname will become to `admin/group/detail` internally.

### Routing Identification

#### Routing Resolving

By default, routing identification identify the filtered pathname according to the `module/controller/action/parameter1/value-of-parameter1/parameter2/value-of-parameter2`. For example ,if the pathname is `admin/group/detail`, the results of identification is:

* module is `admin`
* controller is `group`
* action is `detail`, the corresponding method is `detailAction`

If the project does't have `admin` or the module is disabled, then the results of identification is:

* module is the default module `home`
* controller is `admin`
* action is `group`，the corresponding method is  `groupAction`
* parameter is `{detail: ''}`

#### Case Transformation

After route identification, `module`, `controller` and the `action` value will automatically convert to lowercase. If there are `_` in the Action value, it will do some transformation, for example the value of Controller is `index` after identification, the Action value is `user_add`, then the corresponding Action method called `userAddAction`, but the template name is still `index_user_add.html`.

### The Default Route

Once there is no corresponding value when parsing the pathname, the default values are used. The module's default value is `home`, the controller's default value is `index`, and the action's default value is `index`.

These values can be modified through the following configuration, in the configuration file `src/common/config/config.js`:

```js
export default {
  default_module: 'home',
  default_controller: 'index', 
  default_action: 'index',
}
```

### Custom Route

Although the default route looks clear, it's also simple to parse, but looks not enough concise.

Sometimes we need more compact routes scheme, in this case we need to use a custom route. Such as the detail page of an article, the default route might be `article/detail/id/10`, but the URL we wanted is `article/10`.

##### Enable The Custom Configuration

To enable the custom route, open `src/common/config/config.js`, and set `route_on` as `true`.

```js
export default {
  route_on: true
}
```

##### Route Rules

After enabling the custom route, the next thing is to define the route rules in the route configuration file `src/common/config/route.js`, the format are as following:

```js
export default [
  ["rule1", "the-pathname-you-wanted-to-be-identified-to"],
  ["rule2", {
    get: "the-pathname-you-wanted-to-be-identified-to-when-GET",
    post: "the-pathname-you-wanted-to-be-identified-to-when-POST"
  }]
];
```

`Note`: Each rule is an array.(The reason why we do not use object literal is regular expressions cannot be used as object's key. )

##### Identify Order

The match rule of custom route is : matching one by one from the front to end, if hit one rule, it will not match forward.

-------

ThinkJS supports three types of custom route: regular route, rules route and static route.

#### Regular Route

Regular route useing regular expressions to define routes, relying on the powerful regular expression, it can define very flexible route rules.

```js
export default [
  [/^article\/(\d+)$/, "home/article/detail?id=:1"]
];
```

The above regular expression will match pathname like `article/10`, the resolved pathname will be `home/article/detail`, and the value of parameter id then can obtain through `this.get` method in the controller.

```js
export default class extends think.controller.base {
  detailAction(){
    let id = this.get('id');
  }
}
```

If regular route contains multiple child catch groups, then can obtain the corresponding values by`:1`,`:2`,`:3`: 

```js
export default [
  [/^article\/(\d+)$/, {
    get: "home/article/detail?id=:1",
    delete: "home/article/delete?id=:1",
    post: "home/article/save?id=:1"
  }]
];
```


#### Rules Route

Rules route is a way of string matching, but supports some dynamic values. Such as:

```js
export default [
  ['group/:year/:month', "home/group/list"]
]
```

If URL is `http://www.example.com/group/2015/10`, then it will hit the rule, the pathname we get will be `home/group/list`, at the same time, it will add two parameters `year` and `month`, and they can be gotten through `this.get` method in the controller.

```js
export default class extends think.controller.base {
  listAction(){
    let year = this.get('year');
    let month = this.get('month');
  }
}
```

#### Static Route

Static route is a way of pure string exactly match, its writing and identification are very simple, of course the function is relatively weaker.

```js
export default [
  ["list", "home/article/list"]
]
```

If the URL is `http://www.example.com/list`, then the pathname is replaced with `home/article/list`.

#### Optimizing The Route Performance

Above has said that the custom route is an array, each item of the array is a specific route rule, 
and it matches one by one from the front to end when matching. If the route table is large, there may be a performance issue.

In order to avoid performance issues, ThinkJS provides a more efficient way to custom route, configuring route according to the module. This way, the route configuration format is slightly different from the above.

##### common/config/route.js

This time, the route configuration in general module no longer define specific route rules, but configures which rules hit which module. Such as:

```js
export default {
  admin: { 
    reg: /^admin/ // hit admin module
  },
  home: { // home module as default
    
  }
}
```

##### admin/config/route.js

The admin module configures specific route rules belongs it.

```js
export default [
  [/^admin\/(?!api).*$/, 'admin/index'],
  [/^admin\/api\/(\w+?)(?:\/([\d,]*))?$/, 'admin/:1?id=:2&resource=:1'],
];
```

------

Assuming the URL is `http://www.example.com/admin/api`, then the parsed pathname is `admin/api`, it will hit the `admin` module when matching the rules in the `common`, and then match the route rules one by one under the `admin` module. This way, it can greatly reduce the number of route rules need to match every time, makes route more efficient.