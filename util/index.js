const StackTracey = require('stacktracey');

const parseStack = (stack, o = 3) => {
  let st = new StackTracey(stack);
  let top = st.items[o]; //st.withSourceAt (4)
  const {file, line, column, fileName} = top;
  return {file, line, column, fileName}
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