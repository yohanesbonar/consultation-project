import React from 'react';

const PreviewOverlay = () => (
	<div
		style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0)',
			zIndex: 9999,
		}}
	/>
);

export default PreviewOverlay;
