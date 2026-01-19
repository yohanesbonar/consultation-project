import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { keyword, types, components, language } = req.query;

		let queryParams = `?input=${keyword || ''}`;
		if (types) queryParams += `&types=${types}`;
		queryParams += `&components=${components || ''}`;
		queryParams += `&language=${language || ''}`;
		queryParams += `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;

		const options = {
			method: 'GET',
			url: `https://maps.googleapis.com/maps/api/place/autocomplete/json${queryParams}`,
			timeout: 60000,
		};

		console.info('get address list req', JSON.stringify(options));

		const response = await axios.request(options);

		console.info('get address list response', JSON.stringify(response.data));

		return res.status(200).json(response.data);
	} catch (error: any) {
		logApiError('GET /place/autocomplete/json', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
