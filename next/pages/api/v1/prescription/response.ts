import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { orderNumber, status } = req.body;
		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/${orderNumber}/offering-update`;

		console.info('consultation offering update req ', JSON.stringify({ url, status }));

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(req.headers.auth ? { authorization: req.headers.auth as string } : {}),
			},
			body: JSON.stringify({ status }),
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			logApiError('POST /v1/prescription/response', {
				response: { status: response.status, data },
			});
			return res.status(data?.meta?.status || response.status || 400).json(data);
		}

		console.info('consultation offering update res ', JSON.stringify(data));
		return res.status(200).json(data);
	} catch (error: any) {
		console.warn(
			'options for post prescription response',
			JSON.stringify(req.body),
			req.headers.auth,
		);
		logApiError('POST /v1/prescription/response', error);
		return res.status(error?.meta?.status || 400).json(error);
	}
}
