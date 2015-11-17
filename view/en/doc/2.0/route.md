## Route

When a user visit a URL, eventually performing which module which controller which operation is decided by route after parsing.

ThinkJS provides a flexible route mechanism, in addition to the default resolution, it also support a variety forms of custom route, let the URL more simple and friendly.

### URL resolves to the pathname

When a user accesses to the service, the server first of all, will get a full URL, such as: visit this page and the URL is  `http://www.thinkjs.org/zh-CN/doc/2.0/route.html`.

The pathname resolved by URL is `/zh-CN/doc/2.0/route.html`.

### pathname filter

Sometimes in order to seo or some other reasons, the URL will be a few more things. For example, the current page is a dynamic page, but URL eventually adds `.html`, it’s more friendly to search engines. But these is useless in the subsequent route resolution, it needs to be removed.

ThinkJS offer the following configuration, it can remove the prefix and postfix content of `pathname`:

```js
export default {
  pathname_prefix: '', 
  pathname_suffix: '.html',
}
```

Above configuration can be modified in the `src/common/config/config.js`.

The pathname will automatically remove `/` around when filtering, the logic is not affected by the configuration above. After filtering the pathname, the clean pathname you get is `zh-CN/doc/2.0/route`.

`Note`: If you visit the URL, which is `http://www.thinkjs.org/`, then finally the clean pathname you get is an empty string.

### Subdomain deployment

When the project is complex, we may want to deploy different function under the different domain, but the code is still in a project. Such as: When the domain name `admin.exanple.com` deploys background management functions, we hope that it can map to the `admin` module.

ThinkJS provides the following configuration that it can undertake subdomain deployment, the configuration can be set in the `config/config.js`:

```js
export default {
  subdomain: {
    admin: 'admin', //表示将 admin.example.com 映射到 admin 模块下
    ...
  }
}
```

If the pathname is `group/detail` after filtering , hit the subdomain admin.example.com, the pathname become to the `admin/group/detail`.

### Routing identification

#### Routing resolves

Routing identification identify the filtered pathname default according to the `module/controller/action/parameter1/parameter value of 1/parameter2/parameter value of 2`. Such as: the pathname is `admin/group/detail`, so the results of identification is:

* module for `admin`
* controller for `group`
* action for `detail`,the corresponding method is called `detailAction`

If the project does’t have `admin` or the module is disabled, then the results of identification is:

* module for the default module `home`
* controller for `admin`
* action for `group`，the corresponding method is called `groupAction`
* Parameters for `{detail: ''}`

#### Transformation of case

After route identification, `module`、`controller`、and the `Action` value will automatically convert to lowercase. If there are `_` in the Action value, it will do some transformation, such as: in the case that the value of Controller is `index` after identification, the Action value is `user_add`, then the corresponding Action method called `userAddAction`, but the template name is still `index_user_add. html`.

### The default Route

Once there is no corresponding value when parsing the pathname, then using the corresponding default value. And module default value is `home`, controller default value is `index`, action default value is `index`.

These values can be modified through the following configuration, the configuration file `src/common/config/config.js`:

```js
export default {
  default_module: 'home',
  default_controller: 'index', 
  default_action: 'index',
}
```

### Custom route

Although the default route looks clear, it's also simple to parse, but looks not enough concise.

Sometimes we need more compact route, now we need to use a custom route to parse. Such as: the detail page of the article, the default route might be:  `article/detail/id/10`, but the URL we want is `article/10` this more concise way.

##### Open the configuration

Open the custom route, we need to open the configuration as the following in `src/common/config/config.js`.

```js
export default {
  route_on: true
}
```

##### Route rules

After opening the custom route, then we can define the exact route through route rules, route configuration file is: `src/common/config/route.js`, the format is as follows:

```js
export default [
  ["规则1", "需要识别成的pathname"],
  ["规则2", {
    get: "get请求下需要识别成的pathname",
    post: "post请求下需要识别成的pathname"
  }]
];
```

`Note`: Each rule of custom route is an array.(The reason why we do not use object is that regular cannot be used as the object's key directly under the regular route. )

##### Identify ways

The match rule of custom route is : matching one by one from the front to rear, if hit this rule, it will not match back.

-------

ThinkJS supports three types of custom route, they are : regular route, rules route and static route.

#### Regular route

Regular route is a way that uses regular expressions to define the route, relying on the powerful regular expression, it can define very flexible route rules.

```js
export default [
  [/^article\/(\d+)$/, "home/article/detail?id=:1"]
];
```

The above regular will match pathname like `article/10`, the new pathname identified is `home/article/detail`, and it will assign the value captured to the parameter id, then can obtain the value through `this.get` method in the controller.

```js
export default class extends think.controller.base {
  detailAction(){
    let id = this.get('id');
  }
}
```

If regular route contains multiple child groups, then can obtain the corresponding values by`:1`,`:2`,`:3` 

```js
export default [
  [/^article\/(\d+)$/, {
    get: "home/article/detail?id=:1",
    delete: "home/article/delete?id=:1",
    post: "home/article/save?id=:1"
  }]
];
```


#### Rules route

Rules route is a way of string matching, but supports some dynamic values. Such as:

```js
export default [
  ['group/:year/:month', "home/group/list"]
]
```

If the URL we visit is `http://www.example.com/group/2015/10`, then it will hit the rule, the pathname we get is `home/group/list`, at the same time, it will add two parameters `year` and `month`, these two parameters can be gotten through `this.get` method in the controller.

```js
export default class extends think.controller.base {
  listAction(){
    let year = this.get('year');
    let month = this.get('month');
  }
}
```

#### Static route

Static route is a way of pure string exactly match, its writing and identification are very simple, of course the function is relatively weaker.

```js
export default [
  ["list", "home/article/list"]
]
```

If the URL we visit is `http://www.example.com/list`, then the pathname replaced is the home/article/list`.

#### To optimize the route performance

Above has said that the custom route is an array, each item of the array is a specific route rule, 
and it matches one by one from the front to rear when matching. If the route table is large, there may be a performance issue.

In order to avoid performance issues, ThinkJS provides a more efficient way of custom route, configuring route according to the module. Using this way, the route configuration format is slightly different from the above.

##### common/config/route.js

After using this way, the route configuration in the general module configures specific route rules no longer, but configures which rules hit which module. Such as:

```js
export default {
  admin: { 
    reg: /^admin/ //命中 admin 模块的正则
  },
  home: { //默认走 home 模块
    
  }
}
```

##### admin/config/route.js

The admin module configures specific route rules under admin.

```js
export default [
  [/^admin\/(?!api).*$/, 'admin/index'],
  [/^admin\/api\/(\w+?)(?:\/([\d,]*))?$/, 'admin/:1?id=:2&resource=:1'],
];
```

------

Assuming that the URL visit is `http://www.example.com/admin/api`, then the pathname parsed is `admin/api`,  it will hit the `admin` module when matching the rules in the `common`, and then match the route rules one by one under the `admin` module. In this way, it can greatly reduce the number of route rules need to match, providing matching efficiency.