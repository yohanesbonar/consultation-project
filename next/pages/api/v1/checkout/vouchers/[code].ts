import type { NextApiRequest, NextApiResponse } from 'next';
import { logApiError } from '../../../../../lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { code } = req.query;
		const token = req.headers.token as string;

		console.warn('options for detail checkout vouchers', code, token);

		// NestJS returns hardcoded mock data for this endpoint
		const mockResponse = {
			meta: {
				acknowledge: true,
				status: 200,
				message: 'Success get vouchers',
				at: new Date().toISOString(),
			},
			data: {
				name: 'Voucher nol rupiah. dua',
				code: 'test12345',
				min_transaction: 1,
				end_date: '2024-04-12 23:59:59',
				tnc: '<p>COba dulu.</p>',
			},
		};

		return res.status(200).json(mockResponse);
	} catch (error: any) {
		const { code } = req.query;
		console.warn('options for detail checkout vouchers', code, req.headers.token);
		logApiError('GET /v1/checkout/vouchers/[code]', error);

		const status = error?.response?.data?.meta?.status || error?.response?.status || 400;
		const errorData = error?.response?.data || { message: error.message };
		return res.status(status).json(errorData);
	}
}
