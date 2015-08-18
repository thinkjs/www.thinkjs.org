'use strict';

import fs from 'fs';

//get support locales list
let viewPath = think.ROOT_PATH + '/view';
let dirnames = fs.readdirSync(viewPath);
think.config('locale.support', dirnames);

/**
 * get locale form http pathname
 * @param  {Object} http []
 * @return {}      []
 */
think.middleware('get_locale', http => {
  let pos = http.pathname.indexOf('/');
  let prefix = http.pathname;
  if(pos > -1){
    prefix = http.pathname.substr(0, pos);
  }
  prefix = prefix.toLowerCase();

  let support = think.config('locale.support');
  let lang;
  let flag = support.some(item => {
    if(item.toLowerCase() === prefix){
      lang = item;
      return true;
    }
  });
  if(flag){
    http._lang = lang;
    http.pathname = http.pathname.substr(prefix.length + 1);
  }
});

think.hook('route_parse', 'get_locale', 'prepend');

