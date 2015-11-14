## SQLite

- Config
- Store Type
  - Memory
  - File
- CURD Operation

ThinkJS supports SQLite database, underline uses [sqlite3](https://www.npmjs.com/package/sqlite3) module.

### Config

Change `type` property to `sqlite` to use SQLite. Modify `src/common/config/db.js`:

```js
export default {
  type: "sqlite"
}
```

### Store Type

SQLite supports store data in memory and file, you need to config `path`.

#### Memory

```js
export default {
  type: "sqlite",
  path: true, //use memory to store data
}
```

#### File

Use file need to set the path of SQLite data, default is `src/common/runtime/sqlite`.

```js
export default {
  type: "sqlite",
  path: "/path/to/store/sqlite" //use file to store data
}
```

The path of data file is `path` + `/[name].sqlite`, default database `demo`'s file path is `src/common/runtime/sqlite/demo.sqlite`.

### CURD Operation

CURD operation is same as Mysql, just read [Model -> Introduction](https://thinkjs.org/zh-CN/doc/2.0/model_intro.html#toc-d84).

This doc stays at [https://github.com/75team/www.thinkjs.org/tree/master/view/zh-CN/doc/2.0/model_sqlite.md](https://github.com/75team/www.thinkjs.org/tree/master/view/zh-CN/doc/2.0/model_sqlite.md).