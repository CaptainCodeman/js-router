'use strict';

import pkg from './package.json'

import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

// assume production mode for normal build, dev if watched
// flag is used to enable / disable HTML & JS minification
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/router.ts',
  output: {
    file: pkg.module,
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    typescript({ typescript: require('typescript') }),
    production && terser(),
  ],
}
