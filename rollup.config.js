'use strict';

import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import size from 'rollup-plugin-size';

// assume production mode for normal build, dev if watched
// flag is used to enable / disable HTML & JS minification
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/router.ts',
  output: {
    file: 'dist/router.min.js',
    format: 'esm',
    name: 'router',
    sourcemap: false,
  },
  plugins: [
    typescript({ typescript: require('typescript') }),
    production && terser({
      ecma: 6,
      module: true,
      compress: {
        pure_getters: true,
        unsafe: true,
      },
    }),
    production && size(),
  ],
}
