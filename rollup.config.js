import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'dist/index.js', // Path to main compiled JS file
    output: {
        file: 'dist/libwrts.umd.js', // Output UMD bundle
        format: 'umd',
        name: 'libwrts', // Global variable name in browser
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        terser(), // Optional: minify output
    ],
};