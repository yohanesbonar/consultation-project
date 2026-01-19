import classnames from 'classnames';
import React, { useState } from 'react';

interface ButtonOpacity {
	onClick: () => void;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
	text: string;
	customClassname?: React.HTMLAttributes<HTMLDivElement>['className'];
	loading?: boolean;
}

const ButtonOpacity: React.FC<ButtonOpacity> = ({
	onClick,
	prefixIcon = null,
	suffixIcon = null,
	text,
	customClassname,
	loading = false,
}) => {
	const [isClicked, setIsClicked] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		if (!loading) {
			setIsClicked(true);
			onClick();
			setTimeout(() => {
				setIsClicked(false);
			}, 200); // Reset opacity after 200ms
		}
	};

	return (
		<div
			onClick={handleClick}
			className={classnames(
				'tw-flex tw-gap-3 tw-px-4 tw-py-3 tw-bg-blue-light tw-rounded-lg tw-items-center tw-cursor-pointer hover:tw-opacity-90',
				{ '!tw-opacity-50': isClicked, 'tw-cursor-not-allowed': loading },
				customClassname,
			)}
		>
			{prefixIcon}
			<div className="tw-flex-1 title-14-medium tw-select-none">{text}</div>
			{suffixIcon}
		</div>
	);
};

export default ButtonOpacity;
