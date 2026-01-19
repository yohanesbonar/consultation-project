import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const result = {
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success',
				at: Date.now(),
			},
			data: {},
		};
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(400).json({ error: 'Server error' });
	}
}
