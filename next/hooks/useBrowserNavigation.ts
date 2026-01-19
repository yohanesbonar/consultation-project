import { useEffect } from 'react';

function useBrowserNavigation(callback?: () => void): void {
	useEffect(() => {
		window.history.pushState(null, null, window.location.href);
		window.onpopstate = function () {
			if (callback) callback();
			window.history.go(1);
		};
	}, []);
}

export default useBrowserNavigation;
