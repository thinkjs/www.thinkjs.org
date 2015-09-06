export default class extends think.logic.base {
  /**
   * doc logic
   * @return {} []
   */
  indexAction(){
    let rules = {
      doc: "string|default:index",
      version: "string|in:1.2,2.0|default:2.0"
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.errors());
    }
  }
}