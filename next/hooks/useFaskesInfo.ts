import { useMemo } from 'react';
import { convertToObj, checkIsEmpty, capitalizeEachWords, PRESCRIPTION_CONST } from '../helper';

const useFaskesInfo = (data) => {
	const faskesInfo = useMemo(() => {
		const patient = convertToObj(data?.patient, 'label', 'value');
		const healthFacility = convertToObj(data?.medical_facility, 'label', 'value');
		const doctor = convertToObj(data?.doctor, 'label', 'value');
		if (!checkIsEmpty(patient) && !checkIsEmpty(healthFacility) && !checkIsEmpty(doctor)) {
			return [
				{
					sectionLabel: 'Fasilitas Kesehatan',
					items: [
						{
							title: healthFacility[PRESCRIPTION_CONST.HEALTH_FACILITY_NAME],
							subtitles: [healthFacility[PRESCRIPTION_CONST.HEALTH_FACILITY_ADDRESS] || '-'],
						},
					],
				},
				{
					sectionLabel: 'Dokter',
					items: [
						{
							title: doctor[PRESCRIPTION_CONST.DOCTOR_NAME],
							subtitles: [
								...(doctor[PRESCRIPTION_CONST.DOCTOR_SPECIALIZATION] ?? []),
								doctor[PRESCRIPTION_CONST.DOCTOR_REFERENCE_NUMBER],
							],
						},
					],
				},
				{
					sectionLabel: 'Pasien',
					items: [
						{
							title: patient[PRESCRIPTION_CONST.PATIENT_NAME],
							subtitles: [
								` ${
									patient[PRESCRIPTION_CONST.PATIENT_GENDER] != null
										? capitalizeEachWords(patient[PRESCRIPTION_CONST.PATIENT_GENDER]) +
										  (patient[PRESCRIPTION_CONST.PATIENT_AGE] != null ? ' • ' : '')
										: ''
								}${
									patient[PRESCRIPTION_CONST.PATIENT_AGE] != null
										? patient[PRESCRIPTION_CONST.PATIENT_AGE]
										: ''
								} `,
							],
						},
					],
				},
			];
		} else {
			return null;
		}
	}, [data]);

	return faskesInfo;
};

export default useFaskesInfo;
