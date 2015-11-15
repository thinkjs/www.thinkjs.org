## rest controller

`think.controller.rest` instance of [think.controller.base](./api_controller.html), used for handle Rest api.

##### Instance of this class with ES6

```js
export default class extends think.controller.rest {
  
}
```

##### Using normal way to instance this class

```js
module.exports = think.controller('rest', {
  
})
```

### Method

#### controller._isRest

Identify this controller is Rest api. if in `init` function, it assigned to `false`, and this controller is not a Rest interface no more.

#### controller._method

The way to get method, by default read from http method, but some client don't support send some request type like DELETE, PUT, so it can set to get from GET parameter.

```js
export default class extends think.controller.rest {
  init(http){
    super.init(http);
    // set _method, means get _method field value from GET parameters
    // if is null, it will get from http method
    this._method = '_method';
  }
}
```

#### controller.resource

The Resource name of current Rest

#### controller.id

Resource ID

#### controller.modelInstance

The instance model of resource.


### Function

#### controller.__before()

It can do some operate like filter field, pagination, access control in magic function `__before`.

```js
export default class extends think.controller.rest{
  __before(){
    // filter password field
    this.modelInstance.field('password', true);
  }
}
```

#### controller.getAction()

Get resource data, if id exist, then get one, or get the list.

```js
// function implementation, it can been modified if need.
export default class extends think.controller.rest {
  * getAction(){
    let data;
    if (this.id) {
      let pk = yield this.modelInstance.getPk();
      data = yield this.modelInstance.where({[pk]: this.id}).find();
      return this.success(data);
    }
    data = yield this.modelInstance.select();
    return this.success(data);
  }
}
```

#### controller.postAction()

Add data.

```js
// function implementation, it can been modified if need.
export default class extends think.controller.rest {
  * postAction(){
    let pk = yield this.modelInstance.getPk();
    let data = this.post();
    delete data[pk];
    if(think.isEmpty(data)){
      return this.fail('data is empty');
    }
    let insertId = yield this.modelInstance.add(data);
    return this.success({id: insertId});
  }
}
```

#### controller.deleteAction()

Delete data.

```js
// function implementaion, it can been modified if need.
export default class extends think.controller.rest {
  * deleteAction(){
    if (!this.id) {
      return this.fail('params error');
    }
    let pk = yield this.modelInstance.getPk();
    let rows = yield this.modelInstance.where({[pk]: this.id}).delete();
    return this.success({affectedRows: rows});
  }
}
```

#### controller.putAction()

Update data.

```js
// function implementaion, it can been modified if need.
export default class extends think.controller.rest {
  * putAction(){
    if (!this.id) {
      return this.fail('params error');
    }
    let pk = yield this.modelInstance.getPk();
    let data = this.post();
    delete data[pk];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    let rows = yield this.modelInstance.where({[pk]: this.id}).update(data);
    return this.success({affectedRows: rows});
  }
}
```

#### controller.__call()

Invoked when cannot find function

```js
export default class extends think.controller.rest {
  __call(){
    return this.fail(think.locale('ACTION_INVALID', this.http.action, this.http.url));
  }
}
```
