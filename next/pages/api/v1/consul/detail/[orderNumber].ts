import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import moment from 'moment';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { orderNumber } = req.query;
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${orderNumber}/detail`;

		console.info('consultation detail reqq', JSON.stringify({ url }));

		const response = await axios.get(url, {
			headers: {
				authorization: req.headers.authorization as string,
			},
			timeout: 60000,
		});

		const result = response.data;

		// Handle expired consultation logic
		if (result?.meta?.acknowledge) {
			try {
				const expiredAt = result?.data?.expiredAt;
				if (result?.data?.status === 'COMPLETED') {
					result.data.messages = [];
				} else if (moment(result?.meta?.at).isAfter(moment(expiredAt))) {
					result.data.messages = [];
				}
			} catch (error) {
				logApiError('GET /v1/consul/detail/[orderNumber] (expired check)', error);
			}
		}

		console.info('consultation detail res', JSON.stringify(result));
		return res.status(200).json(result);
	} catch (error: any) {
		logApiError('GET /v1/consul/detail/[orderNumber]', error);
		return res
			.status(error?.response?.data?.meta?.status || 400)
			.json(error?.response?.data || error);
	}
}
