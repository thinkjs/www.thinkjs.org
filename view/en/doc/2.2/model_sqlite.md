## SQLite

ThinkJS supports SQLite database, underlying uses [sqlite3](https://www.npmjs.com/package/sqlite3) module.

### Config

Change `type` property to `sqlite` to use SQLite. Modify `src/common/config/db.js`:

```js
export default {
  type: "sqlite"
}
```

### Store Type

SQLite supports two ways to store data: memory and file, config `path` to `true` to use memory store:

#### Memory

```js
export default {
  type: "sqlite",
  adapter: {
    sqlite: {
      path: true, // use memory to store data
    }
  }
}
```

#### File

Use file need to set the path of SQLite data, default is `src/common/runtime/sqlite`.

```js
export default {
  type: "sqlite",
  adapter: {
    sqlite: {
      path: "/path/to/store/sqlite" //use file to store data
    }
  }
}
```

The path of data file is `path` + `/[name].sqlite`, default database `demo`'s file path is `src/common/runtime/sqlite/demo.sqlite`.

### CRUD Operations

CRUD operations are same as MySql, just read [Model -> Introduction](model_intro.html#toc-d84).
