import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { id, enabler_token } = req.body;
		const enablerParam = enabler_token ? `?enabler_token=${enabler_token}` : '';
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${id}/eprescription${enablerParam}`;

		console.info('get prescription req: ', JSON.stringify({ url, id }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...(req.headers.auth ? { authorization: req.headers.auth as string } : {}),
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('POST /v1/prescription/detail', {
				response: { status: response.status, data },
			});
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('get prescription res', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		logApiError('POST /v1/prescription/detail', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
