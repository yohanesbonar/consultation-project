/**
 * ⚠️ WARNING: This file will be deleted after all branches are merged.
 * Active config is located in: next/postcss.config.js
 * Do not modify this file unless you plan to also update next/postcss.config.js
 */

const path = require('path');

module.exports = {
	plugins: {
		tailwindcss: {
			config: path.join(__dirname, 'tailwind.config.js'),
		},
		autoprefixer: {},
	},
};
