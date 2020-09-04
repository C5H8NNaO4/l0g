const {tag} = require('./tag')
const MapTag = (valCbs, strCbs) => (strs, ...vals) => {
  if (typeof cbs === 'object') {
    if (cbs.constructor === Object) {
      cbs = new Map(Object.entries(cbs));
    }
  }

  const mapVals = cbs => v => {
    let cb;
    for (const entry of cbs.entries()) {
      let [a,b] = entry;
      if (!Array.isArray(b)) b = [b];
      if (typeof a !== 'function') continue;
      if (a(v)) 
        v = b.reduce((a, fn) => fn(a), v);
    }

    if (cbs.has(v)) {
      cb = cbs.get(v);
    }

    if (typeof cb === 'function')
      v = cb.call(this, v)

    return v;
  };

  let message = tag(strs.map(mapVals(strCbs || valCbs)), ...vals.map(mapVals(valCbs)));

  for (const entry of valCbs.entries()) {
    const [a,b] = entry;
    if (!(a instanceof RegExp)) continue;
    if (a.test(message)) 
      message = b(message, a);
  }

  return message;
}

module.exports = {MapTag}
