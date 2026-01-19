import { DailyWeekly, MedicineConsumptionTime } from '@types';

type Time = { id: number; name: string };

export interface PrescriptionItem {
	id: number;
	name: string;
	productUrl: string;
	productImage: string;
	qty: number;
	price: number;
	unit: string;
	medicineConsumptionTime: MedicineConsumptionTime;
	dailyWeekly: DailyWeekly;
	notes: string;
	time: Time[];
	frequency: string;
	priceTag: string;
	doseTag: string;
	merchantName?: string;
	originalQty?: number;
	enabler_name?: string;
	transaction_qty?: number;
	productId?: number | string;
	is_priority?: boolean;
	is_recommendation?: boolean | number;
	is_package?: boolean;
	isRecommendation?: boolean;
	recommendation_type?: string;
	short_description?: string;
	description?: string;
	indication?: string;
	// field-field tambahan dari update (mis. updateQtyReason) tetap diperbolehkan
	[k: string]: any;
}

type MergeOpts = {
	/** Jika true, item dengan qty === 0 akan di-drop dari hasil. Default: false */
	dropZeroQty?: boolean;
};

/** Deep-merge sederhana: nilai `updated` menimpa `base` jika !== undefined */
function mergeRecord<T extends Record<string, any>>(base: T, updated: Partial<T>): T {
	const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
	for (const key of Object.keys(updated)) {
		const u = (updated as any)[key];
		const b = (base as any)[key];

		if (u === undefined) continue; // abaikan field yang undefined di updated

		if (
			u &&
			typeof u === 'object' &&
			!Array.isArray(u) &&
			b &&
			typeof b === 'object' &&
			!Array.isArray(b)
		) {
			out[key] = mergeRecord(b, u); // deep merge untuk object
		} else {
			out[key] = u; // timpa langsung (termasuk "" / [] / 0 jika memang ingin override)
		}
	}
	return out;
}

/** Merge dua list prescription */
export function mergePrescriptions(
	prescription: PrescriptionItem[],
	updatedPrescription: Partial<PrescriptionItem>[],
	opts: MergeOpts = {},
): PrescriptionItem[] {
	const { dropZeroQty = false } = opts;

	// index updated by id
	const updatedById = new Map<number, Partial<PrescriptionItem>>();
	for (const u of updatedPrescription) {
		if (typeof u.id === 'number') updatedById.set(u.id, u);
	}

	// 1) merge item yang sudah ada
	const merged: PrescriptionItem[] = prescription.map((old) => {
		const upd = updatedById.get(old.id);
		if (!upd) return old;

		const m = mergeRecord(old, upd);
		return m;
	});

	// 2) tambahkan item baru (yang ada di updated tapi tidak ada di original)
	for (const u of updatedPrescription) {
		if (typeof u.id !== 'number') continue;
		const exists = prescription.some((p) => p.id === u.id);
		if (!exists) {
			// aman: cast ke PrescriptionItem; jika ada field wajib yang belum ada, tetap ikut (diserahkan ke layer validasi di atasnya)
			merged.push(u as PrescriptionItem);
		}
	}

	// 3) opsional: drop item qty === 0
	const finalList = dropZeroQty ? merged.filter((it) => it.qty !== 0) : merged;

	return finalList;
}

// Example :
// const result = mergePrescriptions(prescription, updatedPrescription, { dropZeroQty: false });
// - Item id 213291 terupdate (mis. menambah `updateQtyReason`).
// - Item id 213292 (baru) ikut masuk walau qty = 0 (karena dropZeroQty: false).

// Kalau ingin item qty = 0 tidak muncul:
// const resultNoZero = mergePrescriptions(prescription, updatedPrescription, { dropZeroQty: true });
