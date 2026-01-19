import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IcSpinnerV2 = ({ width = '28', height = '28' }: IcProps) => (
	<svg
		width={width}
		height={height}
		viewBox="0 0 28 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style={{
			animation: 'spin 1s linear infinite',
		}}
	>
		<style>
			{`
                @keyframes spin {
                100% { transform: rotate(360deg); }
                }
            `}
		</style>
		<path
			d="M14 3.5C19.799 3.5 24.5 8.20101 24.5 14C24.5 19.799 19.799 24.5 14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5Z"
			stroke="white"
			strokeOpacity="0.3"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M14 3.5C19.799 3.5 24.5 8.20101 24.5 14"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

export default IcSpinnerV2;
