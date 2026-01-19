import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IcInfoIcon = ({ width = '24', height = '24' }: IcProps) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
			<g id="ic-warning-yellow-24" transform="translate(-28 -134)">
				<path
					id="Subtraction_21"
					data-name="Subtraction 21"
					d="M299-3913a8.009,8.009,0,0,1-8-8,8.009,8.009,0,0,1,8-8,8.009,8.009,0,0,1,8,8A8.009,8.009,0,0,1,299-3913Zm0-8.5a.8.8,0,0,0-.8.8v3.2a.8.8,0,0,0,.8.8.8.8,0,0,0,.8-.8v-3.2A.8.8,0,0,0,299-3921.5Zm0-3.5a1.133,1.133,0,0,0-.8.3,1.13,1.13,0,0,0-.3.8,1.129,1.129,0,0,0,.3.8,1.131,1.131,0,0,0,.8.3,1.134,1.134,0,0,0,.8-.3,1.228,1.228,0,0,0,0-1.6A1.133,1.133,0,0,0,299-3925Z"
					transform="translate(-259 4067)"
					fill="#666"
				/>
				<path
					id="Path_6150"
					data-name="Path 6150"
					d="M0,0H24V24H0Z"
					transform="translate(28 134)"
					fill="rgba(0,0,0,0)"
				/>
			</g>
		</svg>
	);
};

export default IcInfoIcon;
