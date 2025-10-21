/* eslint-disable @typescript-eslint/no-unused-vars */
type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
	if (typeof window === 'undefined') {
		// Server-side: no-op
		return {
			showToast: (_txt: string, _type?: ToastType, _duration?: number) => {},
			showSuccessToast: (_txt: string, _duration?: number) => {},
			showErrorToast: (_txt: string, _duration?: number) => {},
			showInfoToast: (_txt: string, _duration?: number) => {},
			showWarningToast: (_txt: string, _duration?: number) => {},
			removeToast: (_id: string) => {},
			removeAll: () => {}
		};
	}

	// Inject CSS if not exists
	const styleId = 'a-style';
	if (!document.getElementById(styleId)) {
		const css = `
		.a-toasts {
			position: fixed;
			z-index: 9999;
			top: 11px;
			right: 20px;
			display: flex;
			flex-direction: column;
			gap: 10px;
			pointer-events: none;
			width: 320px;
			max-width: 90vw;
		}

		.a-toast {
			background: #fff;
			border-left: 4px solid green;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
			border-radius: 6px;
			overflow: hidden;
			min-height: 60px;
			transform: translateX(100%);
			opacity: 0;
			transition: transform 0.3s ease, opacity 0.3s ease;
			pointer-events: auto;
			font-family: system-ui, sans-serif;
		}

		.a-toast--appearing { transform: translateX(0); opacity: 1; }

		.a-toast__title { font-weight: bold; padding: 10px 14px; background-color: #f0f0f0; color: #333; font-size: 14px; }
		.a-toast__content { padding: 10px 14px; color: #444; font-size: 13px; line-height: 1.3; }

		.a-toast--success { border-left-color: #38a169; }
		.a-toast--error   { border-left-color: #e53e3e; }
		.a-toast--info    { border-left-color: #3182ce; }
		.a-toast--warning { border-left-color: #dd6b20; }
		`;
		const styleEl = document.createElement('style');
		styleEl.id = styleId;
		styleEl.textContent = css;
		document.head.appendChild(styleEl);
	}

	// Toast container
	let toastsEl = document.getElementById('a-toasts');
	if (!toastsEl) {
		toastsEl = document.createElement('div');
		toastsEl.id = 'a-toasts';
		toastsEl.className = 'a-toasts';
		document.body.appendChild(toastsEl);
	}

	// Generic toast function
	const showToast = (txt: string, type: ToastType = 'success', duration = 5000) => {
		if (!toastsEl) return;

		const toastEl = document.createElement('div');
		toastEl.className = `a-toast a-toast--${type}`;
		const id = `a-toasts-${Math.floor(Math.random() * 100)}-${Date.now()}`;
		toastEl.id = id;

		toastEl.innerHTML = `
			<div class="a-toast__title">${type[0].toUpperCase() + type.slice(1)}</div>
			<div class="a-toast__content">${txt}</div>
		`;

		toastsEl.appendChild(toastEl);

		requestAnimationFrame(() => toastEl.classList.add('a-toast--appearing'));
		setTimeout(() => removeToast(id), duration);
	};

	// Convenience functions
	const showSuccessToast = (txt: string, duration?: number) => showToast(txt, 'success', duration);
	const showErrorToast = (txt: string, duration?: number) => showToast(txt, 'error', duration);
	const showInfoToast = (txt: string, duration?: number) => showToast(txt, 'info', duration);
	const showWarningToast = (txt: string, duration?: number) => showToast(txt, 'warning', duration);

	const removeToast = (id: string) => {
		const elToRemove = document.getElementById(id);
		if (elToRemove) {
			elToRemove.classList.remove('a-toast--appearing');
			setTimeout(() => elToRemove.remove(), 250);
		}
	};

	const removeAll = () => {
		if (toastsEl) toastsEl.innerHTML = '';
	};

	return {
		showToast,
		showSuccessToast,
		showErrorToast,
		showInfoToast,
		showWarningToast,
		removeToast,
		removeAll
	};
}
