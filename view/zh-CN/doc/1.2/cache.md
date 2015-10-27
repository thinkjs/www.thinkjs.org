## 缓存

在项目中，合理使用缓存对性能有很大的帮助。ThinkJS 提供了方便的缓存方式，包括：内存缓存、文件缓存、memcache 缓存等。同时提供了快捷的方法进行缓存的读取操作。

### 数据缓存

在 ThinkJS 中进行缓存的读取操作，一般情况下不要直接操作缓存类，系统提供了快捷函数 `S` 来进行操作。

#### 缓存配置

```js
// 缓存配置
cache_type: "File", // 数据缓存类型
cache_timeout: 6 * 3600, // 数据缓存有效期，单位: 秒
cache_path: CACHE_PATH,  // 缓存路径设置 (File 缓存方式有效)
cache_file_suffix: ".json", //File 缓存方式下文件后缀名
cache_gc_hour: [4], // 缓存清除的时间点，数据为小时
```

#### 缓存类型

##### 内存缓存

使用 Node.js 的内存来缓存，如果使用 cluster 最好不要使用该方式。

```
cache_type: "", //cache_type 为空
```

##### 文件缓存

基于文件的缓存

```
cache_type: "File", //cache_type 为 File
```

##### Memcache 缓存

使用 Memache 来缓存

```
cache_type: 'Memcache', //cache_type 为 Memcache
```

使用 Memache 来缓存需要追加如下的配置：

```js
//memcache 缓存
memcache_host: "127.0.0.1", //memcache host
memcache_port: 11211, //memecache 端口
```

##### Redis 缓存

使用 Redis 来缓存

```
cache_type: 'Redis', //cache_type 为 Redis
```

使用 Redis 来缓存需要追加如下的配置：

```js
//redis 缓存
redis_host: "127.0.0.1", //redis host
redis_port: 6379, //redis 端口
```

#### 缓存读写

```js
// 写入缓存
S("name", "welefen"); // 返回一个 promise
// 读取缓存
S("name").then(function(value){
    //value 为获取到的缓存值
});
// 删除缓存
S("name", null); 
// 缓存写入时改变缓存类型和缓存时间
S("name", "value", {
    type: "memcache",
    timeout: 100 * 10000
});
// 修改缓存类型来获取缓存值
S("name", undefined, {type: "memcache"}).then(function(value){

})
```

缓存的读、写、删都是异步操作，都是返回一个 promise。后续的操作如果有依赖，必须在 promise then 里执行。

### 文件快速缓存

如果有些数据不会过期，只会被新的数据覆盖。那么使用 `S` 函数就不太合适了，系统提供一种不会过期的数据快速存取方法。

可以通过函数 `F` 来对文件内容进行快速的读取和写入操作。文件快速写入和读取的根目录为 `App/Runtime/Data/`

```js
// 数据快速写入
F("name", {value: "xxx"}); // 写入的文件为 App/Runtime/Data/name.json
// 数据读取
var value = F("name");
// 重新指定数据写入的根目录
F("name", {value: "xxx"}, "/tmp/data"); // 写入的文件为 /tmp/data/name.json
// 数据读取
var value = F("name", undefined, "/tmp/data"); 
```

文件快速缓存的读、写操作都是同步的。

### 数据库查询缓存

对于及时性要求不高的数据查询，可以使用查询缓存来提高性能。系统里提供了 `cache` 方法来对查询数据缓存，无需自己使用缓存方法进行缓存和读取。

数据库查询缓存有如下的配置：

```js
{
    // 数据库查询缓存配置
    db_cache_on: true, // 是否启用查询缓存，如果关闭那么 cache 方法则无效
    db_cache_type: "", // 缓存类型，默认为内存缓存
    db_cache_path: CACHE_PATH + "/db", // 缓存路径，File 类型下有效
    db_cache_timeout: 3600, // 缓存时间，默认为 1 个小时
}
```

```js
// 查询 score>100 的数据
D('User').cache(true).where({score: ['>', 100]}).select().then(function(data){  // 开启查询缓存后，如果有缓存则直接读取缓存，不再从数据库查询
})
```

如果使用了 `cache(true)`，则在查询的时候会根据当前拼装的 sql 生成 md5 值作为缓存 key。也可以手工指定缓存 key，如：

```js
D('User').cache('cache_name').select().then(function(data){
    //data
})
```

也可以指定单条查询的的缓存时间，如：

```js
// 手工将缓存时间修改为 3 个小时
D('User').cache(3 * 3600).select().then(function(){

});
// 手工指定缓存 key 并修改缓存时间
D('User').cache('cache_name', 3 * 3600).select().then(function(){

});
```

如果指定了缓存 key，那么在外部可以通过 `S` 函数来读取缓存，如：
```js
// 如果缓存类型和通用的缓存类型不同，那么这里需要带上缓存类型进行读取
S('cache_name').then(function(data){})
```

### 页面静态化

对于项目中的有些数据，如：文章详细页，这些数据一旦生成后就不怎么修改了。为了更快的提高文章详细页的访问速度，可以将文章详细页面整个缓存起来，下次访问的时候如果还在缓存时间内，那么直接读取静态 html 返回即可。

这种方式下不用执行控制器、数据库查询、模版渲染等操作了，可以大大提高访问的性能。

<div class="alert alert-warning">
    如果页面中显示用登录信息，这种方式就不太适合了，除非用户登录信息通过异步接口来获取。
</div>

要使用页面静态化的功能，需要开启配置 `html_cache_on`，并且配置 `html_cache_rules` 规则来控制哪些请求才启动页面静态化的功能。

#### 详细配置

页面静态化缓存只能使用文件缓存的方式，详细的配置如下:

```js
// 页面静态化配置
html_cache_on: false, //HTML 静态缓存
html_cache_timeout: 3600, // 缓存时间，单位为秒
html_cache_rules: {}, // 缓存详细的规则
html_cache_path: CACHE_PATH + "/html", // 缓存目录
html_cache_file_callback: undefined, // 由缓存 key 生成具体的缓存文件的回调函数
html_cache_file_suffix: ".html", // 缓存文件后缀名
```

缓存的规则如下：

```js
// 缓存规则
"html_cache_rules": {"静态地址": ["静态规则", "缓存时间", "生成缓存文件的回调函数"],
    "静态地址": "静态规则"
}
```

#### 静态地址

静态地址是用来匹配当前的路由规则，匹配的静态地址列表为：

```js
// 静态地址匹配列表
var list = [
    group + ":" + controller + ":" + action,
    controller + ":" + action,
    action,
    "*"
];
```

如果这时候访问的 url 为 `group/detail?id=10`，识别到的分组为 `home`, 控制器为 `group`，操作为 `detail`，那么静态地址可以配置为 `home:group:detail`，这样就命中了当前的请求。

当前也可以配置更泛的规则来匹配。

#### 静态规则

静态地址是命中一组类似的请求，如果这组类似的请求生成的缓存文件是一样的，那肯定不行。

可以通过静态规则来区别不同的请求，静态规则里可以获取当前请求的动态数据。如：

```js
// 静态规则
// 动态获取参数 id 的值
"home:group:detail": "home_group_detail_{id}"
```

可以获取的动态数据有：

* `{key}` 获取参数 key 的值，如：`{id}`, `{page}`
* `{:group}` 获取分组
* `{:controller}` 获取控制器
* `{:action}` 获取操作
* `{cookie.key}` 获取 cookie 下 key 的值，如：`{cookie.skin}`

通过这些动态数据就可以将每个不同的请求都区分开来。

#### 缓存文件回调函数

静态规则一般都是一个较长的字符串，如果直接拿这个字符串当文件名去生成缓存文件，可以导致缓存目录下的文件数过多。这时候我们可能希望建立一些子目录来放这些缓存文件，通过回调函数可以确立详细的缓存文件存在路径。

默认的缓存文件存放路径对应的函数为：

```js
// 生成缓存文件的函数
var getCacheFilename = function(key){var value = md5(key);
    // 这里生成一级子目录
    return value[0] + "/" + value;
}
```

如果想重新定义生成缓存文件的函数，可以修改配置 `html_cache_file_callback`， 如：

```js
{
    "html_cache_file_callback": function(key, http){
        var value = md5(key);
        // 生成二级子目录
        return value[0] + "/" + value[1] + "/" + value;
    }
}
```

也可以修改某个特定的静态规则下的回调函数，直接配置规则里第二个参数即可。