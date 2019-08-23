import _ from 'lodash'
export const isObject = item =>
  item && typeof item === 'object' && !Array.isArray(item) && item !== null;

/**
     * Deep merge two objects.
     * @param target
     * @param source
     */
export const mergeDeep = (target, source) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return target;
};
export const mergeDeepPure = (object1, object2) => {
  if (isObject(object1) && isObject(object1)) {
    let o1 = Object.assign({}, object1);
    let o2 = Object.assign({}, object2);
    return mergeDeep(o1, o2);
  } else {
    return object1;
  }
};

export function merge2Array(sourceArr, targetArr, key) {
  var finals = _.map(sourceArr, function (item) {
    return _.assign(
      _.find(targetArr, _.pick(item, key)) || {},
      item
    );
  });
  return finals;

}
