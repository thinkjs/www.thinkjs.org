## Data Validation

When handling user requests in Action, you often need to get the submitted datas firstly, and then validate them. Only passing the data validation can do the subsquent operations. After the param validation, sometimes, you also need to judge permission. After all of these are correct, it is time to do the real logic process. If these codes are all placed in one Action, it will must make the codes of Action very complex and redundant.

In order to solve this problem, ThinkJS add a layer of `Logic` before Controller. The Action in Logic and the Action in Controller are one-to-one correspondence. System will call the Action in Logic automatically before calling the Action in Controller. 


### Logic Layer

The directory of Logic is `src/[module]/logic`. When using command `thinkjs controller [name]` to create Controller, there will automatically create the corresponding Logic. The codes of the Logic are roughly like the followings.

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

The Action in Logic and the Action in Controller are one-to-one correspondence. The Action in Logic also supports `__before` and `__after` and other magic methods.

### Data Validation Config

The config of data validation is as follows.

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

#### Config Format

The config format is `field name` -> `config`, each field config supports multiple validation types. The multiple validation types are separated by `|`, the validation type and param are separated by `:`, param and param are seperated by  `,`.

#### Param Format

Params could follow the end of validation type. Besides supporting the simply params separated by comma, it also supports the complex param in JSON format. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      field1: "array|default:[1,2]", // param is an array
      field2: 'object|default:{\"name\":\"thinkjs\"}' //param is an object
    }
  }
}
```

#### Supported Data Type

The supported data types include `boolean`,`string`,`int`,`float`,`array`,`object`. And the default type is `string`.
 

#### Default Value

Use `default:value` to define the default value of field. If the value of current field is empty, it will be overrided by the default one. What you get subsequently will be the default value.

#### The Way to Get Data

By default, get the field value according to the current request type. If the type of current request is GET, use `this.get('version')` to get the value of `version` field. If the type of current request is POST, use `this.post` to get the field value.

But sometimes in the POST type, you may want to get the params from uploaded file or URL. By this time, you need to specify the way to get data. The supported ways to get data are `get`,`post` and `file`.

```js
export default class extends think.logic.base {
  /**
   * save data, POST request
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

The above demo specifys to use `post` method to get the value of the field `name`, use `file` method to get the value of the field `image`, use `get` method to get the value of the field `version`.


#### Error Message

The above config only specify the certain validation rules but not the error message when validation failure. Error messages support internationalizaion, you need to define it in the config file `src/common/config/locale/[lang].js`. eg.

```js
// src/common/config/locale/en.js
export default {
  validate_required: '{name} can not be blank',
  validate_contains: '{name} need contains {args}',
}
```

The key is `validate_` + `validation type name`. The value supports two params: `{name}` and `{args}`, which respectively indicate the field name and the passed param.

If you want to define the detailed message of a certain error type for a specific field, you could add a field name to the end. eg.

```js
// src/common/config/locale/en.js
export default {
  validate_required: '{name} can not be blank',
  validate_required_email: 'email can not be blank', //specify the error message of required for email field
}
```

### Data Validation Method

After configing the validation rules, you can use the method `this.validate` to validate. eg.


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

If the return value is `false`, you could use method `this.errors` to get the detailed error message. After getting the error message, you could use method  `this.fail` to output it in JSON format, or use method `this.display` to output a page.

In template, you can get the error message by `errors` field. The following is the way to show error message (taking ejs template as an example).

```html
<%for(var field in errors){%>
  <%-field%>:<%errors[field]%>
<%}%>
```

##### Validate Automatically

In generally, there will output a JSON message after validation failure. If `this.validate` needs to be called manually evertime to validate in Action of Logic, it must be inconvenient. You can make the validation automatically by assigning validation rules to `this.rules`. eg.

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

After assigning validation rules to `this.rules`, the validation will be automatically done after Action execution. If there are errors, it will directly output error messages in JSON format. Automatical validation uses the magic method `__after` to complete.

### Supported Validation Type

#### required

Required Item.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'required' //the value of name is required
    }
  }
}
```

#### requiredIf

When the value of the other certain item is one of the specified values, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredIf:email,admin@example.com,admin1@example.com'
    }
  }
}
```

When the value of `email` is one of `admin@example.com` and `admin1@example.com`, the value of `name` is required.


#### requiredNotIf

When the value of the other certain item is not one of the specified values, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredNotIf:email,admin@example.com,admin1@example.com'
    }
  }
}
```

When the value of `email` is not one of `admin@example.com` or `admin1@example.com`, the value of `name` is required.


#### requiredWith

When one of the values of some other certain items does exist, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWith:email,title'
    }
  }
}
```

When one of the values of `email` and `title` does exist, the value of `name` is required.

#### requiredWithAll

When all of the values of some other certain items do exist, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithAll:email,title'
    }
  }
}
```

When all of the values of `email` and `title` do exist, the value of `name` is required.

#### requiredWithout

When one of the values of some other certain items does not exist, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithout:email,title'
    }
  }
}
```

When one of the values of `email` and `title` does not exist, the value of `name` is required.

#### requiredWithoutAll

When all of the values of some other certain items do not exist, this item is required. eg.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'requiredWithoutAll:email,title'
    }
  }
}
```

When all of the values of `email` and `title` do not exist, the value of `name` is required.

#### contains

The value needs to contain the certain value.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'contains:thinkjs' //need to contain string 'thinkjs'。
    }
  }
}
```

#### equals

Be equal to the value of the other item.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'equals:firstname' 
    }
  }
}
```

The value of `name` needs to be equal to the value of `firstname`.

#### different

Be different to the value of the other item.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'different:firstname'
    }
  }
}
```

The value of `name` can't to be equal to the value of `firstname`.

#### before

The value needs to be before a certain date. By default, it needs to be before the current date.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      start_time: 'before', //need to be before the current date
      start_time1: 'before:2015/10/12 10:10:10' //need to be before 2015/10/12 10:10:10
    }
  }
}
```

#### after

The value needs to be after a certain date. By default, it needs to be after the current date.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      end_time: 'after', //need to be after the current date
      end_time1: 'after:2015/10/10' //need to be after 2015/10/10
    }
  }
}
```

#### alpha

The value must only consist of [a-zA-Z].

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      en_name: 'alpha'
    }
  }
}
```

The value of `en_name` must only consist of [a-zA-Z].

#### alphaDash

The value must only consist of [a-zA-Z_].

#### alphaNumeric

The value must only consist of [a-zA-Z0-9].

#### alphaNumericDash

The value must only consist of [a-zA-Z0-9_].

#### ascii

The value must only consist of ascii.

#### base64

The value must only consist of base64.

#### byteLength

The length of bytes needs to be in a certain range.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'byteLength:10' // the length of bytes can not less than 10
      name1: 'byteLength:10,100' //the length of bytes must be in the range of 10 to 100
    }
  }
}
```

#### creditcard

The value needs to be a credit card number.

#### currency

The value needs to be a currency.

#### date

The value needs to be a date.

#### decimal

The value needs to be a decimal.

#### divisibleBy

The value needs to be divisible by a number.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      count: 'divisibleBy:3' //could to be divisible by 3
    }
  }
}
```

#### email

The value needs to be email format.

#### fqdn

The value needs to be a qualified domain name.

#### float

The value needs to be a float.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      money: 'float' //need to be a float
      money1: 'float:3.2' //need to be a float, and the minimum is 3.2
      money2: 'float:3.2,10.5' //need to be a float, and the minimum is 3.2, the maximum is 10.5
    }
  }
}
```

#### fullWidth

The value needs contain full width char.

#### halfWidth

The value needs contain half width char.

#### hexColor

The value needs to be a hex color value.

#### hex

The value needs to be hex.

#### ip

The value needs to be ip format.

#### ip4

The value needs to be ip4 format.

#### ip6

The value needs to be ip6 format.

#### isbn

The value needs to be a book serial number.

#### isin

The value needs to be ISIN (International Securities Identification Numbers).


#### iso8601

The value needs to be iso8601 date format.


#### in

The value needs to be in some certain values.


```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      version: 'in:1.2,2.0' //need to be one of 1.2，2.0 
    }
  }
}
```

#### noin

The value needs to be not in some certain values.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      version: 'noin:1.2,2.0' //need to be not in 1.2，2.0
    }
  }
}
```

#### int

The value needs to be int.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'int' //int
      value1: 'int:1' //can not less than 1
      value2: 'int:10,100' //need to be in the range of 10 to 100
    }
  }
}
```

#### min

The value can not less than the certain value.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'min:10' //can not less than 10
    }
  }
}
```

#### max

The value can not great than the certain value.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      value: 'max:10' //can not great than 10
    }
  }
}
```

#### length

The length needs to be in the certain range.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'length:10' //the length can not less than 10
      name1: 'length:10,100' //the length need to be in the range of 10 to 100
    }
  }
}
```

#### minLength

The length can not to be less than the min-length.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'minLength:10' //the length can not to be less than 10
    }
  }
}
```

#### maxLength

The length can not to be great than the max-length.

```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      name: 'maxLength:10' //the length can not to be great than 10
    }
  }
}
```

#### lowercase

The value needs to be all lowercase.

#### uppercase

The value needs to be all uppercase.

#### mobile

The value needs to be a mobile phone.


```js
export default class extends think.logic.base {
  indexAction(){
    let rules = {
      mobile: 'mobile:zh-cn' //must be a chinese mobile phone
    }
  }
}
```

#### mongoId

The value is the ObjectID of MongoDB.

#### multibyte

Include multibyte char.

#### url

The value is url.

#### order

Database query order, like name DESC.

#### field

Database query field, like name,title.

#### image

Whether the file uploaded is a pic 

#### startWith

The value starts with some certain chars. 

#### endWith

The value ends with some certain chars. 

#### string

The value is string.

#### array

The value is array.

#### boolean

The value is boolean.

#### object

The value is object.

### Extend Validation Type

If the default supported validation types can not meet the demand, you can use the method `think.validate` to extend the validation types. eg.

```js
// src/common/bootstrap/validate.js
think.validate('validate_name', (value, ...args) => {
  //need to return true or false
  //true-validate sucess, false-validate fail
})
```

The above registers a validation type named `validate_name`, thus, you can directly use this validation type in Logic.

##### Param Parse

If you want to parse `args`, you can register a function. eg. the name of the above validation type is `validate_name`, then the corresponding name of parse param is `_validate_name`, that is `_` + `validation type`.

```js
think.validate('_validate_name', (args, data) => {
  let arg0 = args[0];
  args[0] = data[arg0].value; //parse the first param field name to the corresponding param value
  return args;
})
```
