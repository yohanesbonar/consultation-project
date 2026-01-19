import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { orderNumber } = req.query;
		const { authorization } = req.headers;

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${orderNumber}/patient`,
			timeout: 60000,
			data: req.body,
			headers: {
				...(authorization ? { authorization } : {}),
			},
		};

		console.info('consultation submit patient req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('consultation submit patient res', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn(
			'options for submit consultation',
			JSON.stringify(req.body),
			JSON.stringify(req.headers.authorization),
		);
		logApiError('POST /v1/consultation/[orderNumber]/patient', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
