## REST APIs

In projects, we often need to provide APIs for third party to call. A common API design specification is using REST API, which uses HTTP request type to identify resource operation.

* `GET` `/ticket` # get ticket list
* `GET` `/ticket/12` # view the specific ticket
* `POST` `/ticket`  # new a ticket
* `PUT` `/ticket/12` # update ticket 12
* `DELETE` `/ticket/12` # delete ticket 12

ThinkJS provides a very convenient way to create REST API. After created, it can response REST API process without writing any code, and it can also response additional demand by customization.

### Create REST APIs

Use `thinkjs controller [name] --rest` to create REST API. eg.

```js
thinkjs controller home/ticket --rest
```

The above command means that a Rest Controller named `ticket` is created in `home` module. And this Controller is used to handle the request for resource `ticket`.

### Process REST API Requests

After Rest Controller created, you can complete REST API process without writing any code. Resource name and data table name is one-to-one. eg. resource name is `ticket`, then the data table name is `data-table-prefix` + `ticket`.

### Request Type

REST API gets the current request type from HTTP METHOD by default. eg.the current request type is `DELETE`, which means to delete the resource.

If some clients do not support sending `DELETE` request, you can set the property  `_method` to receive request type. eg.

```js
export default class extends think.controller.rest {
  init(http){
    super.init(http);
    this._method = '_method'; //specify to get request type from _method in GET params
  }
}
```

### Field Filter

By default, all fields of resource are all returned when accessing it. Sometimes we need to hide part of fields, and we can complete such operations in magic method `__before`.

```js
export default class extends think.controller.rest {
  __before(){
    this.modelInstance.fieldReverse('password,score'); //hide password and score fields
  }
}
```

### Authority Management

Some REST APIs require authentication. Only after passing the validation can it obtain the corresponding information. The validation can be carried out in the magic method `__before`.

```js
export default class extends think.controller.rest {
  async __before(){
    let auth = await this.checkAuth();
    if(!auth){
      return this.fail('no permissions'); // return directly when no permission
    }
  }
}
```

### More Customization

See [API -> controller.rest](./api_controller_rest.html) for more customization ways.
