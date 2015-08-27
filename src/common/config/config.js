export default {
  port: 7777,
  cluster_on: false,
  locale: { //i18n
    name: 'think_locale',
    default: 'zh-CN'
  },
  tpl: {
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '_',
    root_path: think.ROOT_PATH + '/view',
    theme: '',
    type: 'ejs',
    options: {}
  }
}