export default class extends think.logic.base {

  version = "string|in:1.2,2.0,2.1,2.2|default:2.2";

  /**
   * index logic
   * @return {} []
   */
  indexAction(){
    this.rules = {
      version: this.version
    }
  }
  changelogAction(){
    this.rules = {
      version: this.version
    }
  }
  demoAction(){
    this.rules = {
      version: this.version
    }
  }
}