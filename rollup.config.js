const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const  globals = require('rollup-plugin-node-globals');
module.exports = {
  input: 'index.js',
  output: {
    file: 'dist/Logger.js',
    format: 'iife',
    globals: {
      os: 'null',
      tty: 'null'
    }
  },
  external: ['os', 'tty'],
  plugins: [
    resolve(),
    commonjs(),
    globals()
  ]
};