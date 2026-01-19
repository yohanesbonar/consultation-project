/* eslint-disable @typescript-eslint/no-empty-function */
import { StaticImageData } from 'next/image';
import React from 'react';
import { ButtonHighlight, ImageLoading } from '../../atoms';
import { Wrapper } from '../../organisms';

type Props = {
	id?: string;
	image: string | StaticImageData;
	title: string;
	description: string;
	type?: 'default' | 'generalError';
	backUrl?: () => void;
	backDescription?: string;
};

const ErrorPageTemplate = ({
	id,
	image,
	title,
	description,
	type = 'default',
	backUrl = () => {},
	backDescription = '',
}: Props) => {
	const body = () => {
		return (
			<div className="tw-m-auto tw-text-center">
				<div className="tw-w-[330px] tw-h-[220px] tw-relative tw-mx-auto">
					<ImageLoading
						classNameContainer="tw-rounded-[50%] tw-overflow-hidden"
						className="tw-rounded-[50%]"
						data={{ url: image }}
					/>
				</div>
				<div className="tw-mt-6">
					<div className="title-20-medium">{title}</div>
					<div className="body-16-regular tw-mt-4">{description}</div>
				</div>

				{type == 'generalError' && backUrl && (
					<div className="body-width absolute-bottom-16 tw-flex">
						<ButtonHighlight text={backDescription} onClick={backUrl} className="tw-flex-1" />
					</div>
				)}
			</div>
		);
	};

	return type == 'generalError' ? (
		body()
	) : (
		<Wrapper
			additionalId={id}
			header={false}
			additionalStyleContent={{
				display: 'flex',
				overflowY: 'hidden',
			}}
		>
			{body()}
		</Wrapper>
	);
};

export default ErrorPageTemplate;
