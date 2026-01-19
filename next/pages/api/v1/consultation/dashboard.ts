import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/checkout/complain-reason`;
		console.info('get dashboard req', JSON.stringify({ url }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-token': (req.headers.token as string) || '',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('get dashboard error', data);
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get dashboard res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		console.error('get dashboard error', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
