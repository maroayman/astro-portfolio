// Click-to-enlarge for post + cover images. Dependency-free,
// progressive enhancement: without JS the images are just static.
const targets = document.querySelectorAll<HTMLImageElement>(
	'.prose-k img, figure.cover img',
);

if (targets.length) {
	const overlay = document.createElement('div');
	overlay.className = 'lightbox';
	overlay.hidden = true;
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');
	overlay.setAttribute('aria-label', 'Enlarged image');

	const full = document.createElement('img');
	full.className = 'lightbox__img';
	full.alt = '';

	const close = document.createElement('button');
	close.type = 'button';
	close.className = 'lightbox__close';
	close.textContent = '✕';
	close.setAttribute('aria-label', 'Close enlarged image');

	overlay.append(full, close);
	document.body.append(overlay);

	if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
		overlay.classList.add('lightbox--anim');
	}

	let last: HTMLElement | null = null;
	const open = (img: HTMLImageElement) => {
		last = document.activeElement as HTMLElement | null;
		full.src = img.currentSrc || img.src;
		full.alt = img.alt;
		overlay.hidden = false;
		document.body.style.overflow = 'hidden';
		close.focus();
	};
	const shut = () => {
		overlay.hidden = true;
		document.body.style.overflow = '';
		last?.focus?.();
	};

	targets.forEach((img) => {
		img.tabIndex = 0;
		img.addEventListener('click', () => open(img));
		img.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				open(img);
			}
		});
	});
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) shut();
	});
	close.addEventListener('click', shut);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !overlay.hidden) shut();
	});
}
