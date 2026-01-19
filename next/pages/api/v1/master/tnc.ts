import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/tnc/patient/detail`;
		console.info('get master tnc req', JSON.stringify({ url }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...(req.headers.auth ? { Authorization: req.headers.auth as string } : {}),
				'Accept-Encoding': 'gzip,deflate,compress',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /v1/master/tnc', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get master tnc res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/master/tnc', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
