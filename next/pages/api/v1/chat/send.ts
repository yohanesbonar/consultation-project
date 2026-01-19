import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const data = {
			action: req.body.action,
			type: req.body.type,
			userType: req.body.userType,
			localId: req.body.localId,
			createdAt: req.body.createdAt,
			message: req.body.message,
			status: req.body.status,
			data: req.body.data,
		};

		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/chat/message`;
		console.info('send chat patient req', JSON.stringify({ url, data }));

		const response = await axios.post(url, data, {
			headers: {
				authorization: req.headers.auth as string,
				'room-id': req.headers.room as string,
			},
			timeout: 60000,
		});

		console.info('send chat patient res', JSON.stringify(response.data));
		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('POST /v1/chat/send', error);
		return res
			.status(error?.response?.data?.meta?.status || 400)
			.json(error?.response?.data || error);
	}
}
