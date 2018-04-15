import svelte from 'rollup-plugin-svelte';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import tscompile from 'typescript';
import replace from 'rollup-plugin-replace';
// import async from 'rollup-plugin-async';
import scss from 'rollup-plugin-scss';
import { minify } from 'uglify-es';

const nodeEnv = process.env.NODE_ENV || 'development';
const appBasePath = process.env.APP_BASE_PATH || '';
const serverUrl = process.env.SERVER_URL || '';
const production = nodeEnv == 'production';

export default {
	input: './src/app.ts',	
	output: {
		sourcemap: true,	
		format: 'iife',
		file: 'server/public/bundle.js',
		name: 'app',
		sourcemap: true,
	},
	plugins: [
		commonjs(),
		typescript({typescript: tscompile}),
		svelte({
			dev: !production,
			css: css => {
				css.write('public/app.css');
			},
			cascade: true
		}),
		resolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		scss(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(nodeEnv),
			'process.env.APP_BASE_PATH': JSON.stringify(appBasePath),
			'process.env.SERVER_URL': JSON.stringify(serverUrl),
		}),
		production && buble({ exclude: 'node_modules/**' }),
		production && uglify()
	]
};
