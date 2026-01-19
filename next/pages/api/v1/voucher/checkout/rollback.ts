import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const token = req.headers.token as string;

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/checkout/voucher/rollback`,
			timeout: 60000,
			data: req.body,
			headers: {
				...(token ? { 'x-token': token } : {}),
			},
		};

		console.info('post rollback checkout voucher req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('post rollback checkout voucher response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('POST /v1/voucher/checkout/rollback', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
