'use strict';

import fs from 'fs';
import marked from "marked";
import markToc from "marked-toc";
import uslug from 'uslug';
import pangunode from 'pangunode';

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

    this.display();
  }
}
