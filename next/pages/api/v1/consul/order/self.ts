import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const data = { ...req.body, preexisting_allergy: req.body.preexistingAllergy };
		if (data?.device === 'SHIELD_ERROR') {
			delete data.device;
		}

		const timeout = parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT ?? '60000');

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/self-order`,
			timeout,
			data,
			headers: {
				...(req.headers.token ? { 'x-token': req.headers.token as string } : {}),
				...(req.headers.ct ? { 'x-consultation-request-token': req.headers.ct as string } : {}),
			},
		};

		console.info('Request body self order', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('Submit self order log: ', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn(
			'options for submit self order consultation',
			JSON.stringify(req.body),
			req.headers.token,
		);
		logApiError('POST /v1/consul/order/self', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
