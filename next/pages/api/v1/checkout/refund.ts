import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const token = req.headers.auth as string;

		const data = {
			payment_method: req.body?.payment_method,
			payment_number: req.body?.payment_number,
			payment_customer_name: req.body?.payment_customer_name,
			phone_number: req.body?.phone_number,
		};

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/checkout/${req.body?.xid}/refund`,
			timeout: parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT || '60000'),
			data,
			headers: {
				...(token ? { 'x-token': token } : {}),
			},
		};

		console.info('refund form req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('refund form response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn('options for post refund form', JSON.stringify(req.body), req.headers.auth);
		logApiError('POST /v1/checkout/refund', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
