import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = req.query.url as string;
		if (!url) {
			return res.status(400).json({ error: 'URL parameter is required' });
		}

		const fullUrl = `https://static.ddd.co.id/dev/dharma_dexa/${url}`;
		console.info('get animate list - ', JSON.stringify({ url: fullUrl }));

		const response = await fetch(fullUrl, {
			method: 'GET',
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /animation/dexa', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get animate list response', response.statusText);
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /animation/dexa', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
