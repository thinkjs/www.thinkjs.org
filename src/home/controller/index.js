'use strict';

import base from './base.js';

export default class extends base {
  /**
   * homepage
   * @return {} []
   */
  indexAction() {
    let data = {
      en: {
        features: [{
          title: 'Supports ES6/7 features',
          content: 'Writing code with full ES6/7 features (Generator Function, Class, Async & Await etc.), and the Babel-compiled code will run on Node.js runtime stably.'
        }, {
          title: 'Rich database support',
          content: 'Supports Mysql, Sqlite, Mongodb with highly encapsulated and easy to use methods, in which SQL injection filters are also implemented.'
        }, {
          title: 'Hook & Middleware',
          content: 'Rich hooks and middlewares are provided for conduct the user requests.'
        }, {
          title: 'REST API',
          content: 'Auto-generate REST API, no need extra coding. Data level authorization controlling that make you can allow or disallow data access to certain user'
        }, {
          title: 'Supports WebSocket',
          content: 'Only need write one set of code to support common WebSocket clients like socket.io and sockjs.'
        }, {
          title: 'Rich Adaptors',
          content: 'Easy switching between Cache, Store, Session and Template, to change your application\'s behavior without concerning with what\'s behind it.'
        }, {
          title: 'Hot Module Replacement(HMR)',
          content: 'In development mode, HMR monitors file changes and replaces them in the active runtime, no need to restart Node.js.'
        }, {
          title: 'Command Line Interface',
          content: 'Supports invoke Action in CLI, easier to execute timed task.'
        }],
        testimonials: [{
          image: '/static/img/portrait_yueying.jpg',
          name: 'Ying Yue',
          desc: 'Leader of 75team, the biggest front-end team of QIHOO 360(NYSE)',
          content: 'ThinkJS has established the benchmark of usability and innovativeness, it represents high level standard among Node frameworks. I wish everyone contribute to it and to build up a prosperous community together.',
        }, {
          image: '/static/img/portrait_lisongfeng.jpg',
          name: 'Songfeng Li',
          desc: 'Translator of the Chinese-Edition of <i>Prefessional JavaScript for Web Developers</i>',
          content: 'ThinkJS 2.0 is disruptive innovation, it condenses the author\'s painstaking efforts, we belive it\'s performance, productivity and extensibility will bring the developers more surprise and shock!',
        }, {
          image: '/static/img/portrait_zhouyubo.jpg',
          name: 'Yubo Zhou',
          desc: 'Co-founder of w3ctech, the biggest front-end developers community in China',
          content: 'The best part of ThinkJS is it has a smooth learning curve and easy to use! It is a good choice whether you use it on project or learning Node.js! w3ctech is developed use ThinkJS.',
        }]
      },
      'zh-cn': {
        features: [{
          title: '支持 ES6/7 特性',
          content: '可以直接在项目里使用 ES6/7（Generator Function, Class, Async & Await）等特性，借助 Babel 编译，可稳定运行在 Node.js 环境上。'
        }, {
          title: '支持丰富的数据库',
          content: '支持 Mysql、SQLite、MongoDB 等常见的数据库，提供了很多简单易用、高度封装的方法，自动防止 SQL 注入。'
        }, {
          title: 'Hook & Middleware',
          content: '系统提供了大量的钩子和中间件，可以方便地对请求进行控制和修改。'
        }, {
          title: 'REST API',
          content: '自动生成 REST API，而无需写任何的代码。也可以根据接口定制，隐藏部分数据和进行权限控制。'
        }, {
          title: '支持 WebSocket',
          content: '支持 socket.io、SockJS 等常见的 WebSocket 客户端，而服务端代码始终保持一致。'
        }, {
          title: '丰富的 Adapter',
          content: '快速切换 Cache、Store、Session、Template 等功能，而无需关心具体使用哪种方式。'
        }, {
          title: '自动更新',
          content: '开发模式下，文件修改后立即生效，无需重启 Node.js 服务。'
        }, {
          title: '命令行调用',
          content: '支持命令行方式调用 Action，方便执行定时任务。'
        }],
        testimonials: [{
          image: '/static/img/portrait_yueying.jpg',
          name: '月影',
          desc: '360 奇舞团负责人',
          content: 'ThinkJS 在易用性和创新方面是一个标杆。作为 Node.js 的新生应用框架，她代表着行业内的高水平。接下来希望她的社区能够繁荣起来，希望大家喜欢 ThinkJS 并且不断完善她。',
        }, {
          image: '/static/img/portrait_lisongfeng.jpg',
          name: '李松峰',
          desc: '《JavaScript 高级程序设计》译者',
          content: 'ThinkJS 2.0 是一个颠覆式的版本，这个版本凝聚了作者的大量心血和社区的集体智慧，我们有理由相信她在性能、效率和扩展性上能够带给广大开发者带来更多的惊喜！',
        }, {
          image: '/static/img/portrait_zhouyubo.jpg',
          name: '周裕波',
          desc: 'w3ctech 发起人',
          content: 'ThinkJS 最优秀的地方在于她可以快速上手，开发简单，功能强大，利于扩展！不管你是用她来开发项目还是学习 Node.js 都是非常好的选择！w3ctech 就是使用 ThinkJS 开发的。',
        }]
      }
    };
    this.assign(data[this.lang()]);
    return this.display();
  }

  /**
   * changelog page
   * @return {} []
   */
  changelogAction() {
    this.assign('currentNav', 'changelog');
    this.assign('title', this.locale('title-changelog'));
    let histories = {
      en: [
        {
          'version': '2.2.1', date: '2016.03.30', list: [
          'Fix bug with ThinkJS versioning on create project',
          'Fix error path missing one hierarchy',
        ]
        }, {
          'version': '2.2.0', date: '2016.03.30', list: [
            'Support ES2015+ Breakpoint Debugging',
            'Support error message locate to src/ folder',
            'Fix bug with can\'t fetch I18N error修复国际化错误信息获取不到的问题',
            'Reomve default field value fetched from database, fix bug with modify specify value reports error',
            'Fix bug with error info can\'t be clear if there are multiple compile errors on the same file',
            'Remove retainLines compile option',
            'Fix bug with different validation rule incorrect',
            'Fix bug with File Session fetch empty content cause Session losed',
            'Fix bug with addMany method returning the wrong value',
            'Fix bug with empty rules in data validation result in error',
            'Fix bug with mongo model aggregate method return incorrect value',
            'Fix bug with afterDelete take no effect',
            'Fix bug with type of BELONG_TO in Relation Model can\'t set fKey',
            'Change log_sql default to off on production environemnt',
            'Fix bug with metheds like sum with expression parameters report error',
            'Fix bug with Mysql not recognize database encoding',
            'Fix bug with postgresql field type can\'t be boolean',
          ]
        }, {
          'version': '2.1.8', date: '2016.03.15', list: [
            'Fix bug with Mysql multi-connection reports Connection already Released error',
            'Fix bug with create project path partialiy incorrect',
            'Optimize when project start check module environment',
            'Fix parseGroup with expression reports error',
            'Add more error infomation when call non-exist Action',
          ]
        }, {
          'version': '2.1.7', date: '2016.03.01', list: [
            'Fix bug with not properly handle Promise cause error message',
            'Fix bug resulting in ObjectID can be class',
            'Fix model schema default value not support nesting',
            'Add log_error config to decide if print 500 error log',
          ]
        }, {
          'version': '2.1.6', date: '2016.02.25', list: [
            'Fix bug with correlation model failed add due to missing part of data.',
            'Fix bug with database table name contains keyword reports error.',
            'Fix bug with model find method return multiple result in some conditions.',
            'Fix bug with file upload failed cause request can not be ended.',
            'Remove listening to unhandledRejection event.',
            'Fix bug with fetch method missing config parameter.',
          ]
        }, {
          'version': '2.1.5', date: '2016.02.04', list: [
            'Add think.datetime, think.isFileAsync, think.isDirAsync method.',
            'Improve uploaded data parsing.',
            'Fix when creating project, the display project command may be incorrect.',
            'Fix bug with ID return by Mongo is not a string',
            'Fix bug with template confiure parsing error',
          ]
        }, {
          'version': '2.1.4', date: '2016.01.22', list: [
            'Support default value on data modal update.',
            'Support trim on data validation.',
            'Support pre-load on service start, production mode default to turn on.',
            'nunjucks template now use asynchronous rendering.',
            'Support genertate test/ foloder on creating project.',
            'Fix bug with windows not supporting multi-level controller.',
            'Fix bug with detect project type failed on first compile.',
            'Fix bug with addMany reports error.',
            'Fix bug with regx validation on null value casue error.',
            'Fix bug with SQLite connection data name incorrect.',
          ]
        }, {
          'version': '2.1.3', date: '2016.01.19', list: [
            'Added think.isMaster property.',
            'Service class added method model.',
            'think.base added method parseModuleFromPath.',
            'Fix bug with parsing model default value incorrect.',
            'Fix bug when model where condition is string, add another condition will cause error.',
          ]
        }, {
          'version': '2.1.2', date: '2016.01.15', list: [
            'Add --allowSyntheticDefaultImports parameters for TypeScript compiling.',
            'Fix bug with creating TypeScript project error if file name suffix is not .ts.',
          ]
        }, {
          'version': '2.1.1', date: '2016.01.15', list: [
            'Fix bug with database prefix not working.',
            'Added support Babel set presets and plugins.',
            'Fix bug with multiple hierachy controller can\'t be found.',
            'Added deprected method getTableFields to compatible with former version.',
            'Fix bug with baseAssign overrides custom settings.',
            'Fix bug with missing think.RUNTIME_PATH cause path incorrect.',
          ]
        }, {
          'version': '2.1.0', date: '2016.01.14', list: [
            'Support TypeScript, see details <a href="">here</a>.',
            'Performance increase 90%, better than Koa and express, see benchmark <a href="">here</a>.',
            'Added support Controller sub-folder.',
            'Added support PostgreSQL database.',
            'Added support set default value in Model schema.',
            'Change Hook middleware return null will block the rest middleware.',
            'Added alias method render for http and controller display.',
            'Added synchronous method think.waterfall.',
            'Added support Validate with Regex.',
            'Added support transmit data with fetch.',
            'Added support Logic to get request type.',
            'Added support timed task can directly invoke action.',
            'Upgrade Babel to 6.',
            'Locale name is not case sensiive.',
            'Change to asynchronous fetch template file content.',
            'http object no longer inherit from EventEmitter.',
            'Drop think.mode_mini mode, controller support sub-folder.',
            'Rename name to database in database setting.',
            'Rename fields to schema.',
            'Rename pwd to password in database setting.',
            'Optimize http object creation, no need to copy each time.',
            'Filtered hidden file types like .svn, .git etc.',
            'Move bin/index.js to src/command.js.',
            'Move runtime folder to project root, added think.RUNTIME_PATH constant.',
            'Added support to auto lower case adapter type, with prompt.',
            'Added thinkData, for frequently-used data caching.',
            'Combine think.locale and controller.locale.',
            'Fix bug with nunjucks inherit file can\'t be found.',
            'Fix bug with escaped / in pathname cause parsing error.',
            'Fix bug with modifying data response by http.file will cause source data being modified.',
            'Add support path / no need to change to \\ in windows.',
            'Fix bug resulting in nunjucks can place template files not only in root folder.',
            'Added on production mode, prevent the page from outputting sensitive data.',
            'Added on development mode, JSON parse failed message will be logged for debugging.',
            'Fix bug resulting in on view root_path changed will also update the view path.',
            'Fix bug with incorect required|int rule validation.',
            'Fix bug with redis cache parsing settings.',
            'Fix bug resulting in REST API can support logic.',
            'Fix bug with count method failed when parameter name is keyword.',
          ]
        }, {
          'version': '2.0.16', date: '2016.01.08', list: [
            'Added support think.parseConfig method support context.',
          ]
        }, {
          'version': '2.0.15', date: '2015.12.25', list: [
            'Fix bug with setting nunjucks root_path logic failing.',
          ]
        }, {
          'version': '2.0.14', date: '2015.12.25', list: [
            'Added support MongoDB with multiple host configures.',
            'Fix bug with nunjucks root_path setting.',
            'Added support on development mode, print the payload parsing error message.',
            'Added support when failed to parse payload by JSON, use querystring parsing.',
          ]
        }, {
          'version': '2.0.13', date: '2015.12.08', list: [
            'Fix bug with think.parseConfig contains adapter.',
            'Fix bug resulting in update relation model also update files relative.',
            'Fix use alias in countSelect reports error.',
            'Fix bootstrap not being clean and reload on file changed.',
            'nunjucks enable autoescape by default.',
          ]
        }, {
          'version': '2.0.12', date: '2015.12.02', list: [
            'fix file can\'t autoreload in windows when compiled.',
          ]
        }, {
          'version': '2.0.11', date: '2015.11.27', list: [
            'No longer change name to lowercase on parsing configuration.',
            'Fix save model mapping reports error.',
            'Fix use SQLite mapping without unique field reports error.',
            'Fix set cache resulting in incorrect countSelect result.',
            'Fix validation logic to handle empty conent.',
            'Fix Session return without completing resulting in not saving.',
            'Fix think.parallelLimit has memory leak on single task operation.',
          ]
        }, {
          'version': '2.0.10', date: '2015.11.20', list: [
            'Support Object type data validation format.',
            'Fix create controller in normal mode reports file content errors.',
            'Support thinkjs -v to show version number.',
            'Replace think.co.wrap with think.co.',
            'Now when calling another action in action, it will auto modify module/controller/action.',
            'Support entry file to set retainsFile configure.',
            'Support jade template compile cache in production.',
          ]
        }, {
          'version': '2.0.9', date: '2015.11.15', list: [
            'Fix change route not refreshing.',
            'Move think.npm installation path to root, and support --save option.',
            'Fix when count is 0, countSelect reports an error.',
            'Fix can\'t use db session.',
            'Fix socket start too many connections.',
          ]
        }, {
          'version': '2.0.8', date: '2015.11.14', list: [
            'Fix tempalte file not refreshing.',
            'Fix missing dependencies in package.json during set up.',
            'Fix auto-compile failed to get project env.',
            'Fix nunjucks template can\'t set root folder.',
            'Fix using Babel resulting in errors in module._load on certain platforms.',
          ]
        }, {
          'version': '2.0.7', date: '2015.11.13', list: [
            'Drop options from view configuration, and should use adapter from now.',
            'Suppress loading of non-js bootstrap files.',
            'Add option to install dependencies during set up.',
            'No longer keep static resource accessing logs.',
            'Add think.camelCase method.',
            'Support custom parsing configuration file, add think.parseConfig method.',
            'Display error page when output Promise.',
            'Fix Babel occasionally failed.',
            'Display page compiled errors on current URL.',
            'Remove source file will also remove the compiled file.',
            'Fix mini and normal module can\'t load bootstrap files.',
            'Fix file session occasionally errors.',
            'Fix some children file not refreshing on its parent being modified.',
          ]
        }, {
          'version': '2.0.6', date: '2015.11.08', list: [
            'URL parsed Action name support \'-\' character.',
            'Add think.mergeConfig method, auto-merged adapter parameters.',
            'Configuration like Cache, Session accept adapter config.',
            'Add think.pallelLimit mehotd, to limit the concorrency number.',
            'Add auto-compile mechanism, remove \'npm run watch - compile\' command.',
            'Add detection for \'common\' module only configuration.',
            'Config support parser, Redis、Memcache support distributed config.',
            'Add think.adapter.base, all \'Adapter\' are inherit from this base class.',
            'Remove options config in view, and use \'adapter\' as a substitution.',
            'Fix change the bae file the parent will not update iit self.',
            'Fix third party middleware parse payload cause stop execution.',
            'Fix if file name contains special character cause the error message could not use uppercase.',
            'Fix Session sometimes reports an error.',
            'Fix can not access resource wihich URL contains Chinese Character.',
            'Fix static resource Range head not handle properly.',
          ]
        }, {
          'version': '2.0.5', date: '2015.11.02', list: [
            'Fix Logic rule contains space produces error.',
            'Improve object structure of Logic rule validation result.',
            'Rename bootstrap/hook.js to bootstrap/middleware.js during project creation.',
            'Add config/hook.js during projec creation.',
            'Babel compile add --retain-lines option, to keep the same code line number after compilation.',
            'Add auto convert MongoID query string to MongoID object.',
            'Fix new files not being reloaded.',
            'Fix think.cache failed to assign object type.',
            'update module add validation on where query.',
            'Remove the buildin deny_ip middleware, now it is a seperate module named think-ip-filter middleware.',
            'Add prerender hook.',
            'thinkjs add plugin creation command into CLI.',
            'Fix when environemnt setting is producition or testing, the command can not end itself.',
            'Add view_filter hook.',
            'Fix file Session sometimes reports error.',
            'Note：fix small issues are found during publishment of 2.0.',
          ]
        }, {
          'version': '2.0.0', date: '2015.10.30', list: [
            'Can use full features of ES6/7 to develop.',
            'Support different project structure and environment.',
            'Support rich database like Mysql, MongoDB, SQLite.',
            'Code auto reload without restarting Node service.',
            'Support multiple WebSocket library, like socket.io and sockjs.',
            'Support multiple Session types, like Memory, like File, Db, Redis etc.',
            'Support multiple Cache, like MemoryFile, Redis, Memcache etc.',
            'Support multiple template engine, like ejs, jade, swig, numjucks etc.',
            'Support Aspect Oriented Programming, support methods like __before, __after etc.',
            'Support error page customization, like 400, 404, 500, 503 etc.',
            'CLI support invoking action and timer task.',
            'Rich Hook and Middleware.',
            'Support detailed logging of all kinds, like request, error and performance logging.',
            'REST API auto-generated.',
            'Support internationalization and theming.',
            'Comprehensive test cases 1500+, with code coverage > 95%.',
          ]
        }, {
          'version': '1.2.10', date: '2015.09.17', list: [
            'Fix if Memcache content contains end, content will be cut off.',
            'Fix use alias in countSelect will report a SQL error.',
          ]
        }, {
          'version': '1.2.9', date: '2015.07.30', list: [
            'Fix URL backslash in Windows can\'t be parse.',
          ]
        }, {
          'version': '1.2.8', date: '2015.07.29', list: [
            'Fix security issue of accessing static resource.',
          ]
        }, {
          'version': '1.2.7', date: '2015.07.15', list: [
            'Fix Memcache can not use remote host.',
            'Fix Memcache complains to some method parameters.',
            'Change DbSession key to cookie, to prevent error from creating data reports.',
          ]
        }, {
          'version': '1.2.6', date: '2015.07.07', list: [
            'Add custom config in jade template.',
          ]
        }, {
          'version': '1.2.5', date: '2015.06.24', list: [
            'Fix WebSocket change number to string.',
            'Fix post field equals null produces error.',
          ]
        }, {
          'version': '1.2.4', date: '2015.05.29', list: [
            'Remove the Controller name constrain must start with upper case followed with lower case<a href="https://github.com/75team/thinkjs/issues/166">#166</a>.',
          ]
        }, {
          'version': '1.2.3', date: '2015.05.18', list: [
            'Fix redis timeout setting no effect. thx @snadn.',
            'Fix in debug mode, App.sendError produces error. thx @Zongmin lei.',
            'Fix OR mapping error if advanace model table field contains underline.',
          ]
        }, {
          'version': '1.2.2', date: '2015.04.29', list: [
            'Fix issue of importing MongoDb starts with lowercase, thx @denvey.',
            'websocket add timeout setting, default to 0 (never stop).',
            'Fix maliciously upload file cause Temp folder contains files.',
            'Note: skip npm version of 1.2.1 becuase it is no stable.',
          ]
        }, {
          'version': '1.2.0', date: '2015.04.21', list: [
            'Fix file upload not support multpile.',
            'Add support of custom error handling, thx @Rayi.',
            'Fix fetching client IP contains ::.',
            'Add redis session, thx @snadn.',
            'Add support of jSmart template, thx @snadn.',
            'Fix error in MongoDB OverwriteModelError, thx @denvey.',
          ]
        }, {
          'version': '1.1.10', date: '2015.04.14', list: [
            'Fix UT reports errors in Node version >=0.12.',
            'Support group and subquery in Model countSelect method.',
          ]
        }, {
          'version': '1.1.9', date: '2015.03.25', list: [
            'Fix Model config default to {}, thx @Rayi.',
            'Fix <code>/resource/css</code> error.',
            'Upgrade dependency <code>websocket-driver</code> version to 0.5.3.',
          ]
        }, {
          'version': '1.1.8', date: '2015.03.13', list: [
            'Fix file naming issue.',
          ]
        }, {
          'version': '1.1.7', date: '2015.03.13', list: [
            'Forbid ip request to fetch IP list from database.',
            'Add timeout mechanism in CLI to avoid unstoppable tasks.',
          ]
        }, {
          'version': '1.1.6', date: '2015.01.19', list: [
            'Add auto-delete upload file feature, the config name is <code>post_file_autoremove</code> which defaults to open, you need to move it to other folder if you want to apply this.',
          ]
        }, {
          'version': '1.1.5', date: '2015.01.12', list: [
            'Sanitize GET/POST by applying a filter array named <code>C(\'filter_data\')</code>, default to enabled. (Note: strongly suggested to trun on this security feature).',
            'Auto validate the <code>addAll</code> method in Model.',
          ]
        }, {
          'version': '1.1.4', date: '2015.01.07', list: [
            'Change npm version 1.1.2 to 1.1.4.',
          ]
        }, {
          'version': '1.1.2', date: '2015.01.06', list: [
            'Fix _404Action can not complete normally if request is not the first time.',
          ]
        }, {
          'version': '1.1.1', date: '2014.12.24', list: [
            'Security improvement, to only get the first object if params is array, to avoid developer\'s improper operation produce security leak.',
          ]
        }, {
          'version': '1.1.0', date: '2014.11.20', list: [
            'Move gloabal implemenation to <code>thinkjs-util</code> module.',
            'Add RMDB data auto-validation support, <a href="/doc/model.html#自动校验">document</a>.',
            'Add basic support of MongoDB, <a href="/doc/model_mongo.html">document</a>.',
            'Support pass ip port when starting service.',
            'Add error handling for Controller download method, thx <a href="https://github.com/75team/thinkjs/commit/2b3f01f22a8d2dd7d319e3b3ad8dbac763576a0c">@snadn</a>.',
            'In debug mode, change the clear cache interval from 100ms to 500ms.',
          ]
        }, {
          'version': '1.0.7', date: '2014.11.10', list: [
            'Fix in CLI can\'t close database connection.',
            'Fix database rename does not take effect.',
            'Add support for swig template.',
            'Optimize getCallController performance.',
            'Can pass controller object to template.',
            'Can pass promise to template, see <a href="http://www.welefen.com/thinkjs-support-assign-promise-to-view.html">how to</a>.',
            'success method support define customize message.',
            'Fix can not fetch database query cache by S function.',
            'where condition add ignore value feature.',
          ]
        }, {
          'version': '1.0.6', date: '2014.11.03', list: [
            'Optimize the process to fix static resource access leak.',
            'Fix error D/M method not passing arguments.',
            'Fix if upload file to a non-existing folder produces error.',
            'System error now can map to different status code.',
          ]
        }, {
          'version': '1.0.5', date: '2014.10.29', list: [
            'Fix bug, in windows, access static resource bug can not access bug fix.',
          ]
        }, {
          'version': '1.0.4', date: '2014.10.29', list: [
            'Fix static resource accessing bug, see details <a href="http://www.w3ctech.com/topic/599">here</a>.',
          ]
        }, {
          'version': '1.0.3', date: '2014.10.27', list: [
            'Change the params order of Class method, put formal parameter before superClass.',
            'Fix _call a non-existing Controller action with params produces error.',
            'Fix undefined in Model where condition will be filtered out.',
            'Add host binding support on starting service.',
            'Static resource regex add support for robot.txt.',
          ]
        }, {
          'version': '1.0.2', date: '2014.10.20', list: [
            'Change page encoding from UTF8 to UTF-8 for IE.',
            'Fix if Model contains alias produces error on show columns.',
            'Add support for Model join on with table prefix.',
            'Add support for Model join SELECT with table prefix.',
            'Fix _404Action error.',
            'Add file upload path config post_file_upload_path, default to App/Runtime/Temp.',
          ]
        }, {
          'version': '1.0.1', date: '2014.10.09', list: [
            'Remove Array.prototype.sum extension.',
            'Fix Model query use lower case select produces error.',
            'Fix bug in FileSession rm method.',
          ]
        }, {
          'version': '1.0.0', date: '2014.09.22', list: [
            'ThinkJS release version 1.0, check <a href="http://www.w3ctech.com/topic/265">here</a>.',
          ]
        }
      ],
      'zh-cn': [
        {
          version: '2.2.1', date: '2016.03.30', list: [
          '修复创建项目时依赖的 ThinkJS 版本问题',
          '修复报错时路径丢失一层的问题',
        ]
        }, {
          version: '2.2.0', date: '2016.03.30', list: [
            '支持断点调试 ES2015+ 项目，详情见<a href="/doc/debug.html">这里</a>',
            '支持报错信息定位到 src/ 目录下',
            '修复国际化错误信息获取不到的问题',
            '移除从数据库里读取的字段默认值，修改特定默认值报错的问题',
            '修复一个文件多次编译错误导致错误信息无法清除的问题',
            '去除 retainLines 编译选项',
            '修复数据校验里 different 等规则验证错误的问题',
            '修复 File Session 有时候获取内容为空导致 Session 丢失的问题',
            '修复 addMany 方法返回值错误的问题',
            '修复数据校验里部分规则未填导致报错的问题',
            '修复 mongo 模型 aggregate 方法返回值错误的问题',
            '修复 afterDelete 方法不生效的问题',
            '修复 Relation Model 下 BELONG_TO 类型设置 fKey 无效的问题',
            '默认关闭 production 环境下的 log_sql',
            '修复 sum 等方法参数里含有表达式大致报错的问题',
            '修复 Mysql 下数据库编码不识别的问题',
            '修复 postgresql 下字段类型为布尔型导致报错的问题',
          ]
        }, {
          version: '2.1.8', date: '2016.03.15', list: [
            '修复 Mysql 多连接下 Connection already Released 的错误',
            '修复创建项目生成的部分路径错误的问题',
            '优化项目启动时检测模块环境',
            '修复 parseGroup 有表达式导致报错的时候',
            '调用不存在的 Action 时显示更详细的错误信息',
          ]
        }, {
          version: '2.1.7', date: '2016.03.01', list: [
            '修复没有处理 Promise 异常导致有错误信息的问题',
            '修复 ObjectID 为对象导致报错的问题',
            '修复模型中的 schema 默认值等处理不支持嵌套的问题',
            '添加 log_error 配置用于控制控制台下是否打印 500 错误日志',
          ]
        }, {
          version: '2.1.6', date: '2016.02.25', list: [
            '修复关联模型 add 时部分数据丢失导致关系表数据无法添加的问题',
            '修复数据表名含有关键字导致报错的问题',
            '修复模型 find 方法部分条件下导致不是查询一条数据的问题',
            '修复文件上传报错后请求不能正常结束的问题',
            '去除对 unhandledRejection 事件的监听',
            '修复 fetch 方法缺少 config 参数的问题',
          ]
        }, {
          version: '2.1.5', date: '2016.02.04', list: [
            '添加 think.datetime, think.isFileAsync, think.isDirAsync 方法',
            '优化上传的数据解析',
            '修复创建项目时，显示的项目命令可能不正确的问题',
            '修复 Mongo 返回的 ID 不是字符串的问题',
            '修复模板配置解析错误的问题',
          ]
        }, {
          version: '2.1.4', date: '2016.01.22', list: [
            '模型数据更新时支持默认值',
            '数据校验增加 trim 方式，自动 trim 校验的值',
            '服务启动时支持预加载，production 环境下默认开启',
            'nunjucks 模板使用异步方式渲染',
            '创建项目时支持生成 test/ 目录',
            '修复 windows 下不支持多级控制器的问题',
            '修复首次编译时获取项目类型错误的问题',
            '修复 addMany 方法报错的问题',
            '修复正则校验类型在数值为空时校验错误的问题',
            '修复 SQLite 连接的数据名不正确的问题',
          ]
        }, {
          version: '2.1.3', date: '2016.01.19', list: [
            '添加属性 think.isMaster',
            'Service 基类添加 model 方法',
            'think.base 基类添加 parseModuleFromPath 方法',
            '修复模型默认值解析错误的问题',
            '修复模型中 where 条件已经为字符串，再次添加条件报错的问题',
          ]
        }, {
          version: '2.1.2', date: '2016.01.15', list: [
            'TypeScript 下编译添加 --allowSyntheticDefaultImports 参数',
            '修复创建 TypeScript 项目时，文件后缀名不是 .ts 导致报错的问题',
          ]
        }, {
          version: '2.1.1', date: '2016.01.15', list: [
            '修复数据库配置前缀 prefix 不生效的问题',
            'Babel 编译时支持自定义的 presets 和 plugins',
            '修复多级控制器找不到的问题',
            '添加废弃方法 getTableFields，兼容之前的版本报错的问题',
            '修复 baseAssign 覆盖用户配置的问题',
            '修复缺少 think.RUNTIME_PATH 导致路径不正确的问题',
          ]
        }, {
          version: '2.1.0', date: '2016.01.14', list: [
            '支持 TypeScript，详情见<a href="/doc/typescript.html">这里</a>',
            '性能提升 90%，性能测试见<a href="/doc.html#toc-76a">这里</a>',
            'Controller 支持子目录的形式',
            '支持 PostgreSQL 数据库',
            'Model schema 支持默认值',
            'Hook 里的 middleware 返回 null 可以阻止后续的 middleware 执行',
            'http 和 controller 添加 display 的别名方法 render',
            '添加串行执行方法 think.waterfall',
            'Validate 支持正则',
            'fetch 支持传数据',
            'Logic 支持判断请求类型',
            '定时任务里支持直接调用 action',

            'Babel 升级到 6',
            '国际化语言对大小写不再敏感',
            '将获取模板文件内容改为异步',
            'http 对象不再继承自 EventEmitter 类',
            '去除 think.mode_mini 模式，controller 支持子目录',
            '数据库配置 name 改为 database',
            '修改现在的 fields 为 schema',
            '数据库配置 pwd 改为 password',


            '优化 http 对象生成方式，不用每次都复制',
            '过滤 .svn, .git 等隐藏类型的文件',
            '将文件 bin/index.js 移动为 src/command.js',
            'runtime 目录移动到项目根目录下，添加 think.RUNTIME_PATH 路径常量',
            'adapter type 增加自动转为小写的功能，并给出提示',
            '增加 thinkData，用于缓存系统常用数据',
            '合并 think.locale 和 controller.locale 方法',


            '修复 nunjucks 模板继承文件找不到的问题',
            '修复 pathname 里含有转义的 / 导致识别错误的问题',
            '修复 http.file 方法返回的数据遭到修改导致源数据也修改的问题',
            '修复路径中 / 在 windows 下需要替换为 \\ 的问题',
            '修复 nunjucks 下模板文件在不在根目录导致报错的问题',
            '修复 production 环境下，页面上可能输出敏感数据的问题',
            '修复 development 模式下，JSON 数据解析失败后没有报错信息不好定位的问题',
            '修复 view root_path 修改后，创建模块时视图路径没更新的问题',
            '修复 required|int 规则校验不正确的问题',
            '修复 redis cache 解析配置的问题',
            '修复 REST API 不支持 logic 的问题',
            '修复 count 方法如果传入字段名是关键字会出错的问题',
          ]
        }, {
          version: '2.0.16', date: '2016.01.08', list: [
            'think.parseConfig 方法支持 context',
          ]
        }, {
          version: '2.0.15', date: '2015.12.25', list: [
            '修复 nunjucks 模板 root_path 判断报错的问题',
          ]
        }, {
          version: '2.0.14', date: '2015.12.25', list: [
            'MongoDB 支持多 host 配置',
            '修复 nunjucks 模板设置 root_path 的问题',
            'development 模式下，解析 payload 数据出错后打印错误信息',
            'payload 数据使用 JSON 解析失败后，使用 querystring 解析',
          ]
        }, {
          version: '2.0.13', date: '2015.12.08', list: [
            '修复 think.parseConfig 含有 adapter 的问题',
            '修复 relation model 更新后不能关联更新的问题',
            '修复 countSelect 含有 alias 导致报错的问题',
            '修复文件更新后 bootstrap 没有自动清除并更新的问题',
            'nunjucks 默认开启 autoescape 的功能',
          ]
        }, {
          version: '2.0.12', date: '2015.12.02', list: [
            '修复 Windows 下文件编译后不能自动更新的问题',
          ]
        }, {
          version: '2.0.11', date: '2015.11.27', list: [
            '去除获取配置时将配置名转为小写的逻辑',
            '修复关联模型保存时的错误',
            '修复 SQLite 在关联模型下没有 unique 字段导致报错的问题',
            '修复 countSelect 时设置缓存导致结果异常的问题',
            '修复数据校验内容为空校验逻辑的问题',
            '修复 Session 操作没有等待完成返回导致没有保存的问题',
            '修复 think.parallelLimit 方法单条数据操作可能导致内存泄露的问题',
          ]
        }, {
          version: '2.0.10', date: '2015.11.20', list: [
            '数据校验格式支持对象',
            '修复创建 controller 文件时在普通模式下文件内容报错的问题',
            '支持使用 thinkjs -v 显示版本号',
            '使用 think.co 替换 think.co.wrap',
            '通过 action 方法调用其他 action 时，自动修改 module/controller/action',
            '入口文件支持配置 retainsFile',
            'jade 模板在 production 环境下支持编译缓存',
          ]
        }, {
          version: '2.0.9', date: '2015.11.15', list: [
            '修复路由更改不能自动更新的问题',
            '将 think.npm 安装路径更改到项目根目录下，并添加 --save 参数',
            '修复 count 为 0 调用 countSelect 方法报错的问题',
            '修复使用 db session 直接报错的问题',
            '修复 socket 启动很多连接的问题',
          ]
        }, {
          version: '2.0.8', date: '2015.11.14', list: [
            '修复模板文件修改后不能自动更新的问题',
            '修复创建项目时 package.json 依赖缺失的问题',
            '修复自动编译时获取项目模式错误的问题',
            '修复 nunjucks 模板引擎下设置模板根目录错误的问题',
            '修复使用 Babel 编译后在部分平台下调用 module._load 方法报错的问题',
          ]
        }, {
          version: '2.0.7', date: '2015.11.13', list: [
            '去除 view 配置 options 选项，使用 adapter 配置',
            '加载 bootstrap 下文件时，去除非 js 文件',
            '项目启动时增加是否安装依赖的检测',
            '去除静态资源请求的访问日志',
            '添加 think.camelCase 方法',
            '配置文件支持自定义解析，添加 think.parseConfig 方法',
            '当输出 Promise 时直接显示错误页面',
            '修复 Babel 编译偶尔报错的问题',
            '文件编译有错误时，访问 URL 直接显示编译错误信息',

            '文件编译时如果源文件已经删除，自动删除编译后的文件',
            '修复 mini 和 normal 模块下不能加载 bootstrap 文件的问题',
            '修复 file session 偶尔报错的问题',
            '修复基类文件修改，子类文件有的不能清除缓存的问题',
          ]
        }, {
          version: '2.0.6', date: '2015.11.08', list: [
            'URL 解析后的 Action 支持含有 - 字符',
            '添加 think.mergeConfig 方法，自动合并 adapter 参数',
            'Cache，Session 等配置支持 adapter 额外配置',
            '添加 think.pallelLimit 方法，处理并发限制',
            '添加自动编译机制，去除 npm run watch-compile 命令',
            '增加检测部分配置只能设置在 common 模块下的功能',
            '配置支持 parser 方法，Redis、Memcache 支持分布式配置',
            '添加基类 think.adapter.base，所有 Adapter 都继承该类',
            '去除视图里的 options 配置，使用 adapter 配置替代',
            '修复基类文件修改导致父级没有自动更新的问题',
            '修复使用第三方 middleware 解析 payload 导致后续无法执行的问题',
            '修复文件名含有特殊字符但错误信息是不能含有大写字母的问题',
            '修复文件 Session 有时候报错的问题',
            '修复 URL 中含有中文字符导致资源不能访问的问题',
            '修复静态资源请求含有 Range 头信息没有正常处理的问题',
          ]
        }, {
          version: '2.0.5', date: '2015.11.02', list: [

            '优化 Logic 规则校验失败后发送错误信息的数据结构',
            '创建项目时，将 bootstrap/hook.js 改名为 bootstrap/middleware.js',
            '创建项目时，添加文件 config/hook.js',
            'Babel 编译添加 --retain-lines 参数，保持编译后的文件行号和原始文件相同',
            '添加查询条件里 MongoID 为字符串时自动转为 MongoID 对象的功能',
            '模型 update 方法增加了检验 where 条件的功能',
            '移除系统内置的 deny_ip middleware，独立为 think-ip-filter middleware',
            '模板渲染前添加 prerender 钩子的功能',
            'thinkjs 命令添加了创建 plugin 的功能',
            '添加 view_filter hook',
            '修复 Logic 规则含有空格导致报错的问题',
            '修复新增文件没有自动更新的问题',
            '修复 think.cache 指定类型失败的问题',
            '修复 file Session 偶尔报错的问题',
            '修复 producition 和 testing 项目环境下命令行执行不能自动结束的问题',
            '注：2.0 发布时遇到一些小问题，所以紧急发布了一些版本',
          ]
        }, {
          version: '2.0.0', date: '2015.10.30', list: [
            '可以使用 ES6/7 全部特性来开发项目',
            '支持多种项目结构和多种项目环境',
            '支持丰富的数据库，如：Mysql，MongoDB，SQLite',
            '代码自动更新，无需重启 Node 服务',
            '支持多种 WebSocket 库，如：socket.io，sockjs',
            '支持 Memory，File，Db，Redis 等多种 Session',
            '支持 Memory，File，Redis，Memcache 等多种 Cache',
            '支持 ejs，jade，swig，numjucks 等多种模版引擎',
            '支持切面编程，支持 __before，__after 等魔术方法',
            '支持自定义多种错误页面，如：400，404，500，503',
            '支持命令行调用和执行定时任务',
            '丰富的 Hook 和 Middleware',
            '详细的日志，如：请求日志、错误日志、性能日志',
            '自动创建 REST API',
            '支持国际化和多主题',
            '丰富的测试用例，1500+ 测试用里，代码覆盖率 > 95%',
          ]
        }, {
          version: '1.2.10', date: '2015.09.17', list: [
            '修复 Memcache 中传输内容含有 end 导致截断的问题',
            '修复 countSelect 方法中使用 alias 导致 SQL 报错的问题',
          ]
        }, {
          version: '1.2.9', date: '2015.07.30', list: [
            '修复 Windows 下变成反斜杠导致 URL 无法识别的问题',
          ]
        }, {
          version: '1.2.8', date: '2015.07.29', list: [
            '修复静态资源访问的漏洞',
          ]
        }, {
          version: '1.2.7', date: '2015.07.15', list: [
            '修复 Memcache 不能使用远程 host 的问题',
            '修复 Memcache 部分方法参数错误的问题',
            'DbSession 功能的字段 key 改为 cookie，防止创建数据表报错的问题',
          ]
        }, {
          version: '1.2.6', date: '2015.07.07', list: [
            'jade 模版增加自定义配置的功能',
          ]
        }, {
          version: '1.2.5', date: '2015.06.24', list: [
            '修复 WebSocket 中传递的数据数字转为字符串的问题',
            '修复 post 值为 null 导致判断报错的问题',
          ]
        }, {
          version: '1.2.4', date: '2015.05.29', list: [
            'Controller 不再强制改为首字母大写，后面都小写。 fix <a href="https://github.com/75team/thinkjs/issues/166">#166</a>',
          ]
        }, {
          version: '1.2.3', date: '2015.05.18', list: [
            '修复 redis 设置超时无效的问题。thx @snadn',
            '修复 debug 模式下，App.sendError 方法报错的问题。thx @Zongmin lei',
            '修复高级模型下数据表有下划线导致关联字段错误的问题',
          ]
        }, {
          version: '1.2.2', date: '2015.04.29', list: [
            '修复引用 MongoDb 首字母小写的问题, thx @denvey',
            'websocket 添加 timeout 参数，默认为 0（不自动断开）',
            '修复恶意文件上传引起 Temp 目录有文件的问题',
            '注：npm 发布有问题，跳过 1.2.1 版本',
          ]
        }, {
          version: '1.2.0', date: '2015.04.21', list: [
            '修复文件上传不支持 multpile 的情况',
            '添加自定义错误处理方式, thx @Rayi',
            '修复获取用户端 IP 含有 :: 的情况',
            '添加 redis session, thx @snadn',
            '添加对 jSmart 模版的支持, thx @snadn',
            '修复 MongoDB 里 OverwriteModelError 的错误, thx @denvey',
          ]
        }, {
          version: '1.1.10', date: '2015.04.14', list: [
            '修复单元测试在 Node 版本 >=0.12 报错的问题',
            'Model 里 countSelect 方法支持 group 和子查询',
          ]
        }, {
          version: '1.1.9', date: '2015.03.25', list: [
            '修改 Model 的 config 默认值为 {}, thx @Rayi',
            '修复 <code>/resource/css</code> 访问报错的问题',
            '依赖模块 <code>websocket-driver</code> 版本升级到 0.5.3',
          ]
        }, {
          version: '1.1.8', date: '2015.03.13', list: [
            '修复文件名大小写的问题',
          ]
        }, {
          version: '1.1.7', date: '2015.03.13', list: [
            '禁止ip访问支持从数据库里获取 IP 列表',
            '命令行模式下增加超时的机制，避免执行结束不掉的情况',
          ]
        }, {
          version: '1.1.6', date: '2015.01.19', list: [
            '添加自动删除上传的文件功能，配置为：<code>post_file_autoremove</code>，默认开启。如果项目里要使用，需要移动到其他目录。',
          ]
        }, {
          version: '1.1.5', date: '2015.01.12', list: [
            '对 GET/POST 提交的数据进行过滤，去除值为数组。<code>C(\'filter_data\')</code>，默认开启。（注：该功能为安全过滤，强烈建议开启）',
            '对模型中的 <code>addAll</code> 方法添加数据自动校验的支持。',
          ]
        }, {
          version: '1.1.4', date: '2015.01.07', list: [
            '由于 npm 发布的问题，版本从 1.1.2 跳到 1.1.4。',
          ]
        }, {
          version: '1.1.2', date: '2015.01.06', list: [
            '修复 _404Action 非第一次访问不能正常结束请求的问题。',
          ]
        }, {
          version: '1.1.1', date: '2014.12.24', list: [
            '请求参数值为数组时，只取数组的第一个值。避免开发者在进行数据库查询时，操作不当导致有安全漏洞。',
          ]
        }, {
          version: '1.1.0', date: '2014.11.20', list: [
            '将全局函数的实现代码移到 <code>thinkjs-util</code>模块',
            '关系数据库增加对数据自动校验的支持，<a href="/doc/model.html#自动校验">文档</a>',
            '添加对 MongoDB 的简单支持，<a href="/doc/model_mongo.html">文档</a>',
            '启动服务时，添加对自定义端口的支持',
            'Controller 里的 download 方法添加异常处理，thx <a href="https://github.com/75team/thinkjs/commit/2b3f01f22a8d2dd7d319e3b3ad8dbac763576a0c">@snadn</a>',
            'debug 模式下，清除缓存的时间间隔由 100ms 改为 500ms',
          ]
        }, {
          version: '1.0.7', date: '2014.11.10', list: [
            '修复命令行模式下不能关闭数据库连接的问题',
            '修复自定义数据库名不能生效的问题',
            '添加对 swig 模版的支持',
            '优化 getCallController 的性能',
            '将 controller 对象赋值到模版中',
            '可以直接将 promise assign 到模版中，具体见<a href="http://www.welefen.com/thinkjs-support-assign-promise-to-view.html">这里</a>',
            'success 方法添加自定义 message 的功能',
            '修复数据库查询缓存无法通过 S 函数读取的问题',
            'where 条件添加 ignore value 的功能',
          ]
        }, {
          version: '1.0.6', date: '2014.11.03', list: [
            '优化静态资源访问漏洞的修复方式',
            '修复了 D/M 函数不带参数报错的问题',
            '修复了上传文件时，如果上传目录不存在报错的问题',
            '优化系统错误时，状态码可以配置',
          ]
        }, {
          version: '1.0.5', date: '2014.10.29', list: [
            '静态资源访问漏洞修复方式在 Windows 下有问题',
          ]
        }, {
          version: '1.0.4', date: '2014.10.29', list: [
            '修复了静态资源访问漏洞，具体见<a href="http://www.w3ctech.com/topic/599">这里</a>',
          ]
        }, {
          version: '1.0.3', date: '2014.10.27', list: [
            '修改 Class 函数的参数顺序，将形参 superClass 放在前面',
            '修复 Controller 里的 action 不存在，但有 _call 获取参数报错的问题',
            '修复 Model where 条件值为 undefined 被自动过滤掉的问题',
            '启动服务时，添加对绑定 host 的支持',
            '静态资源正则添加对 robot.txt 的支持',
          ]
        }, {
          version: '1.0.2', date: '2014.10.20', list: [
            '将页面默认编码由 UTF8 改为 UTF-8（修复 IE 部分版本下对 UTF8 不能正常识别的问题）',
            '修复 Model 里含有 alias 导致 show columns 报错的问题',
            '增加对 Model join 方法里 on 含有表名的支持',
            '增加对 Model join 方法里 table 为 SELECT 语句的支持',
            '修复 _404Action 报错的问题',
            '增加文件上传路径配置 post_file_upload_path，默认为 App/Runtime/Temp 目录',
          ]
        }, {
          version: '1.0.1', date: '2014.10.09', list: [
            '去除 Array.prototype.sum 扩展',
            '修复 Model query 方法 SELECT 不是大写导致解析错误的问题',
            '修复 FileSession rm 方法的问题',
          ]
        }, {
          version: '1.0.0', date: '2014.09.22', list: [
            'ThinkJS 震撼发布 1.0 版本，详情见<a href="http://www.w3ctech.com/topic/265">这里</a>',
          ]
        }]
    };
    this.assign('histories', histories[this.lang()]);
    return this.display();
  }

  /**
   * demo list
   * @return {} []
   */
  demoAction() {
    this.assign('currentNav', 'demo');
    this.assign('title', this.locale('title-demo'));
    //this.assign('hasBootstrap', true);
    return this.display();
  }

  /**
   * plugin page
   * @return {[type]} [description]
   */
  pluginAction() {
    this.assign('currentNav', 'plugin');
    this.assign('title', this.locale('title-plugin'));
    //this.assign('hasBootstrap', true);
    return this.display();
  }

  /**
   * donate page
   * @return {[type]} [description]
   */
  donateAction() {
    this.lang('zh-cn', true);
    this.assign('currentNav', 'donate');
    this.assign('title', this.locale('title-donate'));
    return this.display();
  }

  /**
   * about page
   * @return {} []
   */
  aboutAction() {
    this.lang('zh-cn', true);
    this.assign('title', this.locale('title-about'));
    return this.display();
  }

  /**
   * spending page
   * @return {}
   */
  spendingAction() {
    this.lang('zh-cn', true);
    this.assign('title', this.locale('title-spending'));
    return this.display();
  }

  /**
   * event
   * @return {}
   */
  eventAction() {
    this.lang('zh-cn', true);
    this.assign('title', this.locale('title-event'));
    return this.display();
  }
}