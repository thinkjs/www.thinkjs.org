import fs from 'fs';

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
  let pos = http.pathname.indexOf('/');
  let prefix = http.pathname;
  if(pos > -1){
    prefix = http.pathname.substr(0, pos);
  }
  prefix = prefix.toLowerCase();

  let support = think.config('locale.support');
  let lang = http.lang();

  let flag = support.some(item => {
    if(item.toLowerCase() === prefix){
      lang = item;
      return true;
    }
  });
  if(flag){
    http.pathname = http.pathname.substr(prefix.length + 1);
  }
  
  if(support.indexOf(lang) === -1){
    lang = http.config('locale.default');
  }
  http.lang(lang);
});


think.middleware('replace_image', (http, content) => {
  let accept = http.header('accept');
  if(accept.indexOf('image/webp') === -1){
    return content;
  }
  return content.replace(/http:\/\/p(\d)\.qhimg\.com\/(\w+)\.(\w+)/g, (a, b, c, d) => {
    return `http://p${b}.qhimg.com/${c}.webp`;
  });
});