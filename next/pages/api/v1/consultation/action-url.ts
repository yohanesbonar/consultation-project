import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { authorization } = req.headers;
		const timeout = parseInt(process.env.TIMEOUT || '60000', 10);

		const options = {
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/action-url`,
			timeout,
			headers: {
				...(authorization ? { authorization } : {}),
			},
		};

		console.info('consultation action url req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('consultation action url res', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.error('get action consul error', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
