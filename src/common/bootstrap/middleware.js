import fs from 'fs';
import path from 'path';

//get support locales list
let viewPath = think.ROOT_PATH + '/view';
let dirnames = fs.readdirSync(viewPath);
think.config('locale.support', dirnames);

/**
 * get lang form http pathname
 * @param  {Object} http []
 * @return {}      []
 */
think.middleware('get_lang', http => {
  let supportLangs = think.config('locale.support');
  let lang = http.pathname.split('/')[0];

  let cookieName = http.config('locale').cookie_name;
  let cookieValue = http.cookie(cookieName);

  if(supportLangs.indexOf(lang) > -1){
    http.pathname = http.pathname.substr(lang.length + 1);
    if(lang !== cookieValue){
      http.cookie(cookieName, lang, {timeout: 365 * 24 * 3600});
    }
  }else{
    lang = http.lang().toLowerCase();
    if(supportLangs.indexOf(lang) === -1){
      lang = http.config('locale.default');
    }
  }
  http.lang(lang, true);
});


think.middleware('replace_image', (http, content) => {
  let accept = http.header('accept');
  if(accept.indexOf('image/webp') === -1){
    return content;
  }
  return content.replace(/http:\/\/p(\d)\.qhimg\.com\/(\w+)\.(\w+)/g, (a, b, c, d) => {
    return `http://p${b}.qhimg.com/${c}.webp`;
  }).replace(/https:\/\/p\.ssl\.qhimg\.com\/(\w+)\.(\w+)/g, (a, b) => {
    return `https://p.ssl.qhimg.com/${b}.webp`;
  });
});
/**
 * log request
 * @param  {[type]} http [description]
 * @return {[type]}      [description]
 */
think.middleware('log_request', http => {
  let userAgent = http.userAgent();
  let blackList = ['http://', 'https://', 'jiankongbao', 'yunjiankong'];
  let flag = blackList.some(item => {
    return userAgent.indexOf(item) > -1;
  });
  if(flag){
    return;
  }

  let ip = http.ip();
  let log = `[${think.datetime()}] - ${ip} - "${http.url}" - "${userAgent}"`;
  let logPath = think.RUNTIME_PATH + '/log/' + think.datetime(new Date, 'YYYY-MM-DD') + '.log';
  think.mkdir(path.dirname(logPath));
  fs.appendFile(logPath, log + '\n', () => {});
});