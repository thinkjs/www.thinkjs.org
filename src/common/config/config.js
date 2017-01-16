export default {
  host: '127.0.0.1',
  port: 7777,
  //cluster_on: true,
  

  locale: { //i18n
    name: 'think_locale',
    // default: 'zh-CN'
    default: 'en'
  },
  view: {
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '_',
    root_path: think.ROOT_PATH + '/view',
    theme: '',
    type: 'ejs'
  }
}