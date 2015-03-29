var extend = function(target, source) {
  if (!source) {
    return target;
  }

  for (var key in source) {

    if (typeof source[key] === 'object') {
      target[key] = target[key] || (Array.isArray(source[key]) ? [] : {});
      extend(target[key], source[key]);
    } else {
      source.hasOwnProperty(key) && (target[key] = source[key]);
    }
  }

  return target;
};

var arrayify = function(item) {
  return Array.isArray(item) ? item : [item];
};

exports.arrayify = arrayify;
exports.extend = extend;
