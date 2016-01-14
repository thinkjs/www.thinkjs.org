## Specification

###  File Path Must Be Lowercased

Generally, ThinkJS projects would be deployed in Linux environment, although they are developed in Windows or Mac OSX environment.

In Windows and Mac, file paths are not case-sensitive, but in Linux they are case-sensitive. This may result in errors after deployed projects online.

To avoid this happen, it's recommended that all file paths use lowercase. This way, ThinkJS will scan your project paths after service started, and return warning messages like this if it found uppercase paths:

```text
[2015-10-13 10:36:59] [WARNING] filepath `admin/controller/apiBase.js` has uppercases.
```
### Indent Two Spaces

Sometimes, complicated logic will result in multi-levels indent in Node.js. We advice each line intent two spaces to prevent indent too deep.

### Use ES6 Grammars

ES6 has lots of new features that can make our code simple and effective. Node.js has supported much of ES6 features in the latest version. You can use Babel compile your code to support all features.

### Do Not Use constructor Method

If you use ES6's `class`, the `constructor` method can be used to make something auto run when it's instantiated. For example:

```js
export default class think.base {
  constructor(){
    ...
  }
}
```

But if you are not using ES6's `class` grammar, you should not use `constructor` method.

ThinkJS provide `init` method to replace `constructor`. It will called automatically whether you using `class` or not.

```js
export default class think.base {
  /**
   * Initial method, called when class instanced
   * @return {} []
   */
  init(){
    ...
  }
}
```

Tips: All ThinkJS class will extend the base class `think.base`.

### Compile by Babel

The latest version of Node.js has supported most of ES6 features, but some of these features (e.g. `*/yield`) have not optimized in V8. 

We advise you to compile your project code with Babel. Babel can identify almost all ES6 and ES7 grammar, and the performance of compiled code is higher than native-supporting.

### Replace `*/yield` with `async/await`

`*/yield` is an ES6 feature to resolve async callback issue, and ES7 replace it with `async/await`.

Compared to `async/await`, `*/yield` has four shortcomings:

1. `*/yield` return a generator that need a third module such as `co` to run.

2. `*/yield` can't use with `Arrow Function` together.

3. When one `*/yield` need call another `*/yield`, we need use `yield *` command

4. V8 has not made optimazition for `*/yield`, so we recommend you to use Babel. With Babel, you can use ES7 `async/await` to replace `*/yield`.
