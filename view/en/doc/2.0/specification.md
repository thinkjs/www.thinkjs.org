## Specification

### Lowercase file path

You always deploy project in Linux system, althought it's developed in Windows or Mac OSX.

It's case insenstive in Windows and Mac, but Linux is senstive. so it's very easy to take problem in online.

To avoid this happened, it's a good advise taht all file path defined with lowercase word. By the way, ThinkJS will scan your project file after service start successfully. If you has uppercase name it will return warning such as:

```text
[2015-10-13 10:36:59] [WARNING] filepath `admin/controller/apiBase.js` has uppercases.
```
### Indent with 2 space 

It often has complicated logic such as if-else or async action to add your code's indent in Node.js. It's advise to take 2 space as your indentation to prievent indentation too long.

### Use ES6 grammer

ES6 has lots of new feature that can make our code simple and effective. It has support parts of ES6 feature in lastest Node.js. You can use Babel compile your program to support all features.

### Do not use contructor method

If you use `class` to instance class in ES6, you can use `contructor` method to make something auto run when it's instanced. For example:

```js
export default class think.base {
  constructor(){
    ...
  }
}
```

That means no `class` no `constructor`. ThinkJS take `init` method replace to `constructor`. It take a promise that all it will be run no mather in `class` or dynamic create class.

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

tips: all ThinkJS class will extend the base class `think.base`.

### Compile by Babel

Most but not all ES6 features was supported in lastest Node.js, and there also has optmization in some feature. We advise you that compile your project with Babel. Babel can take almost all ES6+  features and higher performance after compiled to you.

### Replace */yield with async/await

`*/yield` is ES6 feature to resolve async callback action, and ES7 replace it with `async/await`.

Compare with `async/await`, there has 4 defects in `*/yield`:

1. `*/yield` will return a generator after called and will use third module such as `co` to run it.

2. `*/yield` cann't use with `Arrow Function` together.

3. when `*/yield` need call another `*/yield`, we need use `yield *` command

4. It has large optmiztation space to V8 engineer, so we would commiled our code to Babel. With Babel, you can use ES7 `async/await` features replace to `*/yield`, and then compiled program.