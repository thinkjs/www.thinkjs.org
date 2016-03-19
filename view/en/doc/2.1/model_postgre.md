## PostgreSQL

ThinkJS supports `PostgreSQL` by using [pg](https://www.npmjs.com/package/pg) module in underlayer.

### Configuration

If you want to use PostgreSQL, you should change modle `type` to `postgresql` by modify `src/common/config/db.js`:

```js
export default {
  type: 'postgresql',
  adapter: {
    postgresql: {
        
    }
  }
}
```

### CURD handler

PostgreSQL has same APIs with MySQL, you can know more in [Model -> Description](./model_intro.html#toc-d84)。
