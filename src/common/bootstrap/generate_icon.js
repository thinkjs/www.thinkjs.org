/**
 * generate icon on home page
 */

import crontab from 'node-crontab';
import superagent from 'superagent';
import fs from 'fs';

let iconList = {
  "star": "https://img.shields.io/github/stars/75team/thinkjs.svg?style=social&label=Star",
  "version": "https://img.shields.io/npm/v/thinkjs.svg?style=flat-square",
  "build": "https://img.shields.io/travis/75team/thinkjs.svg?style=flat-square",
  "coverage": "https://img.shields.io/coveralls/75team/thinkjs.svg?style=flat-square"
};

let fn = () => {
  think.log('icon job', 'CRONTAB');
  for(let type in iconList){
    let url = iconList[type];
    let filePath = `${think.RESOURCE_PATH}/static/other/icon/${type}.svg`;
    let bakFilePath = `${filePath}.bak`;
    let stream = fs.createWriteStream(bakFilePath);
    let req = superagent.get(url);
    req.pipe(stream);
    req.on('end', () => {
      fs.renameSync(bakFilePath, filePath);
    })
  }
};

fn();

let jobId = crontab.scheduleJob('0 */1 * * *', fn);