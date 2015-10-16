## 数据校验

项目里需要对用户提交过来的数据进行校验，以保证

### logic

### 数据校验配置

### 数据校验方法

### 校验错误信息

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

当其他几项值都存在时，该项必填。

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

值需要在一个日期之后，默认为需要在当前日期之前。

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

需要都是大小字母。

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

值为布尔类型。

#### object

值为对象。

### 扩展校验类型