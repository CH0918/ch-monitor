const getSelector = function (path) {
  let result = path.reverse().filter(function (element) {
    return element !== window && element !== document;
  });
  result = result.map(function (element) {
    var selector;
    if (element.id) {
      selector = `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      selector =
        '.' +
        element.className
          .split(' ')
          .filter(function (item) {
            return !!item;
          })
          .join('.');
    } else {
      selector = element.nodeName;
    }
    return selector;
  });
  result = result.join(' ');
  return result;
};
export default function (pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    return getSelector(pathsOrTarget);
  } else {
    var paths = [];
    var element = pathsOrTarget;
    while (element) {
      paths.push(element);
      element = element.parentNode;
    }
    return getSelector(paths);
  }
}
