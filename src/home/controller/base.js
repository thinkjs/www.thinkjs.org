import fs from 'fs';
import path from 'path';

import marked from "marked";
import markToc from "marked-toc";
import highlight from 'highlight.js';

export default class extends think.controller.base {
  /**
   * before magic method
   * @return {} []
   */
  __before(){
    this.assign({
      title: this.locale('title-home'),
      currentNav: '',
      hasBootstrap: false,
      hasVersion: false,
      lang: this.http.lang()
    });
  }
  /**
   * generate toc name
   * @param  {String} name []
   * @return {String}      []
   */
  generateTocName(name){
    name = name.trim().replace(/\s+/g, '').replace(/\)/g, '').replace(/[\(\,]/g, '-').toLowerCase();
    if(/^[\w\-]+$/.test(name)){
      return name;
    }
    return `toc-${think.md5(name).slice(0, 3)}`;
  }
  /**
   * markdown to html
   * @return {} []
   */
  markdownToHtml(filePath){
    let content = fs.readFileSync(filePath, 'utf8');

    let tocContent = marked(markToc(content)).replace(/<a\s+href="#([^\"]+)">([^<>]+)<\/a>/g, (a, b, c) => {
      return `<a href="#${this.generateTocName(c)}">${c}</a>`;
    });

    let markedContent = marked(content).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
      if(b == 2){
        return `<h${b} id="${this.generateTocName(c)}">${c}</h${b}>`;
      }
      return `<h${b} id="${this.generateTocName(c)}"><a class="anchor" href="#${this.generateTocName(c)}"></a>${c}</h${b}>`;
    });
    markedContent = markedContent.replace(/<h(\d)[^<>]*>([^<>]+)<\/h\1>/, (a, b, c) => {
      return `${a}<div class="toc">${tocContent}</div>`;
    });

    let highlightContent = markedContent.replace(/<pre><code\s*(?:class="lang-(\w+)")?>([\s\S]+?)<\/code><\/pre>/mg, (a, language, text) => {
      text = text.replace(/&#39;/g, '\'').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\&quot;/g, '"').replace(/\&amp;/g, "&");
      var result = highlight.highlightAuto(text, language ? [language] : undefined);
      return `<pre><code class="hljs lang-${result.language}">${result.value}</code></pre>`;
    });

    return highlightContent;
  }

  /**
   * generate single doc file
   * @return {} []
   */
  generateSingleDoc(lang, version){
    let filePath = `${think.RESOURCE_PATH}/static/module/thinkjs/thinkjs_${lang}_${version}.md`;
    think.mkdir(path.dirname(filePath));

    let jsonPath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/sidebar.json`;
    let content = fs.readFileSync(jsonPath);
    let data = JSON.parse(content);

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
}
