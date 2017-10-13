import path from 'path';
import {exec} from 'child_process';
import Base from './base';

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
