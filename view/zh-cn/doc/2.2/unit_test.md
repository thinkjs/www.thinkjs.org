## 单元测试

项目中写一些接口时有时候希望进行单元测试，ThinkJS 从 2.1.4 版本开始创建项目时支持创建单元测试相关的目录。

### 创建单元测试项目

创建项目时带上 `--test` 参数后就会创建测试相关的目录，如：

```sh
thinkjs new demo --es --test
```

创建完成后，项目下会有 `test/` 目录，该目录有单元测试的示例代码，自己写的单元测试代码也也都放在该目录下。

`注`：如果 ThinkJS 版本低于 `2.1.4`，需要先将全局的 ThinkJS 升级。

### 测试框架

默认使用的测试框架是 `mocha`，代码覆盖率框架为 `istanbul`。

### 加载 thinkjs

测试项目里的代码，有些代码依赖了 `think` 这个全局对象，那么这时就要引入 thinkjs，可以通过下面的方式引入：

```js
var instance = new require('thinkjs');
instance.load();
```

### 书写单元测试

可以用 `describe` 和 `it` 的方式来书写测试代码，如：

```js
var assert = require('assert');
describe('unit test', function(){
  it('test controller', function(){
    var data = getFromFn();
    assert.equal(data, 1); //测试 data 是否等于 1，不等于则会测试失败
  })
})
```

有些接口是异步的，mocha 提供了一个参数来完成，如：

```js
var assert = require('assert');
describe('unit test', function(){
  it('test controller', function(done){
    getFromFn().then(function(data){
      assert.equal(data, 1); //测试 data 是否等于 1，不等于则会测试失败
      done(); //这里必须执行下 done，告知接口已经拿到数据并校验
    })
  })
})
```

更多的测试用户请参考生成的文件 `test/index.js`，也可以参考 ThinkJS 框架的测试用例 <https://github.com/75team/thinkjs/tree/master/test>。

### 执行单元测试

单元测试写完后，执行 `npm test` 就可以进行单元测试。如果代码需要编译，可以在另一个标签页面里执行 `npm start`，这样代码改变后就会自动编译。


### 老项目支持

如果是之前创建的项目，那么通过下面的方式来支持单元测试：

* 拷贝 <https://github.com/75team/thinkjs/blob/master/template/test/index.js> 内容到 `test/index.js` 文件下
* 修改 `package.json` 文件，添加：在 `devDependencies` 里添加：

```js
{
  "devDependencies": {
    "mocha": "1.20.1",
    "istanbul": "0.4.0"
  }
}
```

