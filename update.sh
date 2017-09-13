#!/bin/sh
cd /home/welefen/git/www.thinkjs.org;
git pull;
cd view/zh-cn/doc;
git pull origin master;
cd ../../../;
cd view/en/doc;
git pull origin master;
cd ../../../;
npm i;
sh build.sh
cd output;
cp -r * /home/welefen/www/www.thinkjs.org/;
cd /home/welefen/www/www.thinkjs.org/;
#pm2 restart pm2.json;
