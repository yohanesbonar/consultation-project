import React from 'react';

function usePageLoaded(action: (target?: HTMLElement) => void, deps: any) {
	React.useEffect(() => {
		if (typeof window === 'undefined') return;

		const raf = 0;
		const timer = 0;
		const QUIET_MS = 300; // waktu “tenang” tanpa mutasi

		const timers = new Map();
		const rafs = new Map(); // per-element RAF

		const schedule = (target?: HTMLElement, elementChanged = null, timeout = QUIET_MS) => {
			const el =
				elementChanged instanceof HTMLElement
					? elementChanged
					: elementChanged?.parentElement || target;

			if (!el) return; // still nothing valid

			const key = el.id || el; // string or HTMLElement OK with Map

			clearTimeout(timers.get(key));
			cancelAnimationFrame(rafs.get(key));
			const id = window.setTimeout(() => {
				const raf = requestAnimationFrame(() => action(el));
				rafs.set(key, raf); // track its raf id
				timers.delete(key);
			}, timeout);

			timers.set(key, id);
		};

		// Jalankan sekali (mis. setelah mount)
		schedule(document.body);

		// Amati seluruh dokumen (tambah attributes:true kalau perlu)
		const obs = new MutationObserver((mutations) => {
			for (const m of mutations) {
				const target =
					m.target instanceof HTMLElement ? m.target : m.target.parentElement ?? null;
				if (
					m.type === 'attributes' &&
					(m.attributeName === 'class' || m.attributeName === 'style')
				) {
					schedule(target, target, 50);
				}
				if (m.type === 'childList') {
					schedule(document.body, null, 300); // fallback for new components
				}
			}
		});
		obs.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style'],
		});

		return () => {
			obs.disconnect();
			clearTimeout(timer);
			cancelAnimationFrame(raf);
		};
	}, deps);
}

export default usePageLoaded;
