import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isDev = !!process.env.ROLLUP_WATCH;

export default {
  input: 'src/snowreport-card.ts',
  output: {
    file: 'dist/snowreport-card.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    !isDev && terser(),
    isDev && serve({ contentBase: ['dist', '.'], port: 10001 }),
    isDev && livereload({ watch: 'dist' })
  ].filter(Boolean)
};
