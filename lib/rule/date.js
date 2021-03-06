var util = require('util');
var moment = require('moment');
var error = require('./error');

/**
 *  Rule for validating a date against a format.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var date = function(rule, value, source, errors, options) {
  if(!rule.required
     && (value == undefined || value == "")) {
    return false;
  }
  var mmt = rule.local ? moment : moment.utc;
  var dt = !rule.format ? mmt(new Date(value)) : mmt(value, rule.format);
  var _error;
  //console.log('value %s', value);
  //console.log('format %s', rule.format);
  //console.log('date %s', dt);
  //console.log('date valid %s', dt.isValid());
  if(!dt) {
    _error = error(rule, util.format(options.messages.date.parse, rule.field, value));
    _error.type = 'dateParse';
    errors.push(_error);
  }else if(!dt.isValid()) {
    if(rule.format) {
      _error = error(rule, util.format(options.messages.date.format, rule.field, value, rule.format));
      _error.type = 'dateFormat';
      errors.push(_error);
    }else{
      _error = error(rule, util.format(options.messages.date.invalid, rule.field, value));
      _error.type = 'invalid';
      errors.push(_error);
    }
  }
}

module.exports = date;
