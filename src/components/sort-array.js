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

export function sort(array, sortColumn, sortDirection, convertFunc) {
  if (sortColumn.length < 1) {
    return array;
  }

  array.sort((a, b) => {
    const valA =
      convertFunc != null
        ? convertFunc(getValue(a, sortColumn))
        : getValue(a, sortColumn);
    const valB =
      convertFunc != null
        ? convertFunc(getValue(b, sortColumn))
        : getValue(b, sortColumn);

    if (typeof valA !== 'string' && valB !== 'string') {
      if (!isFinite(valA) && !isFinite(valB)) {
        return 0;
      }
      if (!isFinite(valA)) {
        return 1;
      }
      if (!isFinite(valB)) {
        return -1;
      }
    }

    if (valA > valB) {
      return sortDirection === 'up' ? -1 : 1;
    }
    if (valA < valB) {
      return sortDirection === 'up' ? 1 : -1;
    }

    return 0;
  });

  return array;
}
