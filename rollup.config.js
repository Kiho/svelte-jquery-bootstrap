import svelte from 'rollup-plugin-svelte';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import tscompile from 'typescript';
import replace from 'rollup-plugin-replace';
import async from 'rollup-plugin-async';
import scss from 'rollup-plugin-scss';
import { minify } from 'uglify-js';

const plugins = [ 
    typescript({typescript: tscompile}),
    nodeResolve({ 
    	jsnext: true, 
    	main: true,
    	browser: true
    }),
	commonjs(),

	svelte({
		include: ['src/pages/**.html', 'src/components/**.html', 'src/App.html', 'src/Nav.html'],
		exclude: 'src/**/*.ts'
	}),
	scss(),
	async(),
	
	replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.APP_BASE_PATH': JSON.stringify(process.env.APP_BASE_PATH || ''),
    })
];

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

if (process.env.NODE_ENV) {
    plugins.push(uglify({}, minify));
}

export default {
	entry: 'src/app.ts',
	dest: 'server/public/bundle.js',
	format: 'iife',
	plugins,
	sourceMap: false
};
