## More Features

### How Encapsulating callback to Promise

Many interfaces Node.js provided are in callback style, and many third party interfaces also do the same. The interfaces provided by ThinkJS are in Promise style instead. So you need encapsulating interfaces in callback style to the ones in Promise style.

Using ThinkJS provided `think.promisify` method can quickly encapsulate interface as Promise, more detail please see [here](http://127.0.0.1:7777/en/doc/2.0/api_think.html#toc-c09).

### Tasks Queue 

Asynchronous I/O is one of the main advantages of Node.js, it make parallel processing very easy, for example we can parallelly process multiple files. But OS generally limit the number of opened files, otherwise will result in errors.


In this case, we can resort to tasks queue, and ThinkJS also provide the `think.parallelLimit` method to help us to handle this. More detail please see [here](http://127.0.0.1:7777/en/doc/2.0/api_think.html#toc-bb7).


