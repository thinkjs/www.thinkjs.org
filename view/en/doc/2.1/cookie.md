## Cookie

### Get Cookie

In controller or logic, you can get cookie by use `this.cookie`. eg.

```js
export default class extends think.controller.base {
  indexAction(){
    let cookie = this.cookie('theme'); //get the cookie 'theme'
  }
}
```

Http object also provides the method `cookie` to get cookie. eg.

```js
let cookie = http.cookie('theme');
```

### Cookie Config

The cookie default config is as follows.

```js
export default {
  domain: '', 
  path: '/',
  httponly: false, // whether http only
  secure: false,
  timeout: 0  // valid time, 0-browser process, unit is second
};
```

The default cookie is invalid along with the closing of browser process, and you can modify it in the config file `src/common/config/cookie.js`. eg.


```js
export default {
  timeout: 7 * 24 * 3600  //set cookie valid time to 7 days
};
```


### Set Cookie

In controller or logic, you can set cookie by use `this.cookie`. eg.

```js
export default class extends think.controller.base {
  indexAction(){
    this.cookie('theme', 'default'); //set cookie theme to default
  }
}
```

Http object also provides the method `cookie` to set cookie. eg.

```js
http.cookie('theme', 'default');
```

If you want to change some params when setting cookie, you can use these three params like the followings.

```js
export default class extends think.controller.base {
  indexAction(){
    this.cookie('theme', 'default', {
      timeout: 7 * 24 * 3600 //set cookie valid time to 7 days
    });
  }
}
```
