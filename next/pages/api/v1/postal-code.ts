import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const keyword = req.query.keyword as string;
		const page = req.query.page as string;

		let params = '';
		if (keyword?.length > 0) {
			params += `?keyword=${keyword}`;
		}
		if (page != null) {
			params += (keyword?.length > 0 ? '&' : '?') + `page=${page}`;
		}

		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/postal-code${params}`;
		console.info('get postal code req', JSON.stringify({ url }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-token': (req.headers.token as string) || '',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('GET /v1/postal-code', { response: { status: response.status, data } });
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get postal code res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('GET /v1/postal-code', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
