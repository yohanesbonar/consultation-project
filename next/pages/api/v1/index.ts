import type { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../../package.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		return res.status(200).json({
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success',
				at: Date.now(),
			},
			data: {
				alive: true,
				title: 'Welcome to Dkonsul',
				description: '',
				version: packageJson.version,
				versionStg: packageJson.versionStg,
				copyright: 'PT Global Urban Esensial',
			},
		});
	} catch (error: any) {
		return res.status(400).json(error);
	}
}
