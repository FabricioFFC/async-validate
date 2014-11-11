var util = require('util');
var error = require('./error');

/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var range = function(rule, value, source, errors, options) {
  var len = typeof rule.len == 'number';
  var min = typeof rule.min == 'number';
  var max = typeof rule.max == 'number';
  var val = value;
  var key = null;
  var num = typeof(value) == 'number';
  var str = typeof(value) == 'string';
  var arr = Array.isArray(value);
  var _error;
  if(num) {
    key = 'number';
  }else if(str) {
    key = 'string';
  }else if(arr) {
    key = 'array';
  }
  // if the value is not of a supported type for range validation
  // the validation rule rule should use the
  // type property to also test for a particular type
  if(!key) {
    return false;
  }
  if(str || arr) {
    val = value.length;
  }
  if(len) {
    if(val !== rule.len) {
      _error = error(rule, util.format(options.messages[key].len, rule.field, rule.len));
      _error.type = 'len';
      errors.push(_error);
    }
  }else if( min && !max && val < rule.min ) {
    _error = error(rule, util.format(options.messages[key].min, rule.field, rule.min));
    _error.type = 'min';
    errors.push(_error);
  }else if( max && !min && val > rule.max ) {
    _error = error(rule, util.format(options.messages[key].max, rule.field, rule.max));
    _error.type = 'max';
    errors.push(_error);
  }else if(min && max && (val < rule.min || val > rule.max) ) {
    _error = error(rule, util.format(options.messages[key].range, rule.field, rule.min, rule.max));
    _error.type = 'range';
    errors.push(_error);
  }
}

module.exports = range;
