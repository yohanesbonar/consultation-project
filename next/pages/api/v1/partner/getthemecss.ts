import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const token = (req.query.token as string) || '';

		const url = `${
			process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL
		}v1/partner/theme-css?token=${encodeURIComponent(token)}`;
		console.info('get theme css req', JSON.stringify({ url, token: token ? '***' : 'none' }));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'text/css',
			},
			cache: 'no-store',
		});

		const css = await response.text();

		if (!response.ok) {
			logApiError('GET /v1/partner/getthemecss', {
				response: { status: response.status, data: css },
			});
			let errorData;
			try {
				errorData = JSON.parse(css);
			} catch {
				errorData = { meta: { status: response.status }, message: css };
			}
			res.setHeader('Content-Type', 'text/css');
			return res.status(errorData?.meta?.status || response.status || 400).send(css);
		}

		console.info('get theme css res', typeof css === 'string' ? css.substring(0, 10) : '');
		res.setHeader('Content-Type', 'text/css');
		return res.status(200).send(css);
	} catch (error: any) {
		logApiError('GET /v1/partner/getthemecss', error);
		const body = typeof error === 'string' ? error : JSON.stringify(error);
		res.setHeader('Content-Type', 'text/css');
		return res.status(error?.meta?.status || 400).send(body);
	}
}
