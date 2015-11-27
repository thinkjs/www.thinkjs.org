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

  if(supportLangs.indexOf(lang) > -1){
    http.pathname = http.pathname.substr(lang.length + 1);
  }else{
    lang = http.lang();
    if(supportLangs.indexOf(lang) === -1){
      lang = http.config('locale.default');
    }
  }
  http.lang(lang, true);

  //set lang cookie
  let name = http.config('locale').cookie_name;
  let value = http.cookie(name);
  if(value !== lang){
    http.cookie(name, lang, {timeout: 365 * 24 * 3600});
  }
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
  let fn = d => {
    return ('0' + d).slice(-2);
  };

  let d = new Date();
  let date = `${d.getFullYear()}-${fn(d.getMonth() + 1)}-${fn(d.getDate())}`;
  let time = `${fn(d.getHours())}:${fn(d.getMinutes())}:${fn(d.getSeconds())}`;

  let ip = http.ip();
  let log = `[${date} ${time}] - ${ip} - "${http.url}" - "${http.userAgent()}"`;
  let logPath = think.getPath('common', 'runtime') + '/log/' + date + '.log';
  think.mkdir(path.dirname(logPath));
  fs.appendFile(logPath, log + '\n', () => {});
});