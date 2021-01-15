const tag = (strs, ...vals) => {
  try {

    return strs.reduce((str, val, i) => {
      return str + vals[i-1] + val;
    })
  } catch (e) {
    
    throw new Error(`${JSON.stringify(strs)}`);
  }
};

module.exports = {
  tag
}