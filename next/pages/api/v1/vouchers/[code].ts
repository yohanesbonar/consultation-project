import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { code } = req.query;
		const token = req.headers.token as string;

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/vouchers/${code}`,
			timeout: 60000,
			headers: {
				...(token ? { 'x-token': token } : {}),
			},
		};

		console.info('get voucher detail req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('get voucher detail response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		const { code } = req.query;
		console.warn('options for voucher detail', code, req.headers.token);
		logApiError('GET /v1/vouchers/[code]', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
