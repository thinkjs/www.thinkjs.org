export default class extends think.logic.base {
  /**
   * doc logic
   * @return {} []
   */
  indexAction(){
    let rules = {
      doc: "string|default:index",
      version: "string|default:1.2"
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail();
    }
  }
}