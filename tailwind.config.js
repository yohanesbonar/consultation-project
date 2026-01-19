/**
 * ⚠️ WARNING: This file will be deleted after all branches are merged.
 * Active config is located in: next/tailwind.config.js
 * Do not modify this file unless you plan to also update next/tailwind.config.js
 */

/** @type {import('tailwindcss').Config} */

const path = require('path');

module.exports = {
	darkMode: 'class',
	corePlugins: {
		preflight: false,
	},
	content: [
		path.join(__dirname, './next/pages/**/*.{js,ts,jsx,tsx,css}'),
		path.join(__dirname, './next/components/**/*.{js,ts,jsx,tsx,css}'),
		path.join(__dirname, './public/assets/**/*.{js,ts,jsx,tsx,css}'),
	],
	prefix: 'tw-',
	safelist: [
		{
			pattern: /text-\[\#.*\]/,
		},
	],
	theme: {
		extend: {
			colors: {
				primary: {
					def: 'var(--primary-def)',
					100: 'var(--primary-100)',
					300: 'var(--primary-300)',
					400: 'var(--primary-400)',
					600: 'var(--primary-600)',
					900: 'var(--primary-900)',
				},
				secondary: {
					def: 'var(--secondary-def)',
					50: 'var(--secondary-50)',
					100: 'var(--secondary-100)',
					150: 'var(--secondary-150)',
					200: 'var(--secondary-200)',
					300: 'var(--secondary-300)',
					400: 'var(--secondary-400)',
					500: 'var(--secondary-500)',
					600: 'var(--secondary-600)',
					700: 'var(--secondary-700)',
					800: 'var(--secondary-800)',
					900: 'var(--secondary-900)',
				},
				monochrome: {
					def: 'var(--monochrome-def)',
					1: 'var(--monochrome-1)',
					50: 'var(--monochrome-50)',
					100: 'var(--monochrome-100)',
					150: 'var(--monochrome-150)',
					200: 'var(--monochrome-200)',
					300: 'var(--monochrome-300)',
					400: 'var(--monochrome-400)',
					500: 'var(--monochrome-500)',
					700: 'var(--monochrome-700)',
					800: 'var(--monochrome-800)',
					900: 'var(--monochrome-900)',
				},
				success: {
					def: 'var(--success-def)',
					50: 'var(--success-50)',
					100: 'var(--success-100)',
					800: 'var(--success-800)',
				},
				error: {
					def: 'var(--error-def)',
					50: 'var(--error-50)',
					100: 'var(--error-100)',
					600: 'var(--error-600)',
				},
				info: {
					def: 'var(--info-def)',
					50: 'var(--info-50)',
					100: 'var(--info-100)',
					600: 'var(--info-600)',
					700: 'var(--info-700)',
				},
				link: '#0771CD',
				tpy: {
					def: 'var(--tpy-def)',
					1: 'var(--tpy-1)',
					50: 'var(--tpy-50)',
					100: 'var(--tpy-100)',
					150: 'var(--tpy-150)',
					200: 'var(--tpy-200)',
					300: 'var(--tpy-300)',
					400: 'var(--tpy-400)',
					500: 'var(--tpy-500)',
					700: 'var(--tpy-700)',
					800: 'var(--tpy-800)',
					900: 'var(--tpy-900)',
				},
				background: {
					def: 'var(--background-def)',
					1: 'var(--background-1)',
					50: 'var(--background-50)',
					100: 'var(--background-100)',
					150: 'var(--background-150)',
					200: 'var(--background-200)',
					300: 'var(--background-300)',
					400: 'var(--background-400)',
					500: 'var(--background-500)',
					700: 'var(--background-700)',
					800: 'var(--background-800)',
					900: 'var(--background-900)',
				},
			},
			borderWidth: {
				1: '1px',
				5: '5px',
			},
			minWidth: {
				6: '24px',
				0.5: '2px',
				'75-view': '75vw',
				'90-view': '90vw',
				375: '375px',
				450: '450px',
				500: '500px',
			},
			minHeight: {
				14: '56px',
			},
			maxHeight: {
				214: '214px',
			},
			width: {
				'2x': '200%',
				18: '72px',
			},
			maxWidth: {
				650: '650px',
				214: '214px',
				500: '500px',
			},
			borderRadius: {
				ellipsebg: '210% 85%',
				'4xl': '28px',
				half: '50%',
				4: '4px',
			},
			height: {
				18: '72px',
				header: '56px',
				38: '152px',
			},
			margin: {
				4.5: '18px',
				header: '56px',
				'1px': '1px',
				6.5: '26px',
				7.5: '30px',
			},
			padding: {
				22: '88px',
				4.5: '18px',
				'1px': '1px',
			},
			zIndex: {
				1: 1,
				2: 2,
				3: 3,
				4: 4,
			},
			// borderBottomRightRadius: {
			// 	ellipsebg: '210% 85%',
			// },
			fontFamily: {
				roboto: ['Roboto'],
			},
			backgroundImage: {
				'custom-gradient-1':
					'linear-gradient(88.56deg, rgba(226, 241, 252, 0.1) -9.67%, rgba(7, 113, 205, 0.1) 46.25%, rgba(226, 241, 252, 0.1) 84.72%, rgba(7, 113, 205, 0.1) 127.58%)',
			},
			boxShadow: {
				'custom-shadow-1': '0px 1px 4px 0px #0000001F',
			},
			aspectRatio: {
				'375/96': '375 / 96',
			},
		},
	},
	plugins: [],
};
