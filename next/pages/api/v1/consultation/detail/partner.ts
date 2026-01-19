import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const token = req.headers.token as string;

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/partner/consultation-detail`,
			timeout: 60000,
			headers: {
				...(token ? { 'x-consultation-request-token': token } : {}),
			},
		};

		console.info('get partner consultation detail req log: ', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('get partner consultation detail res log: ', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.error('get partner consultation detail error', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
