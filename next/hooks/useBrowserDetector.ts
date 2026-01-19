import { useState, useEffect } from 'react';

function useBrowserDetector(): string {
	const [browserName, setBrowserName] = useState<string>('');

	useEffect(() => {
		const userAgent = navigator.userAgent;
		let detectedBrowser = '';

		if (userAgent.match(/Firefox/i)) {
			detectedBrowser = 'Mozilla Firefox';
		} else if (userAgent.match(/Edg/i)) {
			detectedBrowser = 'Microsoft Edge';
		} else if (userAgent.match(/OPR\//i) || userAgent.match(/Opera/i)) {
			detectedBrowser = 'Opera';
		} else if (userAgent.match(/Chrome/i)) {
			detectedBrowser = 'Google Chrome';
		} else if (userAgent.match(/Safari/i)) {
			detectedBrowser = 'Safari';
		} else {
			detectedBrowser = 'Unknown';
		}

		setBrowserName(detectedBrowser);
	}, []);

	return browserName;
}

export default useBrowserDetector;
