import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IconFormConsultation = ({ width = '25', height = '24' }: IcProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 25 24"
		fill="none"
	>
		<rect x="4" y="2" width="14.5684" height="18.7826" rx="0.37117" fill="#E67937" />
		<rect x="4.92798" y="2.92793" width="14.5684" height="18.7826" rx="0.37117" fill="#FFCDAF" />
		<rect x="6.43188" y="13.7151" width="10.7639" height="0.927925" rx="0.463962" fill="white" />
		<path
			d="M6.43188 16.522C6.43188 16.253 6.64999 16.0349 6.91905 16.0349H15.1312C15.4002 16.0349 15.6183 16.253 15.6183 16.522C15.6183 16.7911 15.4002 17.0092 15.1312 17.0092H6.91904C6.64999 17.0092 6.43188 16.7911 6.43188 16.522Z"
			fill="white"
		/>
		<path
			d="M6.43188 18.8418C6.43188 18.5728 6.64999 18.3547 6.91905 18.3547H13.4609C13.73 18.3547 13.9481 18.5728 13.9481 18.8418C13.9481 19.1109 13.73 19.329 13.4609 19.329H6.91905C6.64999 19.329 6.43188 19.1109 6.43188 18.8418Z"
			fill="white"
		/>
		<ellipse cx="12.2124" cy="8.32095" rx="3.7117" ry="3.7117" fill="#A54500" />
		<mask
			id="mask0_128_1397"
			style={{ maskType: 'alpha' }}
			maskUnits="userSpaceOnUse"
			x="8"
			y="4"
			width="8"
			height="9"
		>
			<ellipse cx="12.2122" cy="8.32097" rx="3.7117" ry="3.7117" fill="#3D7E91" />
		</mask>
		<g mask="url(#mask0_128_1397)">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.955 8.48254C10.5157 8.51952 10.1707 8.88784 10.1707 9.33674V12.0325H14.2312V9.33674C14.2312 8.8879 13.8863 8.51963 13.447 8.48256C13.1404 8.82362 12.6958 9.0381 12.201 9.0381C11.7063 9.0381 11.2617 8.82361 10.955 8.48254Z"
				fill="#E67937"
			/>
			<circle cx="12.2009" cy="7.36272" r="1.26893" fill="#F8DDBE" />
		</g>
		<rect
			x="21.1133"
			y="9.15845"
			width="2.22702"
			height="0.74234"
			transform="rotate(45 21.1133 9.15845)"
			fill="#B9DCF9"
		/>
		<path
			d="M14.0272 16.2447L15.602 17.8195L12.9402 19.0294C12.8621 19.0648 12.7819 18.9845 12.8173 18.9065L14.0272 16.2447Z"
			fill="#F8DAAE"
		/>
		<rect
			x="20.5884"
			y="9.6833"
			width="2.22702"
			height="9.27925"
			transform="rotate(45 20.5884 9.6833)"
			fill="#FFB300"
		/>
		<path
			d="M21.901 8.37097C22.1909 8.08107 22.6609 8.08107 22.9508 8.37097L23.4757 8.89588C23.7656 9.18578 23.7656 9.65581 23.4757 9.94571L22.6884 10.7331L21.1136 9.15834L21.901 8.37097Z"
			fill="#D01E53"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.798 18.6396L12.9407 19.0294C12.8626 19.0648 12.7823 18.9845 12.8178 18.9065L13.2075 18.0491L13.798 18.6396Z"
			fill="black"
		/>
		<circle cx="20" cy="4" r="4" fill="#D01E53" />
	</svg>
);

export default IconFormConsultation;
