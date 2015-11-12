# Cache

- Cache types
- How to configurate cache
- How to use cache
- How to extend cache
- How to use third party cache Adapter

It is very helpful to use caches proper correctly in projects. So, ThinkJS provide a variety of caching methods,includes: Memory cache, file cache, Memcache and redis. 

## Cache types

The framework defaults to support the following cache typies:

`base`  Cache stored in Memory

`file`  Cache stored in file system

`memcache` Cache stored in memcache 

`redis` Cache stored in redis

If you use Memcache or redis, you need set configuration information. 

See also [configuration of memcache](http://www.thinkjs.org) [configuration of redis](http://www.thinkjs.org)

## How to configurate cache

The default cache configuration likes following. You can edit `src/common/config/cache.js` to change the configration.

``` 
export default {
  type: "file", // the cache type
  timeout: 6 * 3600, // when the cache will expired , default is 6 hours.
  prefix: "thinkjs_",
  path: runtimePrefix + "/cache",
  path_depth: 2,
  file_ext: ".json"
};
```

In memcache or redis cache type, the `prefix` field is used. In this case, ThinkJS uses key + prefix as the storage key to prevent the conflict with other projects. If you don't want to set prefix, you can set it to empty string, like:

``` 
export default {
  prefix: "" // it set the prefix of cache key to empty.
}
```

## How to use cache

You can add, delete, update and search the cache by using method `think.cache`, see also [API -> think](http://www.thinkjs.org) for more details.

You can usemethod `this.cache` to operate cache, if your class is inherited from `think.http.base`, see also [API -> think.http.base](http://www.thinkjs.org) for more details.

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

To know the implemation of cache in ThinkJS, please see also (https://github.com/75team/thinkjs/tree/master/src/adapter/cache)

## How to use third party cache Adapter

To know how to use third party cache Adapter, please see also [Adapter -> 介绍](http://www.thinkjs.org)
