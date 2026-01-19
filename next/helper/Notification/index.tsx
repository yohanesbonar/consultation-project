interface NotificationPayload {
	title: string;
	body: string;
	token?: string;
}

// Detect Samsung browser using regex
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isSamsungBrowser = () => {
	const userAgent = navigator.userAgent;
	// Regex patterns for Samsung stock browser detection
	const samsungPatterns = [
		/samsungbrowser/i, // Samsung Browser
		/samsung internet/i, // Samsung Internet
		/samsung.*mobile/i, // Samsung Mobile devices
		/samsung.*android/i, // Samsung Android devices
		/sm-[a-z0-9]+/i, // Samsung device model codes
		/samsung.*chrome/i, // Samsung Chrome variant
		/samsung.*webview/i, // Samsung WebView
	];

	return samsungPatterns.some((pattern) => pattern.test(userAgent));
};

// I added a function that can be used to register a service worker.
const registerServiceWorker = async () => {
	const swRegistration = await navigator.serviceWorker.register('sw.js'); //notice the file name
	return swRegistration;
};

const customNotificationMobile = async (payload: NotificationPayload) => {
	await registerServiceWorker();
	navigator.serviceWorker.ready.then(function (registration) {
		registration.showNotification(payload.title, {
			body: payload.body,
			badge: 'favicon.ico',
			icon: 'favicon.ico',
			requireInteraction: true,
			silent: false,
			data: {
				token: payload.token,
			},
		});
	});
};

export const requestNotificationPermission = async () => {
	try {
		const permission = await Notification.requestPermission();
		return permission === 'granted';
	} catch (error) {
		console.log('Error requesting notification permission:', error);
		return false;
	}
};

export function showLocalNotification(payload: NotificationPayload) {
	if (!('Notification' in window)) {
		console.log('Notification not available');
		return;
	}

	if (Notification.permission === 'granted') {
		customNotificationMobile(payload);
	} else {
		// Request permission if not granted
		requestNotificationPermission().then((granted) => {
			if (granted) {
				customNotificationMobile(payload);
			} else {
				console.log('Notification denied');
			}
		});
	}
}
