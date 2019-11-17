const path = require('path');
const isDev = think.env === 'development';
const isNow = think.env === 'now';

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev || isNow,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: () => {
      return (ctx, next) => {
        const supportLangs = think.config('locale.support');
        const lang = ctx.path.split('/')[1]; // 从 URL 中获取语言
        if (supportLangs.indexOf(lang) > -1) {
          ctx.path = ctx.path.substring(lang.length + 1);
          ctx.lang = lang;
        } else {
          ctx.lang = 'zh-cn';
        }
        return next();
      };
    }
  },
  {
    handle: 'router',
    options: {
      suffix: ['.html']
    }
  },
  'logic',
  'controller'
];
