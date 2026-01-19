/**
 * ⚠️ WARNING: This file will be deleted after all branches are merged.
 * Active config is located in: next/next.config.js
 * Do not modify this file unless you plan to also update next/next.config.js
 */

'use strict';

const next = require('next');
const { withPlugins } = require('next-compose-plugins');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const nextGlobal = {
	compiler: {
		styledComponents: true,
	},
	poweredByHeader: false,
	swcMinify: false,
	experimental: {
		esmExternals: false,
	},
};

const nextEslint = {
	eslint: {
		ignoreDuringBuilds: true,
	},
};

const nextWithPWA = {
	pwa: {
		disable: false,
		sw: 'service-worker.js',
		publicExcludes: ['!assets/excel/**/*', '!assets/uploads/**/*', '!uploads/**/*'],
		runtimeCaching,
	},
};

const svgWebpack = {
	webpack(config) {
		config.devtool = false;
		config.mode = 'production';
		// config.devServer = {
		// 	liveReload: false,
		// 	hot: false,
		// };
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
};

const imageDomain = {
	images: {
		domains: [
			'images.tokopedia.net',
			'i.imgur.com', 
			'imgur.com', 
			'down-id.img.susercontent.com',
		],
	},
};

module.exports = withPlugins([
	[nextGlobal],
	[nextEslint],
	[withPWA(nextWithPWA)],
	[svgWebpack],
	[imageDomain],
]);
