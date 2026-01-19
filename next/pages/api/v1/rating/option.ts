import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const auth = req.headers.auth as string;
		const timeout = parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT || '60000');

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/rating-label`,
			headers: {
				...(auth ? { Authorization: auth } : {}),
			},
			timeout,
		};

		console.info('get rating label - ', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('get rating label response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('GET /v1/rating/option', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
