import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		console.warn('log - ', JSON.stringify(req.body));
		return res.status(200).json(true);
	} catch (error) {
		console.warn('error on add log : ', error);
		return res.status(200).json(true);
	}
}
