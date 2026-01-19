import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/partner/detail`;
		const headers: Record<string, string> = {
			'Accept-Encoding': 'gzip,deflate,compress',
		};

		if (req.headers.token) {
			headers['x-token'] = req.headers.token as string;
		}
		if (req.headers.ct) {
			headers['x-consultation-request-token'] = req.headers.ct as string;
		}

		console.info('get partner detail req', JSON.stringify({ url, headers }));

		const response = await fetch(url, {
			method: 'GET',
			headers,
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /v1/master/partner-detail', {
				response: { status: response.status, data },
			});
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get partner detail res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/master/partner-detail', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
