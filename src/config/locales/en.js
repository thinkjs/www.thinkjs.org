module.exports = {
  localeId: 'en',
  numeralFormat: {
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function(number) {
      var b = number % 10;
      return (~~(number % 100 / 10) === 1) ? 'th'
        : (b === 1) ? 'st'
          : (b === 2) ? 'nd'
            : (b === 3) ? 'rd' : 'th';
    },
    currency: {
      symbol: '$'
    },
    formats: [ // 定义缩写
      {name: 'currency', format: '$ 0,0[.]00'}
    ]
  },
  translation: {
    'messages': {
      '': {
        'domain': 'messages',
        'lang': 'en',
        'plural_forms': 'nplurals=2; plural=(n != 1);'
      },
      'some key': ['some key'],
      'title-home': ['ThinkJS - use full ES6/7 features to develop Node.js applications, support TypeScript'],
      'title-changelog': 'Changelog - ThinkJS',
      'title-doc-suffix': ' - ThinkJS Documentation',
      'title-demo': 'Demo - ThinkJS',
      'title-plugin': 'Plugin - ThinkJS',
      'title-donate': 'Donate - ThinkJS',
      'title-about': 'About - ThinkJS',
      'title-spending': 'Spending - ThinkJS',
      'title-event': 'Events - ThinkJS',
      'download-pdf': 'Download PDF',
      'view-on-single-page': 'View on single page',
      'all-doc': 'All documentation',
      'back2top': 'Back to top'
    },
    'setting': {
      '': {
        'domain': 'setting',
        'lang': 'en',
        'plural_forms': 'nplurals=2; plural=(n != 1);'
      },
      'some key': ['some key in setting domain']
    }
  }
};
