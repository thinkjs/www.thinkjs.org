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
#path=$(pwd);
/usr/local/bin/php $STC_PATH/index.php ${path} test $1;
if [ -f ${path}"/stc.error.log" ]; then
    rm -rf ${path}"/stc.error.log";
    exit 1;
fi

cp www/*.ico output/www/;
cp www/*.js output/www/;
cp package.json output/;
cp nginx.conf output/;
cp -r www/static/module/thinkjs output/www/static/module/

npm run compile;
cp -r app output/;

cd output;
tar zcvf ../output.tar.gz *;
cd ..

scp -r output.tar.gz qiwoo@101.198.153.219:~;
ssh qiwoo@101.198.153.219 "tar zxvfm ~/output.tar.gz -C /home/qiwoo/www/new.thinkjs.org;rm -rf ~/output.tar.gz;pm2 restart new.thinkjs.org";
