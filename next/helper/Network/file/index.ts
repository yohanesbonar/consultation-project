import snapConfig from '../../../config';
import { getStorageParseDecrypt, LOCALSTORAGE } from '../../LocalStorage';
import { API } from '../API';
import { addLog } from '../master';
import { API_CALL, errorHandler } from '../requestHelper';
import imageCompression from 'browser-image-compression';

export const stringify = (obj) => {
	const replacer = [];
	for (const key in obj) {
		replacer.push(key);
	}
	return JSON.parse(JSON.stringify(obj, replacer));
};

const compressFile = async (file: any) => {
	try {
		const targetFile = file;
		if (!targetFile) throw 'files not found';
		if (!targetFile?.type?.includes('image')) return file;
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};

		const res = await imageCompression(targetFile, options);

		return new File([res], res.name, { type: res.type });
	} catch (error) {
		console.log('error on compress : ', error);
		addLog({ errCompress: error });
		return file;
	}
};

export const uploadFile = async (params) => {
	try {
		// const consulSession = await getSessionParseDecrypt(
		// 	SESSIONSTORAGE.CONSULTATION,
		// );
		const consulSession = await getStorageParseDecrypt(LOCALSTORAGE.CONSULTATION);
		const files = [...params];

		const data = new FormData();
		data.append('order_number', global?.orderNumber);
		for (let i = 0; i < files.length; i++) {
			// data.append('files', files[i]);
			data.append('files', await compressFile(files[i]));
		}
		const options = {
			url: snapConfig.BASE_API_URL + API.FILE_UPLOAD,
			data: data,
			method: 'POST',
			headers: {
				auth: global.tokenAuthorization ?? consulSession?.tokenAuthorization,
			},
		};

		const response = await API_CALL(options, 'multipart/form-data');
		return response;
	} catch (error) {
		console.log('error on upload file : ', error);
		return errorHandler(error);
	}
};

export const getFile = async (params: string | string[]) => {
	try {
		const options = {
			url: snapConfig.BASE_API_URL + API.GET_FILE,
			data: { url: params },
			responseType: 'blob',
			method: 'POST',
		};
		console.log('options network', options);

		const response = await API_CALL(options);
		return response;
	} catch (error) {
		console.log('error on upload file : ', error);
		return errorHandler(error);
	}
};
