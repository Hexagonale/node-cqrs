import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
	{
		files: ['src/**/*.ts'],
	},
	{
		languageOptions: {
			globals: globals.node,
		},
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	...tsEslint.configs.recommended,
];
