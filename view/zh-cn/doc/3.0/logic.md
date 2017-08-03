## Logic

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作；当参数校验完成后，有时候还要进行权限判断等，这些都判断无误后才能进行真正的逻辑处理。如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。

为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，系统在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

### Logic 层

Logic 目录在 `src/[module]/logic`，在项目根目录通过命令 `thinkjs controller test` 会创建名为 test 的 Controller 同时会自动创建对应的 Logic。

Logic 代码类似如下：

```js
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

注：若自己手工创建时，Logic 文件名和 Controller 文件名要相同

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
        return this.fail('validate error', this.validateErrors);
      }
    }

  }
}
```

如果返回值为 `false`，那么可以通过访问 `this.validateErrors` 属性获取详细的错误信息。拿到错误信息后，可以通过 `this.fail` 方法把错误信息以 JSON 格式输出，也可以通过 `this.display` 方法输出一个页面，Logic 继承了 Controller 可以调用 Controller 的 方法。

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

#### 校验前数据的自动转换

对于指定为 `boolean` 类型的字段，`'yes'`， `'on'`， `'1'`， `'true'`， `true` 会被转换成 `true`， 其他情况转换成 `false`，然后再执行后续的规则校验；

对于指定为 `array` 类型的字段，如果字段本身是数组，不做处理； 如果该字段为字符串会进行 `split(',')` 处理，其他情况会直接转化为 `[字段值]`，然后再执行后续的规则校验。


#### 校验后数据的自动转换

对于指定为 `int`、`float` 数据类型的字段在校验之后，会自动对数据进行 `parseFloat` 转换。

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
如果 url 中存在参数 `age=26`， 在经过 Logic 层校验之后，typeof this.param('age') 为 `number` 类型。

#### 自定义错误中的规则名称

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
对于上述规则，在验证失败的情况下 this.validateErrors 将为 {username: 'username can not be blank'}。但是有时想让错误自定义为 '用户名不能为空'。需要如下操作：

首先在 `src/config/validator.js` 中复写掉默认的 `required` 错误信息：

```js
module.exports = {
  messages: {
    required: '{name} 不能为空',
  }
}

```

然后要将 `username` 替换成别名 `用户名`，需要为校验规则添加 `aliasName` :

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      username: {
        required: true,
        aliasName: '用户名'
      }
    }
  }
}
```


#### 全局定义校验规则

在单模块下项目下的 `config` 目录下建立 `validator.js` 文件；在多模块项目下的 `common/config` 目录下建立 `validator.js`。在 `validator.js` 中添加自定义的校验方法：

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
    eqValid(value, { ctx, currentQuery, parsedValidValue, rule, rules, validName, validValue }) {
      return value === parsedValidValue;
    }
  },
  messages: {
    eqValid: '{name} should eq {args}'
  }
}

```
自定义的校验方法会被注入下面的参数，对于上述例子来说
(
  value: ,                // name1 参数，在相应的请求中的值，此处为 ctx['param']['name1']
  {
    ctx,                  // 所有请求类型集合
    currentQuery,         // name1 对应请求类型，此处为 ctx['param']
    parsedValidValue,     // name1 在 _eqValid 方法解析返回的结果
    rule,                 // name1 的校验规则内容
    rules,                // 所有的校验规则内容
    validName,            // 此处为 'eqValid'
    validValue            // 此处为 'lucy'
  }
)


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
    _eqValid(validValue, { ctx, currentQuery, rule, rules, validName }){
      let parsedValue = currentQuery[validValue];
      return parsedValue;
    },

    eqValid(value, { ctx, currentQuery, parsedValidValue, rule, rules, validName, validValue }) {
      return value === parsedValue;
    }
  },
  messages: {
    eqValid: '{name} should eq {args}'
  }
}
```

解析参数 `_eqValid` 注入的第一个参数是当前校验规则的值（对于本例子，validValue 为 'name2'），其他参数意义同上面的介绍。

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

`required: true` 字段必填，默认 `required: false`。`undefined`、`空字符串` 、`null`、`NaN` 在 `required: true` 时校验不通过。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        required: true
      }
    }
    this.validate(rules);
    // todo
  }
}
```

`name` 为必填项。

#### requiredIf

当另一个项的值为某些值其中一项时，该项必填。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredIf: ['username', 'lucy', 'tom'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子， 当 `GET` 请求中的 `username` 的值为 `lucy`、`tom` 任何一项时， `name` 的值必填。

#### requiredNotIf

当另一个项的值不在某些值中时，该项必填。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredNotIf: ['username', 'lucy', 'tom'],
        method: 'POST'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `POST` 请求中的 `username` 的值不为 `lucy` 或者 `tom` 任何一项时， `name` 的值必填。


#### requiredWith

当其他几项有一项值存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWith: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中 `id`， `email` 有一项值存在时，`name` 的值必填。

#### requiredWithAll

当其他几项值都存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithAll: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中 `id`， `email` 所有项值存在时，`name` 的值必填。

#### requiredWithOut

当其他几项有一项值不存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithOut: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `id`， `email` 有任何一项值不存在时，`name` 的值必填。


#### requiredWithOutAll

当其他几项值都不存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithOutAll: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `id`， `email` 所有项值不存在时，`name` 的值必填。

#### contains

值需要包含某个特定的值。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        contains: 'ID-',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `name` 得值需要包含字符串 `ID-`。

#### equals

和另一项的值相等。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        equals: 'username',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中的 `name` 与 `username` 的字段要相等。

#### different

和另一项的值不等。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        different: 'username',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中的 `name` 与 `username` 的字段要不相等。

#### before

值需要在一个日期之前，默认为需要在当前日期之前。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      time: {
        before: '2099-12-12 12:00:00', // before: true 早于当前时间
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中的 `time` 字段对应的时间值要早于 `2099-12-12 12:00:00`。

#### after

值需要在一个日期之后，默认为需要在当前日期之后，`after: true | time string`。

#### alpha

值只能是 [a-zA-Z] 组成，`alpha: true`。

#### alphaDash

值只能是 [a-zA-Z_] 组成，`alphaDash: true`。

#### alphaNumeric

值只能是 [a-zA-Z0-9] 组成，`alphaNumeric: true`。

#### alphaNumericDash

值只能是 [a-zA-Z0-9_] 组成，`alphaNumericDash: true`。

#### ascii

值只能是 ascii 字符组成， `ascii: true`。

#### base64

值必须是 base64 编码，`base64: true`。

#### byteLength

字节长度需要在一个区间内， `byteLength: options`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        byteLength: {min: 2, max: 4} // 字节长度需要在 2 - 4 之间
        // byteLength: {min: 2} // 字节最小长度需要为 2
        // byteLength: {max: 4} // 字节最大长度需要为 4
      }
    }
  }
}
```

#### creditCard

需要为信用卡数字，`creditCard: true`。

#### currency

需要为货币，`currency: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### date

需要为日期，`date: true`。

#### decimal

需要为小数，例如：0.1， .3， 1.1， 1.00003， 4.0，`decimal: true`。

#### divisibleBy

需要被一个数整除，`divisibleBy: number`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        divisibleBy: 2 //可以被 2 整除
      }
    }
  }
}
```

#### email

需要为 email 格式，`email: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### fqdn

需要为合格的域名，`fqdn: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### float

需要为浮点数，`float: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      money: {
        float: true, //需要是个浮点数
        // float: {min: 1.0, max: 9.55} // 需要是个浮点数，且最小值为 1.0，最大值为 9.55
      }
    }
    this.validate();
    // todo
  }
}
```

#### fullWidth

需要包含宽字节字符，`fullWidth: true`。

#### halfWidth

需要包含半字节字符，`halfWidth: true`。

#### hexColor

需要为个十六进制颜色值，`hexColor: true`。

#### hex

需要为十六进制，`hex: true`。

#### ip

需要为 ip 格式，`ip: true`。

#### ip4

需要为 ip4 格式，`ip4: true`。

#### ip6

需要为 ip6 格式，`ip6: true`。

#### isbn

需要为国际标准书号，`isbn: true`。

#### isin

需要为证券识别编码，`isin: true`。

#### iso8601

需要为 iso8601 日期格式，`iso8601: true`。

#### issn

国际标准连续出版物编号，`issn: true`。

#### uuid

需要为 UUID（3，4，5 版本)，`uuid: true`。

#### dataURI

需要为 dataURI 格式，`dataURI: true`。

#### md5

需要为 md5，`md5: true`。

#### macAddress

需要为 mac 地址， `macAddress: true`。

#### variableWidth

需要同时包含半字节和全字节字符， `variableWidth: true`。

#### in

在某些值中，`in: [...]`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      version: {
        in: ['2.0', '3.0'] //需要是 2.0，3.0 其中一个
      }
    }
    this.validate();
    // todo
  }
}
```

#### notIn

不能在某些值中， `notIn: [...]`。

#### int

需要为 int 型， `int: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        int: true, //需要是 int 型
        //int: {min: 10, max: 100} //需要在 10 - 100 之间
      }
    }
    this.validate();
    // todo
  }
}
```

#### length

长度需要在某个范围，`length: options`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        length: {min: 10}, //长度不能小于10
        // length: {max: 20}, //长度不能大于10
        // length: {min: 10, max: 20} //长度需要在 10 - 20 之间
      }
    }
    this.validate();
    // todo
  }
}
```

#### lowercase

需要都是小写字母，`lowercase: true`。

#### uppercase

需要都是大写字母，`uppercase: true`。

#### mobile

需要为手机号，`mobile: true | options`，`options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      mobile: {
        mobile: 'zh-CN' //必须为中国的手机号
      }
    }
    this.validate();
    // todo
  }
}
```

#### mongoId

需要为 MongoDB 的 ObjectID，`mongoId: true`。

#### multibyte

需要包含多字节字符，`multibyte: true`。

#### url

需要为 url，`url: true|options`，`options` 参见 `https://github.com/chriso/validator.js`。

#### order

需要为数据库查询 order，如：name DESC，`order: true`。

#### field

需要为数据库查询的字段，如：name,title，`field: true`。

#### image

上传的文件需要为图片，`image: true`。

#### startWith

需要以某些字符打头，`startWith: string`。

#### endWith

需要以某些字符结束, `endWith: string`。

#### string

需要为字符串，`string: true`。

#### array

需要为数组，`array: true`，对于指定为 `array` 类型的字段，如果字段对应的值是字符串不做处理；如果字段对应的值是字符串，进行 `split(,)` 处理；其他情况转化为 `[字段值]`。

#### boolean

需要为布尔类型。`'yes'`， `'on'`， `'1'`， `'true'`， `true` 会自动转为布尔 `true` 。

#### object

需要为对象，`object: true`。

#### regexp

字段值要匹配给出的正则。

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      name: {
        regexp: /thinkjs/g
      }
    }
    this.validate();
    // todo
  }
}
```
