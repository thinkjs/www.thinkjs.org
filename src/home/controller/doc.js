'use strict';

import fs from 'fs';
import path from 'path';
import marked from "marked";
import markToc from "marked-toc";
import uslug from 'uslug';
import pangunode from 'pangunode';
import child_process from 'child_process';

import base from './base.js';

export default class extends base {
  /**
   * get sidebar json
   * @return {} []
   */
  getSideBar(){
    let lang = this.config('tpl.lang');
    let version = this.get('version');
    let key = `sidebar_${lang}_${version}`;
    let data = thinkCache(thinkCache.APP, key);
    if(!data){
      let filePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/sidebar.json`;
      let content = fs.readFileSync(filePath);
      data = JSON.parse(content);
      thinkCache(thinkCache.APP, key, data);
    }
    this.assign('sidebar', data);
    this.assign('lang', lang);
    this.assign('version', version);
  }
  /**
   * get doc content
   * @return {} []
   */
  async getDoc(){
    let doc = this.get('doc');

    let lang = this.config('tpl.lang');
    let version = this.get('version');

    let filePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/${doc}.md`;
    if(doc === 'single'){
      filePath = `${think.RESOURCE_PATH}/static/module/thinkjs/thinkjs_${lang}_${version}.md`;
    }

    if(!think.isFile(filePath)){
      return Promise.reject(new Error(`${doc} is not exist`));
    }
    let fn = think.promisify(fs.readFile, fs);
    let content = await fn(filePath, 'utf8');
    let tocContent = marked(markToc(content));
    let markedContent = marked(content).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
      let id = uslug(c, {allowedChars: '-'});
      return `<h${b} id="${id}">${c}</h${b}>`;
    });
    markedContent = markedContent.replace(/<h(\d)[^<>]*>([^<>]+)<\/h\1>/, (a, b, c) => {
      this.assign('title', `${c}${this.locale("title-doc-suffix")}`);
      return `${a}<div class="toc">${tocContent}</div>`;
    });

    this.assign('markedContent', markedContent);
    this.assign('doc', doc);
  }
  /**
   * doc
   * @return {} []
   */
  async indexAction(){
    this.assign('currentNav', 'doc');
    this.assign('hasBootstrap', true);
    this.assign('hasVersion', true);
    this.getSideBar();

    await this.getDoc();

    this.display('doc/index');
  }
  /**
   * generate single doc file
   * @return {} []
   */
  generateSingleDoc(){
    let lang = this.config('tpl.lang');
    let version = this.get('version');
    let filePath = `${think.RESOURCE_PATH}/static/module/thinkjs/thinkjs_${lang}_${version}.md`;
    think.mkdir(path.dirname(filePath));

    this.getSideBar();
    let data = this.assign('sidebar');
    let doc = ['# ThinkJS ' + version + ' Documentation'];
    for(let type in data){
      doc.push(`# ${type}`);
      for(let name in data[type]){
        let docFilePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/${data[type][name]}.md`;
        let content = fs.readFileSync(docFilePath, 'utf8');
        doc.push(content);
      }
    }
    doc = doc.join('\n\n');
    fs.writeFileSync(filePath, doc);
  }
  /**
   * view doc in single page
   * @return {} []
   */
  singleAction(){
    this.generateSingleDoc();
    this.get('doc', 'single');
    return this.indexAction();
  }
  /**
   * get search result
   * @param  {String} keyword []
   * @return {}         []
   */
  async getSearchResult(keyword){
    let lang = this.config('tpl.lang');
    let version = this.get('version');

    let cmd = `grep '${keyword}' -ri *.md`;
    let fn = think.promisify(child_process.exec, child_process);
    let options = {
      cwd: think.ROOT_PATH + `/view/${lang}/doc/${version}/`
    }
    //ignore command error
    let result = await fn(cmd, options).catch(err => '');

    let data = {};
    result = result.split('\n').filter(item => {
      return item;
    }).map(item => {
      let pos = item.indexOf(':');
      let filename = item.substr(0, pos);
      if(!(filename in data)){
        data[filename] = {filename: filename, text: []};
      }
      let text = item.substr(pos + 1);
      text = this.escapeHtml(text).replace(new RegExp(keyword, 'ig'), `<span style="color:#c7254e">${keyword}</span>`);
      data[filename].text.push(text);
    });
    data = Object.keys(data).map(item => {
      let itemData = data[item];
      let filePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/${itemData.filename}`;
      let content = fs.readFileSync(filePath, 'utf8').trim();
      content.replace(/#+([^\n]+)/, (a, c) => {
        itemData.title = c;
      });
      return itemData;
    }).sort((a, b) => {
      return a.text.length < b.text.length ? 1 : -1;
    });
    return data;
  }
  /**
   * escape html
   * @param  {String} str []
   * @return {}     []
   */
  escapeHtml(str){
    let htmlMaps = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return (str + '').replace(/[<>'"]/g, function(a){
      return htmlMaps[a];
    });
  }
  /**
   * search action
   * @return {} []
   */
  async searchAction(){
    this.assign('currentNav', 'doc');
    this.assign('hasBootstrap', true);
    this.assign('hasVersion', true);
    this.getSideBar();

    let keyword = this.get('keyword').trim();
    this.assign('keyword', keyword);
    if(!keyword){
      return this.display();
    }
    
    let result = await this.getSearchResult(keyword);
    this.assign('searchResult', result);
    this.display();
  }
}
