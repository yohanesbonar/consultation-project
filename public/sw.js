self.addEventListener('notificationclick', (event) => {
	console.log('On notification click: ', event.notification.tag);

	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: 'window',
			})
			.then((clientList) => {
				for (const client of clientList) {
					if ('focus' in client) return client.focus();
				}
				if (clients.openWindow) {
					event.notification.close();
					if (event.notification && event.notification.data && event.notification.data.token) {
						return clients.openWindow('/order?token=' + event.notification.data.token);
					}
					return clients.openWindow('/chat-detail');
				}
			}),
	);
});
