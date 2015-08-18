'use strict';
/**
 * error controller
 */
module.exports = think.controller({
  /**
   * display error page
   * @param  {Number} status []
   * @return {Promise}        []
   */
  displayErrorPage: function(status){
    let file = `common/error/${status}.html`;
    let options = this.config('tpl');
    options = think.extend({}, options, {
      type: 'ejs'
    });
    return this.display(file, options);
  },
  /**
   * bad request
   * @param  {Object} self []
   * @return {Promise}      []
   */
  _400Action: function(self){
    return self.displayErrorPage(400);
  },
  /**
   * forbidden 
   * @return {Promise} []
   */
  _403Action: function(self){
    return self.displayErrorPage(403);
  },
  /**
   * not found 
   * @param  {Object} self []
   * @return {Promise}      []
   */
  _404Action: function(self){
    return self.displayErrorPage(404);
  },
  /**
   * server error 
   * @param  {Object} self []
   * @return {Promise}      []
   */
  _500Action: function(self){
    return self.displayErrorPage(500);
  },
  /**
   * service unavailable
   * @param  {Object} self []
   * @return {Promise}      []
   */
  _503Action: function(self){
    return self.displayErrorPage(503);
  }
});