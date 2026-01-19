import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { orderNumber } = req.query;
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/teleconsultation/${orderNumber}/close`;

		console.info('consultation end req', JSON.stringify({ url, body: req.body }));

		const response = await axios.post(url, req.body, {
			headers: {
				authorization: req.headers.auth as string,
			},
			timeout: 60000,
		});

		console.info('consultation end res', JSON.stringify(response.data));
		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('POST /v1/teleconsultation/[orderNumber]/close', error);
		return res
			.status(error?.response?.data?.meta?.status || 400)
			.json(error?.response?.data || error);
	}
}
