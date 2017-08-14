export function getValue(obj, valuePath) {
  const splitPath = valuePath.split('.');
  if (splitPath.length <= 1) {
    return obj[valuePath];
  }
  let value = undefined;
  for (const path of splitPath) {
    value = value ? value[path] : obj[path];
  }
  return value;
}

export function sort(array, sortColumn, sortDirection) {
  if (sortColumn.length < 1) {
    return array;
  }

  array.sort((a, b) => {
    if (getValue(a, sortColumn) > getValue(b, sortColumn)) {
      return sortDirection === 'up' ? -1 : 1;
    }
    if (getValue(a, sortColumn) < getValue(b, sortColumn)) {
      return sortDirection === 'up' ? 1 : -1;
    }
    return 0;
  });
  return array;
}
