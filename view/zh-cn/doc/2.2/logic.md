## Logic

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作。当参数校验完成后，有时候还要进行权限判断，等这些都判断无误后才能进行真正的逻辑处理。如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。

为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，系统在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

### Logic 层

Logic 目录在 `src/[module]/logic`，在通过命令 `thinkjs controller [name]` 创建 Controller 时会自动创建对应的 Logic。Logic 代码类似如下：

```js
'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  indexAction(){
   
  }
}
```

其中，Logic 里的 Action 和 Controller 里的 Action 一一对应。Logic 里也支持 `__before` 和 `__after` 等魔术方法。

### 请求类型校验配置

对应一个特定的 Action，有时候只需要一种或者二三种请求类型，需要将其他类型的请求给拒绝掉。可以通过配置特定的请求类型来完成校验。

```js
export default class extends think.logic.base {
  indexAction(){
    this.allowMethods = 'post'; //只允许 POST 请求类型
  }
  testAction(){
    this.allowMethods = 'get,post'; //只允许 GET 和 POST 请求类型
  }
}
```



### 数据校验配置

数据校验的配置如下：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      doc: "string|default:index",
      version: "string|in:1.2,2.0|default:2.0"
    }
  }
}
```

#### 配置格式

配置格式为 `字段名` -> `配置`，每个字段的配置支持多个校验类型，校验类型之间用 `|` 隔开，校验类型和参数之间用 `:` 隔开，参数之间用 `,` 隔开来支持多个参数。

#### 参数格式

校验类型后面可以接参数，除了支持用逗号隔开的简单参数外，还可以支持 JSON 格式的复杂参数。如：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      field1: "array|default:[1,2]", //参数为数组
      field2: 'object|default:{\"name\":\"thinkjs\"}' //参数为对象
    }
  }
}
```

除了配置为字符串，也可以配置对象的方式，如：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      field1: {required: true, array: true, default: [1, 2]}, //参数为数组
      field2: {object: true, default: {name: "thinkjs"}} //参数为对象
    }
  }
}
```

#### 支持的数据类型

支持的数据类型有：`boolean`、`string`、`int`、`float`、`array`、`object`，默认为 `string`。

#### 默认值

使用 `default:value` 来定义字段的默认值，如果当前字段值为空，会将默认值覆盖过去，后续获取到的值为该默认值。

#### 获取数据的方式

默认根据当前请求的类型来获取字段对应的值，如果当前请求类型是 GET，那么会通过 `this.get('version')` 来获取 `version` 字段的值。如果请求类型是 POST，那么会通过 `this.post` 来获取字段的值。

但有时候在 POST 类型下，可能会获取上传的文件或者获取 URL 上的参数，这时候就需要指定获取数据的方式了。支持的获取数据方式为 `get`，`post` 和 `file`。

```js
export default class extends think.logic.base {
  /**
   * 保存数据，POST 请求
   * @return {} []
   */
  saveAction(){
    let rules = {
      name: "required",
      image: "object|file|required",
      version: "string|get|in:1.2,2.0|default:2.0"
    }
  }
}
```

上面示例指定了字段 `name` 通过 `post` 方法来获取值，字段 `image` 通过 `file` 方式来获取值，字段 `version` 通过 `get` 方式来获取值。

#### 错误信息

上面的配置只是指定了具体的校验规则，并没有指定校验出错后给出的错误信息。错误信息支持国际化，需要在配置文件 `src/common/config/locale/[lang].js` 中定义。如：

```js
// src/common/config/locale/en.js
export default {
  validate_required: '{name} can not be blank',
  validate_contains: '{name} need contains {args}',
}
```

其中 key 为 `validate_` + `校验类型名称`，值里面支持 `{name}` 和 `{args}`  2个参数，分别代表字段名称和传递的参数。

如果想定义个特定字段某个错误类型的具体信息，可以通过在后面加上字段名。如：

```js
// src/common/config/locale/en.js
export default {
  validate_required: '{name} can not be blank',
  validate_required_email: 'email can not be blank', //指定字段 email 的 required 错误信息
}
```

### 数据校验方法

配置好校验规则后，可以通过 `this.validate` 方法进行校验。如：

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      doc: "string|default:index",
      version: "string|in:1.2,2.0|default:2.0"
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.errors());
    }
  }
}
```

如果返回值为 `false`，那么可以通过 `this.errors` 方法获取详细的错误信息。拿到错误信息后，可以通过 `this.fail` 方法把错误信息以 JSON 格式输出，也可以通过 `this.display` 方法输出一个页面。

错误信息通过 `errors` 字段赋值到模版里，模版里通过下面的方式显示错误信息（以 ejs 模版为例）：

```html
<%for(var field in errors){%>
  <%-field%>:<%errors[field]%>
<%}%>
```

##### 自动校验

一般情况下，都是校验有问题后，输出一个 JSON 信息。如果每次都要在 Logic 的 Action 手动调用 `this.validate` 进行校验，势必比较麻烦。可以通过将校验规则赋值给 `this.rules` 属性进行自动校验。如：

```js
export default class extends think.logic.base {
  indexAction(){
    this.rules = {
      doc: "string|default:index",
      version: "string|in:1.2,2.0|default:2.0"
    }
  }
}
```

将校验规则赋值给 `this.rules` 属性后，会在这个 Action 执行完成后自动校验，如果有错误则直接输出 JSON 格式的错误信息。自动校验是通过魔术方法 `__after` 来完成的。

### 支持的校验类型

#### required

必填项。

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
      mobile: 'mobile:zh-cn' //必须为中国的手机号
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

