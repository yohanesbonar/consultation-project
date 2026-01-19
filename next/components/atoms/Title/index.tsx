import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface TitleProps {
	title: string;
	center?: boolean;
	isLoading?: boolean;
}

const Title: React.FC<TitleProps> = ({ title, center = false, isLoading = false }) => {
	return (
		<div className={`font-24 tw-font-['Inter-Bold'] ${center ? 'tw-text-center' : ''}`}>
			{isLoading ? <Skeleton /> : title}
		</div>
	);
};

export default Title;
