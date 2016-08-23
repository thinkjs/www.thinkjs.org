var stc = require('stc');
var htmlCompress = require('stc-html-compress');
var uglify = require('stc-uglify');
var cssCompress = require('stc-css-compress');
var cdn = require('stc-cdn');
var cdnAdapter = require('@q/stc-cdn-qstatic');
var localstorage = require('stc-localstorage');
var localstorageAdapter = require('stc-localstorage-ejs');

stc.config({
  product: 'thinkjs',
  include: ['www/static', 'view_build'],
  exclude: [/\.bak$/],
  tpl: {
    engine: 'ejs',
    ld: ['<%'],
    rd: ['%>'],
  }
});

stc.workflow({
  uglify: {plugin: uglify},
  cssCompress: {
    plugin: cssCompress,
    exclude: [/\.min\./]
  },
  htmlCompress: {plugin: htmlCompress},
  localstorage: {
    include: [{type: 'tpl'}],
    exclude: [/\/doc\//],
    plugin: localstorage,
    options: {
      adapter: localstorageAdapter,
      minLength : 200,
      appId : 'd0ac6c56'
    }
  },
  cdn: {
    plugin: cdn, 
    exclude: [/\/doc\//],
    options: {
      adapter: cdnAdapter, 
      https: true,
      exclude: [/other\/icon/]
    }
  }
});

stc.start();