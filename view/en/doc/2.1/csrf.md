## CSRF

ThinkJS provides a middleware to handle CSRF. It's off in the default configure.

### CSRF On

Modify `src/common/config/hook.js` like this:

```js
export default {
  logic_before: ['prepend', 'csrf']
}
```

### Configure

The default configure of CSRF is linke following, you can modify thme in `src/common/config/csrf.js`:

```js
export default {
  session_name: '__CSRF__', // Token value saved in session
  form_name: '__CSRF__', // CSRF key name, we can get value by this key and check the value
  errno: 400, //error number
  errmsg: 'token error' // error message
};
```
