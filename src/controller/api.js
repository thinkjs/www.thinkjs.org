const path = require('path');
const { exec } = require('child_process');
const Base = require('./base');

module.exports = class extends Base {
  updateAction() {
    exec(
      'sh ' + path.join(think.ROOT_PATH, 'bin/update.sh'),
      (err, stdout, stderr) => {
        think.logger.error(err || stdout || stderr);
      }
    );
    return this.success();
  }
};
