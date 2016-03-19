## middleware

The `think.middleware.base` class inherit from [think.http.base](./api_think_http_base.html)。

### Inheritence with ES6:

```js
export default class extends think.middleware.base {
  run(){

  }
}
```

### Dynamic Creating Class

```js
module.exports = think.middleware({
  run: function(){

  }
})
```

### Methods

#### middleare.run()

* `return` {Promise}

middleware exported entrance, invoke this function when calling middleware.
