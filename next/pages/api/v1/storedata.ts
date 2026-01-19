import type { NextApiRequest, NextApiResponse } from 'next';
import { encryptData, logApiError } from '../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const dataTemp = encryptData(req.body?.params);
		return res.status(200).json({
			status: 'Success',
			data: dataTemp,
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success',
				at: new Date(),
			},
		});
	} catch (error) {
		logApiError('POST /v1/storedata', error);
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
