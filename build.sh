#!/bin/sh

rm -rf output;
mkdir output;

rm -rf view_build/;
mkdir view_build;
cp -r view/* view_build;

node www/production.js home/generate/single;
node www/production.js home/generate/html;

DEBUG=pluginMatchedFiles,pluginTotalTime node stc.config.js;

rm -rf view_build;
cd output;
mv view_build view;
cd ..;

cp www/*.ico output/www/;
cp www/*.js output/www/;
cp package.json output/;
cp nginx.conf output/;
cp pm2.json output/;
cp renew_cert.sh output/;
cp -r www/static/module/thinkjs output/www/static/module/

npm run compile;
cp -r app output/;
cp -r ssl output/;

cd output;
rm -rf www/static/other/icon/*;
tar zcf ../output.tar.gz *;
