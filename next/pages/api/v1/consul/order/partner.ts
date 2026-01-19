import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const data = { ...req.body };
		if (data?.device === 'SHIELD_ERROR') {
			delete data.device;
		}

		const { authorization } = req.headers;
		const timeout = parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT ?? '60000');

		const options = {
			method: 'POST',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/partner/order`,
			timeout,
			data,
			headers: {
				'x-key': process.env.NEXT_PUBLIC_MAIN_PARTNER_KEY,
				...(authorization ? { 'x-authorization': authorization as string } : {}),
			},
		};

		console.info('order partner request payload', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('order partner response', JSON.stringify(response.data));
		console.info('log order info - ', JSON.stringify(response.data?.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn('options for submit order partner consultation', req.body, {
			'x-key': process.env.NEXT_PUBLIC_MAIN_PARTNER_KEY,
			'x-authorization': req.headers.authorization,
		});
		console.error('submit order partner error', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
