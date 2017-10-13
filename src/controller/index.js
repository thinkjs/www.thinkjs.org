const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * homepage
   * @return {} []
   */
  indexAction() {
    return this.display();
  }
  /**
   * changelog page
   * @return {} []
   */
  changelogAction() {
    this.assign('currentNav', 'changelog');
    this.assign('title', this.getI18n()('title-changelog'));
    return this.display();
  }
  /**
   * demo list
   * @return {} []
   */
  demoAction() {
    this.assign('currentNav', 'demo');
    this.assign('title', this.getI18n()('title-demo'));
    // this.assign('hasBootstrap', true);
    return this.display();
  }
  /**
   * plugin page
   * @return {[type]} [description]
   */
  pluginAction() {
    this.assign('currentNav', 'plugin');
    this.assign('title', this.getI18n()('title-plugin'));
    // this.assign('hasBootstrap', true);
    return this.display();
  }
  /**
   * donate page
   * @return {[type]} [description]
   */
  donateAction() {
    this.assign('currentNav', 'donate');
    this.assign('title', this.getI18n()('title-donate'));
    return this.display();
  }
  /**
   * about page
   * @return {} []
   */
  aboutAction() {
    this.assign('title', this.getI18n()('title-about'));
    return this.display();
  }
  /**
   * spending page
   * @return {}
   */
  spendingAction() {
    this.assign('title', this.getI18n()('title-spending'));
    return this.display();
  }
  /**
   * event
   * @return {}
   */
  eventAction() {
    this.assign('title', this.getI18n()('title-event'));
    return this.display();
  }

  newAction() {
    return this.display();
  }
};
