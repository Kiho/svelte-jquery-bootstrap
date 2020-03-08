import dateFormat from 'dateformat';

export function getLocalDate(dtm) {
  var dt = new Date(dtm);
  var minutes = dt.getTimezoneOffset();
  dt = new Date(dt.getTime() + minutes * 60000);
  return dt;
}

export function formatDate(dtm, format) {
  if (dtm) {
    return dateFormat(dtm, format);
  }
  return '';
}

export function makeUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

export function stripQuotes(a) {
  if (a.charAt(0) === '"' && a.charAt(a.length-1) === '"') {
    return a.substr(1, a.length-2);
  }
  return a;
}

export function getPathName(path) {
  if (!path) return '/';
  const sub = path.substring(1);
  if (sub.indexOf('/') === -1) { return path; }
  return '/' + sub.replace(/[^/]*$/, '').replace(/\/$/, "");
}


export function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

export function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  } else if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }

  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}

export function clean($$props) {
  // TODO support keys
  // eslint-disable-next-line no-unused-vars
  const { children, $$scope, $$slots } = $$props;
  const rest = {};
  for (const key of Object.keys($$props)) {
    if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
      rest[key] = $$props[key];
    }
  }
  return rest;
}