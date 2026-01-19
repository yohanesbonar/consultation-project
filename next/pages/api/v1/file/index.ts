import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const url = req.body.url;

		if (!url) {
			return res.status(400).json({ error: 'URL is required' });
		}

		// Whitelist validation
		const whitelistedDomains = [
			'https://static.ddd.co.id',
			'https://assist-id-mcu.is3.cloudhost.id',
		];
		const isDomainValid = whitelistedDomains.some((domain) => url.startsWith(domain));

		if (!isDomainValid) {
			throw "The url isn't allowed to access";
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw `Failed to fetch file: ${response.statusText}`;
		}

		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		res.setHeader('Content-Type', blob.type);
		return res.status(200).send(buffer);
	} catch (error: any) {
		logApiError('GET /v1/file', error);
		return res.status(403).send(error);
	}
}
