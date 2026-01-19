const RATING_CONST = {
	HEADER_TITLE_CONSUL: 'Bagaimana Pengalaman Konsultasimu dengan Dokter Kami?',
	HEADER_TITLE_PRESC:
		'Konsultasi dapat diakhiri karena resep sudah terbit. Bagaimana Pengalaman Konsultasimu dengan Dokter Kami?',
	INPUT_PLACEHOLDER: 'Tulis detail masukan Anda (opsional)',
	SUBMIT_BTN: 'KIRIM FEEDBACK',
	W_REASON: 'Kami mohon maaf atas kekecewaan Anda. Apa yang perlu diperbaiki dari dokter kami?',
	BD_REASON:
		'Kami mohon maaf atas ketidaknyaman Anda. Apa yang perlu diperbaiki dari dokter kami?',
	GD_REASON:
		'Kami turut senang dengan kenyamanan Anda. Apa yang perlu diperbaiki dari dokter kami?',
	BS_REASON: 'Kami turut senang dengan kepuasan Anda. Apa yang membuat Anda puas?',
	PRESC_ACCEPT_TITLE: 'Dokter Sudah Meresepkan',
	PRESC_REJECT_TITLE: 'Maaf, Dokter Belum Menyetujui Resep Obat Anda',
};

const RATING_TYPE = {
	W: '1',
	BD: '2',
	GD: '3',
	BS: '4',
};

const REASON_DATA = {
	firstReason: [
		{
			id: 1,
			value: 'Kecepatan respon',
		},
		{
			id: 2,
			value: 'Keramahan dokter',
		},
		{
			id: 3,
			value: 'Penjelasan keluhan',
		},
		{
			id: 4,
			value: 'Kejelasan solusi',
		},
	],
	secondReason: [
		{
			id: 1,
			value: 'Cepat tanggap',
		},
		{
			id: 2,
			value: 'Ramah',
		},
		{
			id: 3,
			value: 'Penjelasan detail',
		},
		{
			id: 4,
			value: 'Diberikan resep',
		},
	],
};

export { RATING_CONST, RATING_TYPE, REASON_DATA };
