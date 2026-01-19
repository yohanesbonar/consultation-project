import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/general-setting`;

		console.info('consultation general setting req', JSON.stringify({ url }));

		const response = await axios.get(url, {
			headers: {
				authorization: req.headers.authorization as string,
			},
			timeout: 60000,
		});

		console.info('consultation general setting res', JSON.stringify(response.data));
		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('GET /v1/consultation/general-setting', error);
		return res
			.status(error?.response?.data?.meta?.status || 400)
			.json(error?.response?.data || error);
	}
}
