import React, { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import { numberToIDR } from 'helper';

type Props = {
	textClass?: string;
	isLoading?: boolean;
	isCurrency?: boolean;
	isMinus?: boolean;
	skeletonClass?: string;
	children: string | number | ReactNode;
	onClick?: () => void;
	prefixComponent?: any;
};

const Text = (props: Props) => {
	const {
		isLoading,
		children,
		skeletonClass = 'tw-w-24 tw-h-7',
		isCurrency,
		isMinus,
		textClass,
		onClick,
		prefixComponent,
	} = props;
	return (
		<p className={textClass} onClick={onClick}>
			{prefixComponent && prefixComponent}
			{isLoading ? (
				<Skeleton className={skeletonClass} />
			) : isCurrency ? (
				(isMinus ? '-' : '') + numberToIDR(Number(children))
			) : (
				children
			)}
		</p>
	);
};

export default Text;
