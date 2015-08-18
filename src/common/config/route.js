export default [
  [/^changelog/, 'index/changelog'],
  [/^doc(?:\/([\d\.\x]+))?(?:\/(.*))?$/i, "doc/index?doc=:2&version=:1"]
];