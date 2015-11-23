#!/bin/sh
#STC_PATH="/home/q/php/STC"
STC_PATH="/Users/welefen/Develop/git/stc/src"
path=`dirname $0`;
first=${path:0:1};
if [[ $first != '/' ]];then
    path=$(pwd);
fi

if [ -d ${path}"/output" ];then
	rm -rf ${path}"/output";
fi
mkdir ${path}"/output";
if [ ! -f ${path}"/config.php" ];then
	cp $STC_PATH/config/config.php ${path};
fi


rm -rf www/static/other/icon/*.bak;

if [ -d "view_build" ];then
  rm -rf view_build/;
fi

mkdir view_build;
cp -r view/* view_build;

node www/production.js home/generate/single;
node www/production.js home/generate/html;


#path=$(pwd);
/usr/local/bin/php $STC_PATH/index.php ${path} test $1;
if [ -f ${path}"/stc.error.log" ]; then
    rm -rf ${path}"/stc.error.log";
    #exit 1;
fi

rm -rf view_build;
cd output;
mv view_build view;
cd ..;

cp www/*.ico output/www/;
cp www/*.js output/www/;
cp package.json output/;
cp nginx.conf output/;
#cp pm2.json output/;
cp -r www/static/module/thinkjs output/www/static/module/

npm run compile;
cp -r app output/;
cp -r ssl output/;

cd output;
#rm -rf www/static/other/icon/*

tar zcvf ../output.tar.gz *;
cd ..



scp -r output.tar.gz qiwoo@101.198.153.219:~;
ssh qiwoo@101.198.153.219 "tar zxvfm ~/output.tar.gz -C /home/qiwoo/www/www.thinkjs.org;rm -rf ~/output.tar.gz;cd /home/qiwoo/www/www.thinkjs.org;pm2 startOrReload pm2.json";

proxychains4 scp -r output.tar.gz welefen@www.welefen.com:~;
proxychains4 ssh welefen@www.welefen.com "tar zxvfm ~/output.tar.gz -C /home/welefen/www/www.thinkjs.org;rm -rf ~/output.tar.gz;cd /home/welefen/www/www.thinkjs.org;pm2 startOrReload pm2.json";

#sleep 2;

#wget https://www.thinkjs.org/doc.html;
#rm -rf doc.html*;
