'use strict';

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

import marked from "marked";
import markToc from "marked-toc";

import base from './base.js';


export default class extends base {
  /**
   * get sidebar json
   * @return {} []
   */
  getSideBar(){
    let lang = this.http.lang().toLowerCase();
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
   * get parsed markdown content
   * @param  {String} filePath []
   * @return {Promise}          []
   */
  getMarkedContent(filePath){
    let cache = this.config('cache_markdown_content');
    if(cache){
      let content = thinkCache('markdown-doc', filePath);
      if(content){
        return content;
      }
    }
    let markedContent = this.markdownToHtml(filePath);
    if(cache){
      thinkCache('markdown-doc', filePath, markedContent);
    }
    return markedContent;
  }
  /**
   * get doc content
   * @return {} []
   */
  async getDoc(){
    let doc = this.get('doc');
    let lang = this.http.lang().toLowerCase();
    let version = this.get('version');

    let markedContent;
    let filePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/${doc}.md`;
    let htmlPath = filePath.replace('.md', '.html');

    if(think.isFile(htmlPath)){
      markedContent = fs.readFileSync(htmlPath, 'utf8');
    }else{
      if(doc === 'single'){
        filePath = `${think.RESOURCE_PATH}/static/module/thinkjs/thinkjs_${lang}_${version}.md`;
        if(think.isFile(!filePath)){
          filePath = this.generateSingleDoc(this.http.lang().toLowerCase(), this.get('version'));
        }
      }
      if(!think.isFile(filePath)){
        return Promise.reject(new Error(`/doc/${doc}.html is not exist`));
      }
      markedContent = this.getMarkedContent(filePath);
    }

    if(doc === 'single'){
      this.assign('title', `${this.locale("all-doc")}${this.locale("title-doc-suffix", version)}`);
    }else{
      let titleReg = /<h2(?:[^<>]*)>([^<>]+)<\/h2>/;
      let match = markedContent.match(titleReg);
      if(match){
        this.assign('title', `${match[1]}${this.locale("title-doc-suffix", version)}`);
      }
    }
    

    this.assign('markedContent', markedContent);
    this.assign('doc', doc);
  }
  /**
   * doc
   * @return {} []
   */
  async indexAction(){
    //this.expires(86400);
    
    //redirect index doc, avoid relative path in doc
    let doc = this.get('doc');
    if(!doc){
      return this.redirect('/doc/index.html');
    }
    
    this.assign('currentNav', 'doc');
    this.assign('hasBootstrap', true);
    this.assign('hasVersion', true);
    this.getSideBar();

    try{
      await this.getDoc();
      await this.display('doc/index');
    }catch(err){
      this.http.error = err;
      await think.statusAction(404, this.http);
    }
  }
  /**
   * view doc in single page
   * @return {} []
   */
  singleAction(){
    this.get('doc', 'single');
    return this.indexAction();
  }
  /**
   * get search result
   * @param  {String} keyword []
   * @return {}         []
   */
  async getSearchResult(keyword){
    let lang = this.http.lang().toLowerCase();
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
      text = this.escapeHtml(text).replace(new RegExp(keyword, 'ig'), a => {
        return `<span style="color:#c7254e">${a}</span>`;
      });
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
