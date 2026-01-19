import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = req.query.url as string;
		if (!url) {
			return res.status(400).json({ error: 'URL parameter is required' });
		}

		console.info('get lottie json - ', JSON.stringify({ url }));

		const response = await fetch(url, {
			method: 'GET',
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /lottie-json', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get lottie json response', response.statusText);
		return res.status(200).json({
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success',
				at: Date.now(),
			},
			data,
		});
	} catch (error: any) {
		logApiError('GET /lottie-json', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
