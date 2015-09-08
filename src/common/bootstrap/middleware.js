think.middleware('replace_image', (http, content) => {
  let accept = http.header('accept');
  if(accept.indexOf('image/webp') === -1){
    return content;
  }
  return content.replace(/http:\/\/p(\d)\.qhimg\.com\/(\w+)\.(\w+)/g, (a, b, c, d) => {
    return `http://p${b}.qhimg.com/${c}.webp`;
  });
})