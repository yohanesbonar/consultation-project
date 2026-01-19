/* eslint-disable react-hooks/exhaustive-deps */
// need to check exhaustive-deps
import { useEffect, useRef, useState } from 'react';

type Props = {
	duration?: number;
	handleTimeout?: () => any;
};

const CountdownNumber = ({
	duration = null,
	handleTimeout = () => {
		// intentional
	},
}: Props) => {
	const [time, setTime] = useState(null);
	const timerRef = useRef(null);

	useEffect(() => {
		if (duration != time) {
			clearTimeout(timerRef.current);
			setTime(duration);
		}
	}, [duration]);

	useEffect(() => {
		if (duration != null && time != null) {
			if (time > 0) {
				updateTimeLeft();
			} else {
				console.log('time is up');

				clearTimeout(timerRef.current);
				handleTimeout();
			}
		}
	}, [time]);

	const updateTimeLeft = () => {
		timerRef.current = setTimeout(() => {
			setTime(time - 1);
		}, 1000);
	};

	return <div>{time}</div>;
};

export default CountdownNumber;
