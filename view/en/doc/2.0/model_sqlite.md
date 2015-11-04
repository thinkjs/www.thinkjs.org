## SQLite

ThinkJS 中支持使用 SQLite 数据库，底层使用 [sqlite3](https://www.npmjs.com/package/sqlite3) 模块。

### 配置

使用 SQLite，需要将模型中的配置 `type` 改为 `sqlite`，修改配置文件 `src/common/config/db.js`：

```js
export default {
  type: 'sqlite'
}
```

### 存储方式

SQLite 支持使用内存或者文件 2 种方式来存放数据，需要设置配置 `path`。

#### 内存方式

```js
export default {
  type: 'sqlite',
  path: true, //使用内存来存储数据
}
```

#### 文件方式

文件方式需要设置存储 SQLite 数据的目录，默认为 `src/common/runtime/sqlite`。

```js
export default {
  type: 'sqlite',
  path: '/path/to/store/sqlite' //设置存储数据文件的目录
}
```

对应的数据表文件路径为 `path` + `/[name].sqlite`，默认情况下数据库 `demo` 对应的文件路径为 `src/common/runtime/sqlite/demo.sqlite`。

### CURD 操作

CURD 操作和 Mysql 相同，具体请见 [模型 -> 介绍](./model_intro.html#toc-d84)。
