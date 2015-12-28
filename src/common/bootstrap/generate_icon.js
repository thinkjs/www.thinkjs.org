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
  let keys = Object.keys(iconList);
  keys.forEach(type => {
    let url = iconList[type];
    let filePath = `${think.RESOURCE_PATH}/static/other/icon/${type}.svg`;
    let bakFilePath = `${filePath}.bak`;
    let stream = fs.createWriteStream(bakFilePath);
    let req = superagent.get(url).timeout(5000);
    req.pipe(stream);
    req.on('end', () => {
      if(!think.isFile(bakFilePath)){
        return;
      }
      let content = fs.readFileSync(bakFilePath, 'utf8').trim();
      if(content.indexOf('<svg xmlns') === 0){
        fs.renameSync(bakFilePath, filePath);
        console.log('sync ' + type + ' success');
        console.log(bakFilePath, filePath);
      }else{
        fs.unlinkSync(bakFilePath);
      }
    })
    req.on('error', () => {
      if(think.isFile(bakFilePath)){
        fs.unlinkSync(bakFilePath);
      }
    })
  });
};

if(think.env === 'production' && !think.cli){
  fn();
  let jobId = crontab.scheduleJob('0 */1 * * *', fn);
}
