## 原生对象的扩展

### Object.values(obj)

* obj `Object`
* return `Array`

返回一个对象的 value 列表。
```js
var obj = {name: "welefen", age: "29", sex: "male"};
var values = Object.values(obj); /* values is ["welefen", "29", "male"] */
```