const StackTracey = require('stacktracey');

const parseStack = (stack, o = 3) => {
  // const lines = stack.toString().split('\n');
  // const line = lines[o];
  // const [,method] = line.match(/at (.+)? /)
  // const [,file,row,col] = line.match(/.+\\(.+?\..+?):(\d+):(\d+)\)/)
  let st = new StackTracey(stack);
  let top = st.items[o]; //st.withSourceAt (4)
  // const top = st.withSourceAt(st.items[o]);
  return ({file, line, column, fileName} = top);
  console.log(st.items[o], o, top);
  process.exit(0);
  return {file, method, row, col, top}
}
const getLine = (offset = 0) => {
  try {
    throw new Error ('Test');
  } catch (e) {
    const info = parseStack (e.stack, offset + 1)
    return info;
  }
}

module.exports = {getLine}