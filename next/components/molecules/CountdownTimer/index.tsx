import { useEffect, useRef, useState } from 'react';

type Props = {
	duration?: number;
	setTimeLeft?: (timeLeft: number) => void;
	updateTime?: (time: number) => void;
};

const CountdownTimer = ({
	duration = null,
	setTimeLeft = (_timeLeft) => {
		/* intentional */
	},
	updateTime = (_time) => {
		/* intentional */
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
				setTimeLeft(0);
			}
			updateTime(time);
		}
	}, [time]);

	const updateTimeLeft = () => {
		timerRef.current = setTimeout(() => {
			setTime(time - 1);
		}, 1000);
	};

	return null;
};

export default CountdownTimer;
