import svelte from 'rollup-plugin-svelte';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import tscompile from 'typescript';
import replace from 'rollup-plugin-replace';
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
		file: 'server/public/app.js',
		name: 'app',
		sourcemap: true,
	},
	plugins: [
		commonjs(),
		typescript({typescript: tscompile}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file  better for performance
			css: css => {
				css.write('public/bundle.css');
			}
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
