## middleware

`think.middleware.base` instance of [think.http.base](./api_think_http_base.html)。

##### ES6 way

```js
export default class extends think.middleware.base {
  run(){

  }
}
```

##### Create class dynamically

```js
module.exports = think.middleware({
  run: function(){

  }
})
```

### Function

#### middleare.run()

* `return` {Promise}

middleware exported entrance, invoke this function when calling middleware.
