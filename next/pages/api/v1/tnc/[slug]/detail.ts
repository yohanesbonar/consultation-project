import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { slug } = req.query;
		const { authorization } = req.headers;

		const timeout = parseInt(process.env.TIMEOUT || '60000', 10);

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/tnc/${slug}/detail`,
			timeout,
			headers: {
				...(authorization ? { authorization } : {}),
			},
		};

		console.info('tnc detail req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('tnc detail res', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.warn('options for tnc detail ', req.query.slug, req.headers.authorization);
		logApiError('GET /v1/tnc/[slug]/detail', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
