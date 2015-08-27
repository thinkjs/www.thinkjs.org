'use strict';

import base from './base.js';

export default class extends base {
  /**
   * homepage
   * @return {} []
   */
  indexAction(){
    return this.display();
  }
  /**
   * changelog page
   * @return {} []
   */
  changelogAction(){
    this.assign('currentNav', 'changelog');
    this.assign('title', this.locale('title-changelog'));
    return this.display();
  }
  /**
   * demo list
   * @return {} []
   */
  demoAction(){
    return this.display();
  }
  /**
   * test
   * @return {} []
   */
  testAction(){
    return this.success();
  }
}