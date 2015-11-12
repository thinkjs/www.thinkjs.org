## Session

- Supported session types
- How to configurate session
- How to read/write session
- How to extend session
- How to use third party Session Adapter

Session is always needed to user login. ThinkJS default to support a variety of session adapter, Such as `file`, `db`, `redis` and so on.

### Supported session types

`memory`  session stored in Memory

`file`  session stored in file system

`db` session stored in database 

`redis` session stored in redis

##### db Session

You need create a table in your database except MongoDB, if you want to use db session. You can use the following SQL statement to create:

```sql
  DROP TABLE IF EXISTS `think_session`;
  CREATE TABLE `think_session` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `cookie` varchar(255) NOT NULL DEFAULT '',
    `data` text,
    `expire` bigint(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cookie` (`cookie`),
    KEY `expire` (`expire`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

The prefix `think_` is the same as the database settings.

##### redis Session

The redis session needs to configurate redis, see [confirguration](./config.html#redis) for more details.

### How to configurate session

Session configuration is as follows, you can edit it in the file `src/common/config/session.js`:

```js
export default {
  type: 'file',
  name: 'thinkjs', // cookie name
  secret: '', // if the session cookie needs encrypt.
  timeout: 24 * 3600, // session expire time, defaults to one day
  cookie: { // cookie options
    length: 32
  },
  adapter: {
    file: {
      path: think.getPath('common', 'runtime') + '/session'
    }
  }
};
```

`Note`：The framework supports adaptor configurate from  version `2.0.6`.

This [configuration](./config.html#cookie) is about Cookie.

### How to read/write session

Controller or Logic can read/write session like :

##### Read Session

```js
export default class extends think.controller.base {
  * indexAction(){
    //get session
    let value = yield this.session('userInfo');
  }
}
```  

##### Set Session

```js
export default class extends think.controller.base {
  * indexAction(){
    //set session
    yield this.session('userInfo', data);
  }
}
```

##### Clear Session

```js
export default class extends think.controller.base {
  * indexAction(){
    //clear session of current user
    yield this.session();
  }
}
```

--------

`http.session` method of http object can read and write Session. See also [API -> http](./api_http.html#toc-b20) for more details.

### How to extend session

You can create a Session Adapter by using the command: 

``` 
`thinkjs adapter session/foo`
```

this command will create file `src/common/adapter/session/foo.js`, then you need impement these methods:

```js
export default class extends think.adapter.session {
  /**
   * init
   * @param  {Object} options []
   * @return {}         []
   */
  init(options){

  }
  /**
   * get Session 
   * @param  {String} name []
   * @return {Promise}      []
   */
  get(name){

  }
  /**
   * set Session
   * @param {String} name  []
   * @param {Mixed} value []
   */
  set(name, value){

  }
  /**
   * delete Session
   * @param  {String} name []
   * @return {Promise}      []
   */
  delete(name){

  }
  /**
   * update Session
   * @return {Promise} []
   */
  flush(){

  }
  /**
   * clear expired Session
   * @return {Promise} []
   */
  gc(){

  }
}
```

To know the implement of Session in ThinkJS, please see also <https://github.com/75team/thinkjs/tree/master/src/adapter/session>. 

##3 How to use third party session Adapter

To know how to use third party session Adapter, please see also [Adapter -> intro](./adapter_intro.html#toc-e7c)