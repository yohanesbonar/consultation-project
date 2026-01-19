import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { orderNumber, type } = req.query;
		const { authorization } = req.headers;

		const timeout = parseInt(process.env.TIMEOUT || '60000', 10);

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${orderNumber}/${type}/user?latest=1`,
			timeout,
			headers: {
				...(authorization ? { authorization } : {}),
			},
		};

		console.info('consultation detail user req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('consultation detail user res', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn(
			'options for detail doctor patient',
			JSON.stringify(req.query),
			JSON.stringify(req.headers.authorization),
		);
		logApiError('GET /v1/consultation/[orderNumber]/[type]/user', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
