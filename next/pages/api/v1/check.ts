import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';
import { checkWhitelist, logApiError } from '../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const bytes = CryptoJS.AES.decrypt(req.body?.w, process.env.NEXT_PUBLIC_SNAP_KEY || '');
		const plaintext = bytes.toString(CryptoJS.enc.Utf8);
		const granted = checkWhitelist(plaintext);

		if (granted) {
			return res.status(200).json({
				status: 'Success',
				meta: {
					acknowledge: true,
					status: 200,
					message: 'Success',
					at: new Date(),
				},
			});
		} else {
			return res.status(400).json({
				status: 'Bad Request',
				meta: {
					acknowledge: false,
					status: 400,
					message: 'Bad Request',
					at: new Date(),
				},
			});
		}
	} catch (error) {
		logApiError('POST /v1/check', error);
		return res.status(400).json({
			status: 'Bad Request',
			meta: {
				acknowledge: false,
				status: 400,
				message: 'Bad Request',
				at: new Date(),
			},
		});
	}
}
