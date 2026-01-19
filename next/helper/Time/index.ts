import moment from 'moment';

const addZero = (time: number) => {
	try {
		if (time < 10) {
			return '0' + time;
		}
		return time;
	} catch (error) {
		console.log('error on  : ', error);
	}
};

export const getFormattedTimeFromSeconds = (seconds?: number, format = 'mm:ss') => {
	let res: any;
	if (seconds > 3599 && format == 'mm:ss') {
		format = 'HH:mm:ss';

		const dur = moment.duration(seconds, 'seconds');
		const hours = Math.floor(dur.asHours());
		const mins = Math.floor(dur.asMinutes()) - hours * 60;
		const secs = Math.floor(dur.asSeconds()) - hours * 60 * 60 - mins * 60;

		return addZero(hours) + ':' + addZero(mins) + ':' + addZero(secs);
	}
	try {
		res = moment('1945-08-17 00:00:00').add(seconds, 'seconds').format(format);

		return res;
	} catch (error: any) {
		console.log('error on  : ', error);
	}
};

export const getFormattedTimeFromDate = (date?: any, format = 'HH:mm') => {
	try {
		let dateMoment = moment.unix(date);
		if (!dateMoment.isValid() || Math.abs(dateMoment.year() - moment().year()) > 200) {
			dateMoment = moment(date);
		}
		const dateTemp = moment(dateMoment).subtract(global.timeGap, 'seconds');
		return dateTemp.format(format);
	} catch (error: any) {
		console.log('error on  : ', error);
		return moment(date).format(format);
	}
};

export const getCurrentTimeByTimeGap = () => {
	try {
		return moment().add(global?.timeGap ?? 0, 'seconds');
	} catch (error) {
		console.log('error on get current time : ', error);
	}
};

export const getFormattedDate = (date?: any, format = 'D MMM YYYY [jam] HH:mm') => {
	const dateMoment = moment(date);

	let res: any;
	try {
		res = dateMoment.format(format);
		return res;
	} catch (error: any) {
		console.log('error on formatDate : ', error);
	}
};

export const getTimeGap = (time?: any, serverDate?: Date) => {
	return Math.floor(moment.duration(moment(serverDate).diff(moment(time))).asSeconds());
};

export const getTimeLeft = (time?: any, serverDate?: any) => {
	if (moment(time).isBefore(moment(serverDate))) {
		return 0;
	}
	let timeleft: any = Math.floor(
		moment.duration(moment(time).diff(moment(serverDate))).asSeconds(),
	);
	timeleft = Math.abs(timeleft);
	return timeleft;
};

export const calculateAge = (birthdate?: Date) => {
	try {
		const age: any = moment().diff(birthdate, 'year', false);
		return age;
	} catch (error: any) {
		console.log('error on error calculate birthdate : ', error);
		return null;
	}
};

export const calculateAgeYearMonth = (birthdate?: Date) => {
	try {
		const target: any = moment();
		const months: any = target.diff(birthdate, 'months', true);
		const birthSpan: any = {
			year: Math.floor(months / 12),
			month: Math.floor(months) % 12,
			day: Math.round((months % 1) * target.daysInMonth()),
		};

		return birthSpan.year + ' tahun ' + birthSpan.month + ' bulan';
	} catch (error: any) {
		return null;
	}
};

export const checkIfExpired = (date: any = moment(), param = 1440, isMoreThan = true) => {
	const dateMoment: any = moment(date);
	let isExpired = true;
	try {
		const diffHour: any = isMoreThan
			? moment().diff(moment(dateMoment), 'minute')
			: moment(dateMoment).diff(moment(), 'minute');
		// console.log('diffhor', dateMoment, Math.abs(diffHour ?? 0));
		isExpired = isMoreThan ? Math.abs(diffHour ?? 0) >= param : (diffHour ?? 0) <= param;

		return isExpired;
	} catch (error: any) {
		console.log('error on  : ', error);
	}
};
