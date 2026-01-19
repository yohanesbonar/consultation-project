import React from 'react';
interface IcProps {
	width?: string;
	height?: string;
}
const IconClockOrange = ({ width = '17', height = '17' }: IcProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 17 17"
		fill="none"
	>
		<g id="clock" clipPath="url(#clip0_201_22708)">
			<g id="Group 33551">
				<path
					id="Rectangle 37"
					d="M16.7735 8.24662C16.7735 3.64333 13.0418 -0.0883789 8.43852 -0.0883789C3.83522 -0.0883789 0.103516 3.64333 0.103516 8.24662C0.103516 12.8499 3.83522 16.5816 8.43852 16.5816C13.0418 16.5816 16.7735 12.8499 16.7735 8.24662Z"
					fill="#BD5100"
				/>
				<g id="Group 29775">
					<path
						id="Rectangle 6005"
						d="M8.85411 4.36675C8.85411 3.72747 8.33587 3.20923 7.69659 3.20923C7.0573 3.20923 6.53906 3.72747 6.53906 4.36675V9.46048C6.53906 10.0998 7.0573 10.618 7.69659 10.618C8.33587 10.618 8.85411 10.0998 8.85411 9.46048V4.36675Z"
						fill="white"
					/>
					<path
						id="Rectangle 6006"
						d="M8.39962 8.59764C7.87611 8.23074 7.15429 8.35769 6.78739 8.8812C6.42048 9.40471 6.54744 10.1265 7.07095 10.4934L9.72523 12.3537C10.2487 12.7206 10.9706 12.5937 11.3375 12.0702C11.7044 11.5466 11.5774 10.8248 11.0539 10.4579L8.39962 8.59764Z"
						fill="white"
					/>
				</g>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_201_22708">
				<rect width="16.67" height="16.67" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export default IconClockOrange;
