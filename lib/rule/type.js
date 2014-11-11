var util = require('util');
var error = require('./error');

var types = {};
types.integer = function(value) {
  return typeof(value) == 'number' && parseInt(value) === value;
}

types.float = function(value) {
  return typeof(value) == 'number' && !types.integer(value);
}

types.array = function(value) {
  return Array.isArray(value);
}

types.regexp = function(value) {
  if(value instanceof RegExp) {
    return true;
  }
  try {
    var re = new RegExp(value);
    return true;
  }catch(e) {
    return false;
  }
}

types.object = function(value) {
  return typeof(value) == 'object' && !types.array(value);
}

types.method = function(value) {
  return typeof(value) == 'function';
}

//types.string = function(value) {
  //return typeof(value) == 'string' || (value instanceof String);
//}


/**
 *  Rule for validating the type of a value.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
var type = function(rule, value, source, errors, options) {
  // if value is required and value is undefined
  // no need  to add this error message
  if(rule.required && value == undefined) {
    return;
  }
  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method'];
  var type = rule.type;
  var _error;
  var _type = (options.messages.types[type+'Name'] === undefined)? rule.type : options.messages.types[type+'Name']
  if(custom.indexOf(type) > -1) {
    if(!types[type](value)) {
      _error = error(rule, util.format(options.messages.types[type], rule.field, _type));
      _error.type = 'type';
      errors.push(_error);
    }
  // straight typeof check
  } else if(type && !(typeof(value) == rule.type)) {
    _error = error(rule, util.format(options.messages.types[type], rule.field, _type));
    _error.type = 'type';
    errors.push(_error);
  }
}

module.exports = type;
