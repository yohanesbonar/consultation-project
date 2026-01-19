import crypto from 'crypto';

export const loggedIn = () => {
	const user = localStorage.getItem('user');

	if (user) {
		return true;
	} else {
		return false;
	}
};

export const getProfile = () => {
	const user: any = localStorage.getItem('user');

	if (user) {
		const contents = Buffer.from(user, 'hex');
		const iv = contents.slice(0, 16);
		const textBytes = contents.slice(16);
		const decipher: any = crypto.createDecipheriv(
			'aes-256-cbc',
			process.env.NEXT_PUBLIC_APP_KEY,
			iv,
		);
		let decrypted = decipher.update(textBytes, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return JSON.parse(decrypted);
	} else {
		return false;
	}
};
