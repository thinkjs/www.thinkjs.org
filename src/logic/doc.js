export default class extends think.Logic {

  constructor(...args) {
    super(...args);
    if (this.ctx.lang === 'en') {
      this.version = {
        string: true,
        required: true,
        in: ['1.2', '2.0', '2.1', '2.2', '3.0'],
        default: '2.0',
        trim: true,
        method: 'GET'
      };
    } else {
      this.version = {
        string: true,
        required: true,
        in: ['1.2', '2.0', '2.1', '2.2', '3.0'],
        default: '3.0',
        trim: true,
        method: 'GET'
      };
    }
  }

  /**
   * doc logic
   * @return {} []
   */
  indexAction() {
    this.rules = {
      version: this.version
    }
  }

  /**
   * search action
   * @return {} []
   */
  searchAction() {
    this.rules = {
      version: this.version,
      keyword: {
        required: true
      }
    }
  }

  /**
   * single document
   * @return {} []
   */
  singleAction() {
    this.rules = {
      version: this.version,
    }
  }
}