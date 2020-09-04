const tag = (strs, ...vals) => {
  return strs.reduce((str, val, i) => {
    return str + vals[i-1] + val;
  })
};

module.exports = {
  tag
}