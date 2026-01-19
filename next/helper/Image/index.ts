import { FILE_CONST, MESSAGE_CONST } from '../Const';
import React from 'react';
import html2canvas from 'html2canvas';
import { getFile } from 'helper/Network';

// link library : https://www.npmjs.com/package/html2canvas

const getBase64Image = async (imageUrl: string): Promise<string> => {
	const response = await getFile(imageUrl);

	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.readAsDataURL(response);
	});
};

/**
 * Captures a hidden element, ensures external images are converted to Base64,
 * and downloads it as a JPG.
 */
export const downloadHiddenElementAsJPG = async (
	elementRef: React.RefObject<HTMLElement>,
	fileName = 'download.jpg',
	callback: any,
): Promise<void> => {
	if (!elementRef.current) return;

	try {
		const images = elementRef.current.querySelectorAll('img');

		// Convert all images to Base64
		const promises = Array.from(images).map(async (img) => {
			if (img.src.startsWith('data:')) return; // Skip if already Base64

			const base64 = await getBase64Image(img.src);
			img.setAttribute('src', base64);
		});

		await Promise.all(promises); // Wait for all images to convert

		// Temporarily show the hidden section
		const originalDisplay = elementRef.current.style.display;
		const originalHeight = elementRef.current.style.height;
		const originalWidth = elementRef.current.style.width;
		elementRef.current.style.display = 'block';
		elementRef.current.style.height = '180px';
		elementRef.current.style.width = '180px';
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Capture the element
		const canvas = await html2canvas(elementRef.current, {
			backgroundColor: '#fff',
			useCORS: true,
		});

		// Restore original display
		elementRef.current.style.display = originalDisplay;
		elementRef.current.style.height = originalHeight;
		elementRef.current.style.width = originalWidth;

		// Convert to JPG and download
		const image = canvas.toDataURL('image/jpeg', 1.0);
		const link = document.createElement('a');
		link.href = image;
		link.download = fileName;
		link.click(); // comment temporary

		// window.open(image, '_blank');

		// const newTab = window.open('https://www.google.com', '_blank');
		// if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
		// 	addLog({ webViewAction: 'WebView memblokir pembukaan tab baru!' });
		// } else {
		// 	addLog({ webViewAction: 'WebView mengizinkan pembukaan tab baru!' });
		// }

		callback();
	} catch (error) {
		console.error('Error capturing hidden element as JPG:', error);
	}
};

export const getFilesUrl = (files: any) =>
	new Promise((resolve, reject) => {
		try {
			const fileTemps: string[] = [];

			[...files].forEach(async (element: any) => {
				const file = getUrls(element);
				// console.log('file', file);
				fileTemps.push(file);
			});
			resolve(fileTemps);
		} catch (error) {
			console.log('error on get files url : ', error);
			reject(error);
		}
	});

export const getUrls = (file: any) => {
	try {
		return URL.createObjectURL(file);
	} catch (error) {
		console.log('error on geturls: ', error);
		return null;
	}
};

export const validateType = (fileParams: any, type: string) => {
	let resValidation: { isValid: boolean; message: string } = {
		isValid: true,
		message: '',
	};
	try {
		if (
			type == FILE_CONST.PHOTO &&
			fileParams?.some((e: any) => e.type != 'image/jpeg' && e.type != 'image/png')
		) {
			resValidation = {
				isValid: false,
				message: 'Format gambar harus PNG/JPEG',
			};
		} else if (
			type == FILE_CONST.FILE &&
			fileParams?.some((e: any) => e.type != 'application/pdf')
		) {
			resValidation = {
				isValid: false,
				message: 'Format File harus PDF',
			};
		}
		return resValidation;
	} catch (error) {
		console.log('error on validate type : ', error);
		resValidation = {
			isValid: false,
			message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
		};
	}
};

export const validateSize = (params: any) => {
	let resValidation: { isValid: boolean; message: string } = {
		isValid: true,
		message: '',
	};
	try {
		params.forEach((element: any) => {
			if (!element?.type?.includes('image') && element?.size > 5242880) {
				resValidation = {
					isValid: false,
					message: MESSAGE_CONST.MAX_5MB,
				};
			}
		});

		return resValidation;
	} catch (error) {
		console.log('error on validate size : ', error);
		resValidation = {
			isValid: false,
			message: MESSAGE_CONST.SOMETHING_WENT_WRONG,
		};
	}
};
