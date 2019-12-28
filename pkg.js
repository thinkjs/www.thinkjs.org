const path = require('path');
const Application = require('thinkjs');

const instance = new Application({
  ROOT_PATH: __dirname,
  RUNTIME_PATH: path.join(process.cwd(), 'runtime'),
  proxy: true, // use proxy
  env: 'pkg'
});

instance.run();
