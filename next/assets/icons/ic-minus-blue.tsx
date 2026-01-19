import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IconMinusBlue = ({ width = '24', height = '24' }: IcProps) => (
	<svg
		width={width}
		height={height}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M5.143 11L18.857 11C19.1601 11 19.4509 11.1204 19.6652 11.3348C19.8796 11.5491 20 11.8399 20 12.143C20 12.4461 19.8796 12.7369 19.6652 12.9512C19.4509 13.1656 19.1601 13.286 18.857 13.286L5.143 13.286C4.83986 13.286 4.54913 13.1656 4.33478 12.9512C4.12042 12.7369 4 12.4461 4 12.143C4 11.8399 4.12042 11.5491 4.33478 11.3348C4.54913 11.1204 4.83986 11 5.143 11Z"
			fill="#0771CD"
		/>
	</svg>
);

export default IconMinusBlue;
