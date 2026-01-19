import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { id } = req.query;
		const token = req.headers.auth as string;

		const data = {
			reason_id: req.body?.reason_id,
			reason: req.body?.reason,
		};

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/checkout/${id}/complain`,
			timeout: parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT || '60000'),
			data,
			headers: {
				...(token ? { 'x-token': token } : {}),
			},
		};

		console.info('product complain req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('product complain response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn('options for post product complain', JSON.stringify(req.body), req.headers.auth);
		logApiError('POST /v1/checkout/[id]/complain', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
