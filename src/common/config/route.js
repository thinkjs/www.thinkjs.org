export default [
  [/^changelog/, 'index/changelog'],
  [/^demo/, 'index/demo'],
  [/^plugin/, 'index/plugin'],
  [/^donate/, 'index/donate'],
  [/^about/, 'index/about'],
  [/^spending/, 'index/spending'],  
  [/^event/, 'index/event'],

  [/^doc(?:\/([\d\.\x]+))?\/search$/i, "doc/search?version=:1"],
  [/^doc(?:\/([\d\.\x]+))?\/single$/i, "doc/single?version=:1"],
  [/^doc(?:\/([\d\.\x]+))?(?:\/(.*))?$/i, "doc/index?doc=:2&version=:1"]
];