import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { id } = req.body;
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${id}/patient-recommendation`;

		console.info('get patient recommendation req: ', JSON.stringify({ url, id }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...(req.headers.auth ? { authorization: req.headers.auth as string } : {}),
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('get patient recommendation error', data);
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get patient recommendation res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/patient-recommendation', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
