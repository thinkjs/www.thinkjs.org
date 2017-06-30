## Logic

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作；当参数校验完成后，有时候还要进行权限判断等，这些都判断无误后才能进行真正的逻辑处理。如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。

为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，系统在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

### Logic 层

Logic 目录在 `src/[module]/logic`，在通过命令 `thinkjs controller [name]` 创建 Controller 时会自动创建对应的 Logic。

Logic 代码类似如下：

```js
/**
 * logic
 * @param  {} []
 * @return {}     []
*/
module.exports = class extends think.Logic {
 __before() {
    // todo
 }
 indexAction() {
    // todo
 }
 __after() {
    // todo
 }
}
```

注：若自己手工创建时，Logic文件名和Controller文件名相同

其中，Logic 里的 Action 和 Controller 里的 Action 一一对应。Logic 里也支持 `__before` 和 `__after` 魔术方法。

#### 请求类型校验

对应一个特定的 Action，有时候需要限定为某些请求类型，其他类型的请求给拒绝掉。可以通过配置特定的请求类型来完成对请求的过滤。

```js
module.exports = class extends think.Logic {
 indexAction() {
    this.allowMethods = 'post'; //  只允许 POST 请求类型
 }
 detailAction() {
    this.allowMethods = 'get,post'; // 允许 GET、POST 请求类型
 }
}
```

#### 校验规则格式

数据校验的配置格式为 `字段名` : `JSON 配置对象` ，如下：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        default: 'thinkjs', // 字段默认值为 'thinkjs'
        trim: true,         // 字段需要trim处理
        method: 'GET'       // 指定获取数据的方式
      },
      age: {
        int: {min: 20, max: 60} // 20到60之间的整数
      }
    }
    let flag = this.validate(rules);
  }
}
```

#### 基本数据类型

支持的数据类型有：`boolean`、`string`、`int`、`float`、`array`、`object`，对于一个字段只允许指定为一种基本数据类型，默认为 `string` 类型。

#### 手动设置数据值

如果有时候不能自动获取值的话（如：从 header 里取值），那么可以手动获取值后配置进去。如：

```js
module.exports = class extends think.Logic {
  saveAction(){
    let rules = {
      username: {
        value: this.header('x-name') // 从 header 中获取值
      }
    }
  }
}
```

#### 指定获取数据来源

如果校验 `version` 参数， 默认情况下会根据当前请求的类型来获取字段对应的值，如果当前请求类型是 `GET`，那么会通过 `this.param('version')` 来获取 `version` 字段的值；如果请求类型是 `POST`，那么会通过 `this.post('version')` 来获取字段的值， 如果当前请求类型是 `FILE`，那么会通过 `this.file('version')` 来获取 `verison` 字段的值。

有时候在 `POST` 类型下，可能会获取上传的文件或者获取 URL 上的参数，这时候就需要指定获取数据的方式了。支持的获取数据方式为 `GET`，`POST` 和 `FILE`。

#### 字段默认值

使用 `default:value` 来指定字段的默认值，如果当前字段值为空，会把默认值赋值给该字段，然后执行后续的规则校验。

#### 消除前后空格

使用 `trim:true` 如果当前字段支持 `trim` 操作，会对该字段首先执行 `trim` 操作，然后再执行后续的规则校验。

#### 校验前数据的自动转换

对于指定为 `boolean` 类型的字段，`'yes'`, `'on'`, `'1'`, `'true'`, `true` 会被转换成 `true`, 其他情况转换成 `false`，然后再执行后续的规则校验；
对于指定为 `array` 类型的字段，如果字段本身是数组，不做处理； 如果该字段为字符串会进行 `split(',')` 处理，其他情况会直接转化为 `[字段值]`，然后再执行后续的规则校验。

#### 校验后数据的自动转换

对于指定为 `int`、`float`、`numeric` 数据类型的字段在校验之后，会自动对数据进行 `parseFloat` 转换。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      age: {
        int: true,
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
  }
}
```
如果 url 中存在参数 `age=26`, 在经过 Logic 层校验之后，typeof this.param('age') 为 `number` 类型。

#### 数据校验方法

配置好校验规则后，可以通过 `this.validate` 方法进行校验。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        required: true
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
      // 如果出错，返回
      // {"errno":1000,"errmsg":"validate error","data":{"username":"username can not be blank"}}
    }
  }
}
```

如果你在controller的action中使用了`this.isGet` 或者 `this.isPost` 来判断请求的话，在上面的代码中也需要加入对应的 `this.isGet` 或者 `this.isPost`，如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    if(this.isPost) {
      let rules = {
        username: {
          required: true
        }
      }
      let flag = this.validate(rules);
      if(!flag){
        return this.fail('validate error', this.errors());
      }
    }

  }
}
```

如果返回值为 `false`，那么可以通过访问 `this.validateErrors` 属性获取详细的错误信息。拿到错误信息后，可以通过 `this.fail` 方法把错误信息以 JSON 格式输出，也可以通过 `this.display` 方法输出一个页面。


##### 自动调用校验方法

多数情况下都是校验失败后，输出一个 JSON 错误信息。如果不想每次都手动调用 `this.validate` 进行校验，可以通过将校验规则赋值给 `this.rules` 属性进行自动校验，如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      username: {
        required: true
      }
    }
  }
}
```

相当于

``` js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        required: true
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(this.config('validateDefaultErrno') , this.validateErrors);
    }
  }
}
```

将校验规则赋值给 `this.rules` 属性后，会在这个 Action 执行完成后自动校验，如果有错误则直接输出 JSON 格式的错误信息。


#### 数组校验

数据校验支持数组校验，但是数组校验只支持一级数组，不支持多层级嵌套的数组。`children` 为所有数组元素指定一个相同的校验规则。

``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      array: true,
      children: {
        string: true,
        trim: true,
        default: 'thinkjs'
      },
      method: 'GET'
    }
  }
  this.validate(rules);
}

```

#### 对象校验

数据校验支持对象校验， 但是对象校验只支持一级对象，不支持多层级嵌套的对象。`children` 为所有对象属性指定一个相同的校验规则。


``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      object: true,
      children: {
        string: true,
        trim: true,
        default: 'thinkjs'
      },
      method: 'GET'
    }
  }
  this.validate(rules);
}
```

#### 全局定义校验规则

在单模块下项目下的 `config` 目录下建立 `valadator.js` 文件；在多模块项目下的 `common/config` 目录下建立 `valadator.js`。在 `valadator.js` 中添加自定义的校验方法：

例如, 我们想要验证 `GET` 请求中的 `name1` 参数是否等于字符串 `lucy` 可以如下添加校验规则; 访问你的服务器地址/index/?name1=jack

```js
// logic index.js
module.exports = class extends think.Logic {
  indexAction() {
    let rules = {
      name1: {
        eqValid: 'lucy',
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
    if(!flag) {
      console.log(this.validateErrors); // name1 shoud eq lucy
    }
  }
  }
}

// src/config/validator.js
module.exports = {
  rules: {
    /**
     * @param  {Mixed} value        [相应字段的请求值]
     * @param  {Mixed} parsedValue  [校验规则的参数值]
     * @param  {String} validName   [校验规则的参数名称]
     * @return {Boolean}            [校验结果]
     */
    eqValid(value, parsedValue, validName) {
      console.log(value, parsedValue, validName); // 'jack', 'lucy', 'eqValid'
      return value === parsedValue;
    }
  },
  messages: {
    eqValid: '{name} should eq {args}'
  }
}

```

#### 解析校验规则参数

有时我们想对校验规则的参数进行解析，只需要建立一个下划线开头的同名方法在其中执行相应的解析，并将解析后的结果返回即可。

例如我们要验证 `GET` 请求中的 `name1` 参数是否等于 `name2` 参数， 可以如下添加校验方法：访问  你的服务器地址/index/?name1=tom&name2=lily

```js
// logic index.js
module.exports = class extends think.Logic {
  indexAction() {
    let rules = {
      name1: {
        eqValid: 'name2',
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
    if(!flag) {
      console.log(validateErrors); // name1 shoud eq name2
    }
  }
}

// src/config/validator.js
module.exports = {
  rules: {
    /**
     * 需要下划线开头的同名方法
     * @param  {Mixed}  validValue [校验规则的参数值]
     * @param  {Mixed}  query      [校验规则method指定的参数来源下的参数]
     * @param  {String} validName  [校验规则的参数名称]
     * @return {Mixed}             [解析之后的校验规则的参数值]
     */
    _eqValid(validValue, query, validName){
      console.log(validValue, query, validName); // 'name2', {name1: 'tom', name2: 'lily'}, 'eqValid'
      let parsedValue = query[validValue];
      return parsedValue;
    },

    /**
     * @param  {Mixed} value        [相应字段的请求值]
     * @param  {Mixed} parsedValue  [_eqValid方法返回的解析之后的校验规则的参数值]
     * @param  {String} validName   [校验规则的参数名称]
     * @return {Boolean}            [校验结果]
     */
    eqValid(value, parsedValue, validName) {
      console.log(value, parsedValue, validName); // 'tom', 'lily', 'eqValid'
      return value === parsedValue;
    }
  },
  messages: {
    eqValid: '{name} should eq {args}'
  }
}
```

#### 自定义错误信息

错误信息中可以存在三个插值变量 `{name}`、`{args}`、 `{pargs}`。 `{name}` 会被替换为校验的字段名称， `{args}`会被替换为校验规则的值，`{pargs}` 会被替换为解析方法返回的值。如果`{args}`、`{pargs}` 不是字符串，将做 `JSON.stringify` 处理。


对于非 `Object: true` 类型的字段，支持三种自定义错误的格式：规则1：规则：错误信息；规则2：字段名：错误信息；规则3：字段名：{ 规则： 错误信息} 。

对于同时指定了多个错误信息的情况，优先级 规则3 > 规则2 > 规则1。

``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      required: true,
      method: 'GET'
    }
  }
  let msgs = {
    required: '{name} can not blank',         // 规则 1
    username: '{name} can not blank',         // 规则 2
    username: {
      required: '{name} can not blank'        // 规则 3
    }
  }
  this.validate(rules, msgs);
}
```


对于 `Object: true` 类型的字段，支持以下方式的自定义错误。优先级为 规则 5 > (4 = 3) > 2 > 1 。

``` js
module.exports = class extends think.Logic {
  let rules = {
    address: {
      object: true,
      children: {
        int: true
      }
    }
  }
  let msgs = {
    int: 'this is int error message for all field',             // 规则1
    address: {
      int: 'this is int error message for address',             // 规则2
      a: 'this is int error message for a of address',          // 规则3
      'b,c': 'this is int error message for b and c of address' // 规则4
      d: {
        int: 'this is int error message for d of address'       // 规则5
      }
    }
  }
  let flag = this.validate(rules, msgs);
}
```




### 支持的校验类型

#### required

必填项。对于布尔值 false，数字 0，空字符串，空数组，空对象等值用 required 校验时都不能通过。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'required' //name 的值必填
    }
  }
}
```

#### requiredIf

当另一个项的值为某些值其中一项时，该项必填。如：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredIf:email,admin@example.com,admin1@example.com'
    }
  }
}
```

当 `email` 的值为 `admin@example.com`，`admin1@example.com` 等其中一项时， `name` 的值必填。

#### requiredNotIf

当另一个项的值不在某些值中时，该项必填。如：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredNotIf:email,admin@example.com,admin1@example.com'
    }
  }
}
```

当 `email` 的值不为 `admin@example.com`，`admin1@example.com` 等其中一项时， `name` 的值必填。


#### requiredWith

当其他几项有一项值存在时，该项必填。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWith:email,title'
    }
  }
}
```

当 `email`, `title` 等项有一项值存在时，`name` 的值必填。

#### requiredWithAll

当其他几项值都存在时，该项必填。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithAll:email,title'
    }
  }
}
```

当 `email`, `title` 等项值都存在时，`name` 的值必填。

#### requiredWithout

当其他几项有一项值不存在时，该项必填。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithout:email,title'
    }
  }
}
```

当 `email`, `title` 等项其中有一项值不存在时，`name` 的值必填。


#### requiredWithoutAll

当其他几项值都不存在时，该项必填。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithoutAll:email,title'
    }
  }
}
```

当 `email`, `title` 等项值都不存在时，`name` 的值必填。

#### contains

值需要包含某个特定的值。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'contains:thinkjs' //需要包含字符串 thinkjs。
    }
  }
}
```

#### equals

和另一项的值相等。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'equals:firstname'
    }
  }
}
```

`name` 的值需要和 `firstname` 的值相等。

#### different

和另一项的值不等。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'different:firstname'
    }
  }
}
```

`name` 的值不能和 `firstname` 的值相等。

#### before

值需要在一个日期之前，默认为需要在当前日期之前。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      start_time: 'before', //需要在当前日期之前。
      start_time1: 'before:2015/10/12 10:10:10' //需要在 2015/10/12 10:10:10 之前。
    }
  }
}
```

#### after

值需要在一个日期之后，默认为需要在当前日期之后。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      end_time: 'after', //需要在当前日期之后。
      end_time1: 'after:2015/10/10' //需要在 2015/10/10 之后。
    }
  }
}
```

#### alpha

值只能是 [a-zA-Z] 组成。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      en_name: 'alpha'
    }
  }
}
```

`en_name` 的值只能是 [a-zA-Z] 组成。

#### alphaDash

值只能是 [a-zA-Z_] 组成。

#### alphaNumeric

值只能是 [a-zA-Z0-9] 组成。

#### alphaNumericDash

值只能是 [a-zA-Z0-9_] 组成。

#### ascii

值只能是 ascii 字符组成。

#### base64

值必须是 base64 编码。

#### byteLength

字节长度需要在一个区间内。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'byteLength:10' //字节长度不能小于 10
      name1: 'byteLength:10,100' //字节长度需要在 10 - 100 之间
    }
  }
}
```

#### creditcard

需要是信用卡数字。

#### currency

需要是货币。

#### date

需要是个日期。

#### decimal

需要是个小数。

#### divisibleBy

需要被一个数整除。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      count: 'divisibleBy:3' //可以被 3 整除
    }
  }
}
```

#### email

需要是个 email 格式。

#### fqdn

需要是个合格的域名。

#### float

需要是个浮点数。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      money: 'float' //需要是个浮点数
      money1: 'float:3.2' //需要是个浮点数，且最小值为 3.2
      money2: 'float:3.2,10.5' //需要是个浮点数，且最小值为 3.2，最大值为 10.5
    }
  }
}
```

#### fullWidth

包含宽字节字符。

#### halfWidth

包含半字节字符。

#### hexColor

需要是个十六进制颜色值。

#### hex

需要是十六进制。

#### ip

需要是 ip 格式。

#### ip4

需要是 ip4 格式。

#### ip6

需要是 ip6 格式。

#### isbn

需要是图书编码。

#### isin

需要是证券识别编码。

#### iso8601

需要是 iso8601 日期格式。

#### in

在某些值中。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      version: 'in:1.2,2.0' //需要是 1.2，2.0 其中一个
    }
  }
}
```

#### noin

不能在某些值中。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      version: 'noin:1.2,2.0' //不能是 1.2，2.0 其中一个
    }
  }
}
```

#### int

需要是 int 型。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'int' //需要是 int 型
      value1: 'int:1' //不能小于1
      value2: 'int:10,100' //需要在 10 - 100 之间
    }
  }
}
```

#### min

不能小于某个值。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'min:10' //不能小于10
    }
  }
}
```

#### max

不能大于某个值。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'max:10' //不能大于10
    }
  }
}
```

#### length

长度需要在某个范围。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'length:10' //长度不能小于10
      name1: 'length:10,100' //长度需要在 10 - 100 之间
    }
  }
}
```

#### minLength

长度不能小于最小长度。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'minLength:10' //长度不能小于10
    }
  }
}
```

#### maxLength

长度不能大于最大长度。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'maxLength:10' //长度不能大于10
    }
  }
}
```

#### lowercase

需要都是小写字母。

#### uppercase

需要都是大写字母。

#### mobile

需要手机号。

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      mobile: 'mobile:zh-CN' //必须为中国的手机号
    }
  }
}
```

#### mongoId

是 MongoDB 的 ObjectID。

#### multibyte

包含多字节字符。

#### url

是个 url。

#### order

数据库查询 order，如：name DESC。

#### field

数据库查询的字段，如：name,title。

#### image

上传的文件是否是个图片。

#### startWith

以某些字符打头。

#### endWith

以某些字符结束。

#### string

值为字符串。

#### array

值为数组。

#### boolean

值为布尔类型。对于字符串 `yes`, `on`, `1`, `true` 会自动转为布尔 true。

#### object

值为对象。

#### regexp

正则，如：

```js
export default class extends think.logic.base {
  indexAction(){
    this.rules = {
      number: {
        required: true,
        regexp: /^\d{6}$/
      }
    }
  }
}
```

### 扩展校验类型

如果默认支持的校验类型不能满足需求，可以通过 `think.validate` 方法对校验类型进行扩展。如：

```js
// src/common/bootstrap/validate.js
think.validate('validate_name', (value, ...args) => {
  //需要返回 true 或者 false
  //true 表示校验成功，false 表示校验失败
})
```

上面注册了一个名为 `validate_name` 的校验类型，这样在 Logic 里就可以直接使用该校验类型了。

##### 参数解析

如果要解析后面的 `args`，如：该字段值跟其他字段值进行比较，这时拿到的参数是其他字段名称，但比较的时候肯定需要拿到这个字段值，所以需要将字段名称解析为对应的字段值。

可以通过注册一个解析参数函数来完成。如：上面的校验类型名称为 `validate_name`，那么对应的解析参数的名称必须为 `_validate_name`，即：`_` + `校验类型`。

```js
think.validate('_validate_name', (args, data) => {
  let arg0 = args[0];
  args[0] = data[arg0].value; //将第一个参数字段名称解析为对应的参数值
  return args;
})
```

