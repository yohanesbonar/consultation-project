const FaskesInfo = ({ data }: { data?: Array<any> }) => {
	if (data && data?.length > 0) {
		return (
			<>
				<div className="tw-flex tw-px-4 tw-pb-4 tw-flex-col">
					{data?.map((section: any, i: number) => (
						<div key={i}>
							{section?.sectionLabel && (
								<div className="tw-mt-4 tw-flex tw-flex-1 tw-text-black label-16-medium">
									{section.sectionLabel}
								</div>
							)}

							{section?.items &&
								section?.items?.length > 0 &&
								section?.items?.map((item: any, j: number) => (
									<div key={j}>
										{item?.title && (
											<div className="tw-mt-2 tw-flex tw-flex-1 tw-text-black label-14-medium">
												{item?.title}
											</div>
										)}

										{item?.subtitles &&
											item?.subtitles?.length > 0 &&
											item?.subtitles?.map((subtitle: any, k: number) => (
												<div key={k}>
													{subtitle && (
														<div className="tw-flex tw-flex-1 tw-text-tpy-700 label-12-medium">
															{subtitle}
														</div>
													)}
												</div>
											))}
									</div>
								))}
						</div>
					))}
				</div>
			</>
		);
	}

	return null;
};

export default FaskesInfo;
