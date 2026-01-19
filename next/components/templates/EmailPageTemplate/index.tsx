import React from 'react';
import { ButtonHighlight, ImageLoading } from '@atoms';
import { MailSuccess } from '@images';
import { Wrapper } from '@organisms';
import { PAGE_ID } from 'helper';
import { useRouter } from 'next/router';
import styles from './index.module.css';

type Props = {
	email: string | string[];
};

const EmailPageTemplate = (props: Props) => {
	const router = useRouter();
	const { email } = props;
	const openMail = () => {
		window.open('https://mail.google.com');
	};

	const onClickBackHeader = () => {
		const url = `/order?token=${router.query?.token}`;
		window.location.replace(url);
	};
	return (
		<Wrapper
			title="Link Terkirim"
			metaTitle="Link Terkirim"
			additionalId={PAGE_ID.MAIL_SUCCESS}
			additionalClassNameContent={styles.container}
			onClickBack={onClickBackHeader}
		>
			{/* <img className={styles.mailImage} src={MailSuccess.src} alt="mail" /> */}
			<div className={styles.mailImage}>
				<ImageLoading data={{ url: MailSuccess.src }} className="" />
			</div>
			<p className={styles.title}>Link Akses Terkirim ke Email Anda</p>
			<p className={styles.desc}>
				Link akses untuk proses pembayaran dan telekonsultasi sudah terkirim ke email {email}.
				Silakan cek email Anda.
			</p>
			<div className={styles.btnContainer}>
				<ButtonHighlight onClick={openMail} text="BUKA EMAIL" className="tw-h-[48px]" />
			</div>
		</Wrapper>
	);
};

export default EmailPageTemplate;
