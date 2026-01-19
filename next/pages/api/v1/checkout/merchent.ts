import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { presc_id } = req.query;
		const token = req.headers.token as string;

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/checkout/merchant-list/${presc_id}`,
			timeout: 60000,
			headers: {
				...(token ? { 'x-token': token } : {}),
			},
		};

		console.info('get merchant list req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('get merchant list response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('GET /v1/checkout/merchent', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
