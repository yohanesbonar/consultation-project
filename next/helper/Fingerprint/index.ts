import { load } from '@fingerprintjs/botd';
import Router from 'next/router';

export const detectBot = async () => {
	const res = false;
	try {
		const botdPromise = load();
		// Get detection results when you need them.
		botdPromise
			.then((botd) => botd.detect())
			.then((result) => {
				console.log('bot', result);
				if (result?.bot) {
					return Router.push({
						pathname: '/503',
						query: { type: 'bot' },
					});
				}
			})
			.catch((error) => console.error(error));
	} catch (error) {
		console.log(error);
	}
	return res;
};
