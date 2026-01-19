import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const token = (req.headers.token as string) || (req.headers['x-token'] as string) || '';

		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/partner/theme`;
		console.info('get theme req', JSON.stringify({ url, token: token ? '***' : 'none' }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-token': token,
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /v1/partner/gettheme', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get theme res', JSON.stringify(data));
		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/partner/gettheme', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
