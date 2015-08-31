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
}