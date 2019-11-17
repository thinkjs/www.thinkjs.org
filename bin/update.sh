#!/bin/sh
echo 'run submodule update'
rm -rf view/zh-cn/doc
rm -rf view/en/doc
git clone https://github.com/thinkjs/cn.thinkjs.org view/zh-cn/doc
git clone https://github.com/thinkjs/en.thinkjs.org view/en/doc