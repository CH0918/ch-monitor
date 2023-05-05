import cleaner from 'rollup-plugin-cleaner';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: ['src/monitor/index.js'],
  output: [
    {
      file: 'dist/ch-monitor.umd.js',
      format: 'umd',
      name: 'ChMonitor',
      sourcemap: true,
    },
    {
      file: 'dist/ch-monitor.common.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    cleaner({
      targets: ['./dist/'],
    }),
    // 将导入的地方法包代码页打包出院到源码中
    resolve(),
    // 将commonjs规范的代码转成esm规范
    commonjs(),
    babel(),
    terser(),
  ],
};
