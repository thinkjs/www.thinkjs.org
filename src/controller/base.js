const fs = require('fs');
const marked = require('marked');
const markToc = require('marked-toc');
const highlight = require('highlight.js');
const path = require('path');

module.exports = class extends think.Controller {
  __before() {
    this.assign({
      title: this.getI18n()('title-home'),
      currentNav: '',
      hasBootstrap: false,
      hasVersion: false,
      lang: this.ctx.lang
    });
  }
  /**
   * display
   */
  display() {
    const lang = this.ctx.lang || 'zh-cn';
    const html = this.ctx.controller + think.config('view.ejs.sep') + this.ctx.action;
    super.display(`${lang}/home/${html}`);
  }
  /**
   * generate toc name
   * @param  {String} name []
   * @return {String}      []
   */
  generateTocName(name) {
    name = name.trim().replace(/\s+/g, '').replace(/\)/g, '').replace(/[(,]/g, '-').toLowerCase();
    if (/^[\w-]+$/.test(name)) {
      return name;
    }
    return `toc-${think.md5(name).slice(0, 3)}`;
  }
  /**
   * markdown to html
   * @return {} []
   */
  markdownToHtml(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    const tocContent = marked(markToc(content)).replace(/<a\s+href="#([^"]+)">([^<>]+)<\/a>/g, (a, b, c) => {
      return `<a href="#${this.generateTocName(c)}">${c}</a>`;
    });

    let markedContent = marked(content).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
      if (b | 0 === 2) {
        return `<h${b} id="${this.generateTocName(c)}">${c}</h${b}>`;
      }
      return `<h${b} id="${this.generateTocName(c)}"><a class="anchor" href="#${this.generateTocName(c)}"></a>${c}</h${b}>`;
    });
    markedContent = markedContent.replace(/<h(\d)[^<>]*>([^<>]+)<\/h\1>/, (a, b, c) => {
      return `${a}<div class="toc">${tocContent}</div>`;
    });

    const highlightContent = markedContent.replace(/<pre><code\s*(?:class="lang-(\w+)")?>([\s\S]+?)<\/code><\/pre>/mg, (a, language, text) => {
      text = text.replace(/&#39;/g, '\'').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      var result = highlight.highlightAuto(text, language ? [language] : undefined);
      return `<pre><code class="hljs lang-${result.language}">${result.value}</code></pre>`;
    });

    return highlightContent;
  }

  /**
   * generate single doc file
   * @return {} []
   */
  generateSingleDoc(lang, version) {
    const filePath = `${think.ROOT_PATH}/www/static/module/thinkjs/thinkjs_${lang}_${version}.md`;
    think.mkdir(path.dirname(filePath));

    const jsonPath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/sidebar.json`;
    const content = fs.readFileSync(jsonPath);
    const data = JSON.parse(content);

    let doc = ['# ThinkJS ' + version + ' Documentation'];
    for (const type in data) {
      doc.push(`# ${type}`);
      for (const name in data[type]) {
        const docFilePath = `${think.ROOT_PATH}/view/${lang}/doc/${version}/${data[type][name]}.md`;
        const content = fs.readFileSync(docFilePath, 'utf8');
        doc.push(content);
      }
    }
    doc = doc.join('\n\n');
    fs.writeFileSync(filePath, doc);
  }
};
