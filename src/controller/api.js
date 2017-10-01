import path from 'path';
import {exec} from 'child_process';
import Base from './base';

export default class extends Base {
  updateAction() {
    exec(
      'sh ' + path.join(think.ROOT_PATH, 'bin/update.sh'),
      (err, stdout, stderr) => {
        console.log(err || stdout || stderr);
      }
    );
    return this.success();
  }
}