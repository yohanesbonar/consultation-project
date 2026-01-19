import React from 'react';

interface IcProps {
	width?: string;
	height?: string;
}

const SpinnerIcon = ({ width = '24', height = '24' }: IcProps) => (
	<svg
		width={width}
		height={height}
		viewBox="0 0 24 24"
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
			d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12"
			stroke="#C2C2C2"
			strokeWidth="2.5"
			fill="none"
			strokeLinecap="round"
		/>
	</svg>
);

export default SpinnerIcon;
