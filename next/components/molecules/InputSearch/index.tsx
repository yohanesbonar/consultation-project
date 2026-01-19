import { IconClearSearch, IconSearch } from '@icons';
import React from 'react';
import styles from './index.module.css';

interface Props {
	placeholder?: string;
	name?: string;
	value?: any;
	onChange?: (e: any) => void;
	onClear?: () => void;
	isShowMessage?: boolean;
	message?: string;
}

const InputSearch = (props: Props) => {
	const { name, value, placeholder, onChange, onClear, isShowMessage, message } = props;
	return (
		<>
			<div className="tw-bg-monochrome-150 tw-flex tw-items-center tw-rounded-[4px]">
				<div className="tw-p-2">
					<IconSearch />
				</div>
				<input
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={styles.inputSearch}
				/>
				{value?.length > 0 && (
					<div onClick={onClear} className="tw-mr-4 tw-cursor-default">
						<IconClearSearch />
					</div>
				)}
			</div>
			{isShowMessage && <p className={styles.bottomMessage}>{message}</p>}
		</>
	);
};

export default InputSearch;
