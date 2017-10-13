const base = require('./base.js');
const fs = require('fs');
const path = require('path');
/**
 * invoke in command line
 */
module.exports = class extends base {
  __before() {
    this.rootPath = think.ROOT_PATH + '/view_build';
    if (!think.cli) {
      this.fail();
    }
  }

  /**
   * mardown to html
   * @return {} []
   */
  htmlAction() {
    const files = think.getFiles(this.rootPath).filter(file => {
      const ext = path.extname(file);
      return ext === '.md';
    });
    files.forEach(file => {
      const filePath = this.rootPath + '/' + file;
      const htmlPath = filePath.replace('.md', '.html');
      const content = this.markdownToHtml(filePath);
      fs.writeFileSync(htmlPath, content);
      // fs.unlinkSync(filePath);
    });
  }
  /**
   * single doc page
   * @return {} []
   */
  singleAction() {
    const rootPath = think.ROOT_PATH + '/view';
    const langs = fs.readdirSync(rootPath);
    langs.forEach(lang => {
      const docPath = rootPath + '/' + lang + '/doc';
      const versions = fs.readdirSync(docPath);
      versions.forEach(version => {
        if (!/^\d+\.\d+$/.test(version)) return;
        this.generateSingleDoc(lang, version);
      });
    });
  }
};
