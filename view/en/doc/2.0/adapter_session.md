# Session

- Supported session types
- How to configurate session
- How to read/write session
- How to extend session
- How to use third party Session Adapter

Session is always needed to user login. ThinkJS default to support a variety of session adapter, Such as `file`, `db`, `redis` and so on.

## Supported session types

`base`  session stored in Memory

`file`  session stored in file system

`db` session stored in database 

`redis` session stored in redis

### db Session

You need create a table in your database except MongoDB, if you want to use db session. You can use the following SQL statement to create:

  DROP TABLE IF EXISTS `think_session`;

  CREATE TABLE `think_session` (

``` 
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`cookie` varchar(255) NOT NULL DEFAULT "",
`data` text,
`expire` bigint(11) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `cookie` (`cookie`),
KEY `expire` (`expire`)
```

  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

The prefix `think_` is the same as the database settings.

### redis Session

The redis session needs to configurate redis, see [confirguration](http://www.thinkjs.org) for more details.

## How to configurate session

Session configuration is as follows, you can edit it in the file `src/common/config/session.js`:

  export default {

``` 
type: "file",
name: "thinkjs", // the key name of cookie 
path: runtimePrefix + "/session",  // the path which the cache file put that file session uses.
secret: "", // specify if the cookie used by session needs encrypt.
timeout: 24 * 3600, // expire time , default is one day.
cookie: {     //  the cookie configuration which the session uses. 
  length: 32
}
```

  };

This [configuration](http://www.thinkjs.org) is about the Cookie.

## How to read/write session

Controller or Logic can read/write session like :

### Read Session

  export default class extends think.controller.base {

``` 
* indexAction(){
  //get session
  let value = yield this.session("userInfo");
}
```

  }

### Set Session

  export default class extends think.controller.base {

``` 
* indexAction(){
  //set session
  yield this.session("userInfo", data);
}
```

  }   

### Clear Session

  export default class extends think.controller.base {

``` 
* indexAction(){
  //clear session of current user
  yield this.session();
}
```

  }

`http.session` method of http object can read and write Session. See also [API -> http](http://www.thinkjs.org) for more details.

## How to extend session

You can create a Session Adapter by using the command: 

``` 
`thinkjs adapter session/foo`
```

this command will create file `src/common/adapter/session/foo.js`, then you need impement these methods:

  export default class extends think.adapter.session {

``` 
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
 * clear the expire Session
 * @return {Promise} []
 */
gc(){

}
```

  }



You can add, delete, update and search the cache by using method `think.cache`, see also [API -> think](http://www.thinkjs.org) for more details.

You can usemethod `this.cache` to operate cache, if your class is inherited from `think.http.base`, see also [API -> think.http.base](http://www.thinkjs.org) for more detail.

## How to extend cache

You can create a cache class named `foo` by using following command:

``` 
`thinkjs adapter cache/foo`
```

After the completion of the excuting, ThinkJS will create the file `src/common/adapter/cache/foo.js`. Then you need implement these following methods to extend cache class:

  export default class extends think.cache.base {

``` 
/**
 * Initialization method
 * @param  {Object} options []
 * @return {}         []
 */
init(options){
  //set gc type & start gc
  this.gcType = "cache_foo";
  think.gc(this);
}
/**
 * get cache
 * @param  {String} name []
 * @return {Promise}      []
 */
get(name){

}
/**
 * set cache
 * @param {String} name    []
 * @param {Mixed} value   []
 * @param {Number} timeout []
 * @return {Promise}
 */
set(name, value, timeout){

}
/**
 * delete cache
 * @param  {String} name []
 * @return {Promise}      []
 */
delete(name){

}
/**
 * garbage collection function of cache
 * @return {Promise} []
 */
gc(){

}
```

  }

To know the implement of Session in ThinkJS, please see also (https://github.com/75team/thinkjs/tree/master/src/adapter/session). 

## How to use third party session Adapter

To know how to use third party session Adapter, please see also [Adapter -> 介绍](http://www.thinkjs.org)
