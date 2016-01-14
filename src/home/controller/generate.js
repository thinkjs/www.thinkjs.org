'use strict';

import base from './base.js';
import fs from 'fs';
import path from 'path';



/**
 * invoke in command line
 */
export default class extends base {

  init(http){
    super.init(http);
    this.rootPath = think.ROOT_PATH + '/view_build';
  }

  __before(){
    if(!think.cli){
      this.fail();
    }
  }

  /**
   * mardown to html
   * @return {} []
   */
  htmlAction(){
    let files = think.getFiles(this.rootPath).filter(file => {
      let ext = path.extname(file);
      return ext === '.md';
    });
    files.forEach(file => {
      let filePath = this.rootPath + '/' + file;
      let htmlPath = filePath.replace('.md', '.html');
      let content = this.markdownToHtml(filePath);
      fs.writeFileSync(htmlPath, content);
      //fs.unlinkSync(filePath);
    });
  }
  /**
   * single doc page
   * @return {} []
   */
  singleAction(){
    let rootPath = think.ROOT_PATH + '/view';
    let langs = fs.readdirSync(rootPath);
    langs.forEach(lang => {
      let docPath = rootPath + '/' + lang + '/doc';
      let versions = fs.readdirSync(docPath);
      versions.forEach(version => {
        this.generateSingleDoc(lang, version);
      })
    }) 
  }

}