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

		const response = await fetch(url, {
			method: 'GET',
			cache: 'no-store',
		});

		const html = await response.text();

		if (!response.ok) {
			logApiError('GET /metadata', {
				response: { status: response.status, statusText: response.statusText },
			});
			return res.status(response.status).send(null);
		}

		return res.status(200).send(html);
	} catch (error: any) {
		logApiError('GET /metadata', error);
		return res.status(500).send(null);
	}
}
