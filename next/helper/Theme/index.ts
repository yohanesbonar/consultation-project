export const getBrightness = (hex: string) => {
	try {
		const rgb = hexToRgb(hex);
		return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	} catch (error) {
		console.log('error on  : ', error);
	}
};

export const hexToRgb: any = (hex: string) => {
	try {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	} catch (error) {
		console.log('error on  : ', error);
	}
};
