import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

// Disable body parsing, formidable will handle it
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Parse multipart form data - enable multiples for multiple file uploads
		const form = formidable({ multiples: true });

		const { fields, files } = await new Promise<{
			fields: formidable.Fields;
			files: formidable.Files;
		}>((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err);
				else resolve({ fields, files });
			});
		});

		// Simple like NestJS: just get the values
		// Handle formidable fields which can be arrays
		const orderNumber = Array.isArray(fields.order_number)
			? fields.order_number[0]
			: fields.order_number || '';
		const uploadedFiles = files.files
			? Array.isArray(files.files)
				? files.files
				: [files.files]
			: [];

		// Build FormData exactly like NestJS
		const formData = new FormData();
		formData.append('order_number', orderNumber);
		uploadedFiles.forEach((file: File) => {
			const fileBuffer = fs.readFileSync(file.filepath);
			formData.append('files', fileBuffer, file.originalFilename || 'file');
		});

		const url = `${process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL}v1/consultation/upload-file`;
		console.info('upload file req - ', JSON.stringify({ url, order_number: orderNumber }));

		// Use axios like NestJS does - better FormData handling
		const response = await axios.post(url, formData, {
			headers: {
				...(req.headers.auth ? { Authorization: req.headers.auth as string } : {}),
				...formData.getHeaders(),
			},
			timeout: parseInt(process.env.NEXT_PUBLIC_NEXT_TIMEOUT || '60000'),
		});

		console.info('upload file res', JSON.stringify(response.data));
		return res.status(200).json(response.data);
	} catch (error: any) {
		console.error('upload file error', error);

		// Handle timeout
		if (error?.code === 'ECONNABORTED') {
			return res.status(408).json({
				meta: {
					status: 408,
					message: 'Maaf, file gagal di upload. Periksa koneksi internet Anda dan coba lagi.',
				},
			});
		}

		// Handle axios errors
		const status =
			error?.response?.data?.meta?.status ||
			error?.meta?.status ||
			error?.response?.status ||
			500;
		const errorData = error?.response?.data ||
			error?.meta ||
			error?.data || {
				meta: {
					acknowledge: false,
					status: status,
					message: error?.message || 'Something went wrong!',
				},
			};

		return res.status(status).json(errorData);
	}
}
