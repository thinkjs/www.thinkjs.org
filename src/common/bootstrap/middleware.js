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