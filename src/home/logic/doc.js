export default class extends think.logic.base {

  version = "string|in:1.2,2.0,2.1,2.2|default:2.2";

  /**
   * doc logic
   * @return {} []
   */
  indexAction(){
    this.rules = {
      version: this.version
    }
  }
  /**
   * search action
   * @return {} []
   */
  searchAction(){
    this.rules = {
      version: this.version,
      keyword: 'required'
    }
  }
  /**
   * single document
   * @return {} []
   */
  singleAction(){
    this.rules = {
      version: this.version,
    }
  }
}