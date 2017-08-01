## Logger

ThinkJS 通过 [think-logger3](https://npmjs.com/think-logger3) 模块实现了强大的日志功能，并提供适配器扩展，可以很方便的扩展内置的日志模块。系统默认使用 [log4js](https://github.com/nomiddlename/log4js-node) 模块作为底层日志记录模块，具有日志分级、日志分割、多进程等丰富的特性。

### 基本使用

系统已经全局注入了 logger 对象 `think.logger`，其提供了 `debug`, `info`, `warn`, `error` 四种方法来输出日志，日志默认是输出至控制台中。

```javascript
think.logger.debug('debug message');
think.logger.info('info message');
think.logger.warn('warning');
think.logger.error(new Error('error'));
```

### 基本配置

系统默认自带了 `Console`, `File`, `DateFile` 三种适配器。默认是使用 `Console` 将日志输出到控制台中。

#### 文件

如果想要将日志输出到文件，你可以这么设置：

- 将以下内容追加到 `src/config/adapter/logger.js` 文件中：
    ```javascript
    const path = require('path');
    const {File} = require('think-logger3');

    module.exports = {
      type: 'file',
      file: {
        handle: File,
        backups: 10,
        absolute: true,
        maxLogSize: 50 * 1024,  //50M
        filename: path.join(think.ROOT_PATH, 'logs/xx.log')
      }
    }
    
    ```
- 编辑 `src/config/adater.js` 文件，增加 `exports.logger = require('./adapter/logger.js')`。

该配置表示系统会将日志写入到 `logs/xx.log` 文件中。当该文件超过 `maxLogSize` 值时，会创建一个新的文件 `logs/xx.log.1`。当日志文件数超过 `backups` 值时，旧的日志分块文件会被删除。文件类型目前支持如下参数：

- `filename`：日志文件地址
- `maxLogSize`：单日志文件最大大小，单位为 KB，默认日志没有大小限制。
- `backups`：最大分块地址文件数，默认为 5。
- `absolute`：`filename` 是否为绝对路径地址，如果 `filename` 是绝对路径，`absolute` 的值需要设置为 `true`。
- `layouts`：定义日志输出的格式。

#### 日期文件

如果想要将日志按照日期文件划分的话，可以如下配置：

- 将以下内容追加到 `src/config/adapter/logger.js` 文件中：
    ```javascript
    const path = require('path');
    const {DateFile} = require('think-logger3');

    module.exports = {
      type: 'dateFile',
      dateFile: {
        handle: DateFile,
        level: 'ALL',
        absolute: true,
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: false,
        filename: path.join(think.ROOT_PATH, 'logs/xx.log')
      }
    }
    
    ```
- 编辑 `src/config/adater.js` 文件，增加 `exports.logger = require('./adapter/logger.js')`。

该配置会将日志写入到 `logs/xx.log` 文件中。隔天，该文件会被重命名为 `xx.log-2017-07-01`（时间以当前时间为准），然后会创建新的 `logs/xx.log` 文件。时间文件类型支持如下参数：

- `level`：日志等级
- `filename`：日志文件地址
- `absolute`：`filename` 是否为绝对路径地址，如果 `filename` 是绝对路径，`absolute` 的值需要设置为 `true`。
- `pattern`：该参数定义时间格式字串，新的时间文件会按照该格式格式化后追加到原有的文件名后面。目前支持如下格式化参数：
    - `yyyy` - 四位数年份，也可以使用 `yy` 获取末位两位数年份
    - `MM` - 数字表示的月份，有前导零
    - `dd` - 月份中的第几天，有前导零的2位数字
    - `hh` - 小时，24小时格式，有前导零
    - `mm` - 分钟数，有前导零
    - `ss` - 秒数，有前导零
    - `SSS` - 毫秒数（不建议配置该格式以毫秒级来归类日志）
    - `O` - 当前时区
- `alwaysIncludePattern`：如果 `alwaysIncludePattern` 设置为 `true`，则初始文件直接会被命名为 `xx.log-2017-07-01`，然后隔天会生成 `xx.log-2017-07-02` 的新文件。
- `layouts`：定义日志输出的格式。


### Level

日志等级用来表示该日志的级别，目前支持如下级别：

- ALL
- ERROR
- WARN
- INFO
- DEBUG

### Layout

`Console`, `File` 和 `DateFile` 类型都支持 `layout` 参数，表示输出日志的格式，值为对象，下面是一个简单的示例：

```javascript
const path = require('path');
const {File} = require('think-logger3');

module.exports = {
  type: 'file',
  file: {
    handle: File,
    backups: 10,
    absolute: true,
    maxLogSize: 50 * 1024,  //50M
    filename: path.join(think.ROOT_PATH, 'logs/xx.log'),
    layouts: {
      type: 'coloured',
      pattern: '%[[%d] [%p]%] - %m',
    }
  }
}
```

默认的 `Console` 的输出格式是 `%[[%d] [%z] [%p]%] - %m`，即 `[时间] [进程ID] [日志等级] - 日志内容`。 目前 layouts 支持如下参数：

- `type`：目前支持如下类型
    - basic
    - coloured
    - messagePassThrough
    - dummy
    - pattern
    - 自定义输出类型可参考 [Adding your own layouts](https://nomiddlename.github.io/log4js-node/layouts.html#adding-your-own-layouts)
- `pattern`：输出格式字串，目前支持如下格式化参数
    - `%r` - `.toLocaleTimeString()` 输出的时间格式，例如 `下午5:13:04`。
    - `%p` - 日志等级
    - `%h` - 机器名称
    - `%m` - 日志内容
    - `%d` - 时间，默认以 ISO8601 规范格式化，可选规范有 `ISO8601`, `ISO8601_WITH_TZ_OFFSET`, `ABSOUTE`, `DATE` 或者任何可支持格式化的字串，例如 `%d{DATE}` 或者 `%d{yyyy/MM/dd-hh.mm.ss}`。
    - `%%` - 输出 `%` 字符串
    - `%n` - 换行
    - `%z` - 从 `process.pid` 中获取的进程 ID
    - `%[` - 颜色块开始区域
    - `%]` - 颜色块结束区域

### 自定义 handle

如果觉得提供的日志输出类型不满足大家的需求，可以自定义日志处理的 `handle`。自定义 handle 需要实现一下几个方法：

```javascript
module.exports = class {
  /**
   * @param {Object}  config  {}  配置传入的参数
   * @param {Boolean} clusterMode true  是否是多进程模式
   */
  constructor(config, clusterMode) {

  }

  debug() {

  }

  info() {

  }

  warn() {

  }

  error() {

  }
}
```

