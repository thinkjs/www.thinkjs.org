export default class extends think.controller.base {
  /**
   * before magic method
   * @return {} []
   */
  __before(){
    let lang = this.http._locale || this.lang();
    let support = this.config('locale.support');
    if(support.indexOf(lang) === -1){
      lang = this.config('locale.default');
    }
    this.config('tpl.lang', lang);

    this.assign({
      title: this.locale('title-home'),
      currentNav: '',
      hasBootstrap: false,
      hasVersion: false,
      lang: lang
    });
  }
}