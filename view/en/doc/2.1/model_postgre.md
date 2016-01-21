## PostgreSQL

ThinkJS support `PostgreSQL` by using [pq](https://www.npmjs.com/package/pg) module.

### Configuration

If you want to use PostgreSQL, you should change modle `type` to `postgre` by modify `src/common/config/db.js`:

```js
export default {
  type: 'postgre',
  adapter: {
    postgre: {
        
    }
  }
}
```

### CURD handler

PostgreSQL has same API with MySQL, you can know more in [Model -> Description](./model_intro.html#toc-d84)。
