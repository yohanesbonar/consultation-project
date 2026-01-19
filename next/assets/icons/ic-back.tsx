import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IcBack = ({ width = '48', height = '48' }: IcProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
		<rect
			id="Rectangle_5513"
			data-name="Rectangle 5513"
			width={width}
			height={height}
			rx="24"
			fill="#f6f6f7"
			opacity="0"
		/>
		<g id="ic-back-non-hover-24">
			<rect
				id="Rectangle_5213"
				data-name="Rectangle 5213"
				width="24"
				height="24"
				transform={`translate(${(parseInt(width) - 24) / 2} ${(parseInt(height) - 24) / 2})`}
				fill="#fff"
				opacity="0"
			/>
			<path
				id="Path_2936"
				data-name="Path 2936"
				d="M23.134,13.1H8.8l6.263-6.432a1.354,1.354,0,0,0,0-1.871,1.255,1.255,0,0,0-1.81,0L4.793,13.478a1.338,1.338,0,0,0,0,1.858l8.458,8.685a1.255,1.255,0,0,0,1.81,0,1.338,1.338,0,0,0,0-1.858L8.8,15.732H23.134a1.318,1.318,0,0,0,0-2.636Z"
				transform={`translate(${(parseInt(width) - 48) / 2} ${(parseInt(height) - 48) / 2})`}
				fill="#fff"
			/>
		</g>
	</svg>
);

export default IcBack;
