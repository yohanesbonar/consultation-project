// TODO: fix these lints
/* eslint-disable react/prop-types */
interface CountdownBadgeProps {
	value: string;
	className?: string;
}
const CountdownBadge: React.FC<CountdownBadgeProps> = ({ value, className }) => {
	return (
		<div
			className={`tw-flex tw-items-center body-12-regular tw-mb-0 tw-text-tpy-50 tw-px-2 tw-py-1 tw-bg-error-600 tw-rounded-full ${className}`}
		>
			{value}
		</div>
	);
};

export default CountdownBadge;
