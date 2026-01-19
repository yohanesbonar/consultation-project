import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const xid = req.headers.xid as string;
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/tnc/patient/detail?xid=${
			xid || ''
		}`;
		console.info('get master tnc partner req', JSON.stringify({ url }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept-Encoding': 'gzip,deflate,compress',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /v1/master/tnc-partner', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get master tnc partner res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/master/tnc-partner', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
