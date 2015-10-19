export default class extends think.logic.base {
  /**
   * doc logic
   * @return {} []
   */
  indexAction(){
    this.rules = {
      doc: "string|default:index",
      version: "string|in:1.2,2.0|default:2.0"
    }
  }
  /**
   * search action
   * @return {} []
   */
  searchAction(){
    this.rules = {
      version: "string|in:1.2,2.0|default:2.0",
      keyword: 'required'
    }
  }
  /**
   * single document
   * @return {} []
   */
  singleAction(){
    this.rules = {
      version: "string|in:1.2,2.0|default:2.0",
    }
  }
}