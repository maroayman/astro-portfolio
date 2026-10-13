// Image lightbox for blog posts. Progressive enhancement: without JS the
// images are plain <img> elements, which is fine. With JS every
// .prose / .post__cover image becomes keyboard-operable and opens in an
// accessible dialog with prev/next navigation.
const lightbox = document.getElementById('lightbox');
const image = document.getElementById('lightboxImage') as HTMLImageElement | null;
const caption = document.getElementById('lightboxCaption');
const closeBtn = document.getElementById('lightboxClose') as HTMLButtonElement | null;
const prevBtn = document.getElementById('lightboxPrev') as HTMLButtonElement | null;
const nextBtn = document.getElementById('lightboxNext') as HTMLButtonElement | null;

if (lightbox && image && caption && closeBtn && prevBtn && nextBtn) {
	const sources = [...document.querySelectorAll<HTMLImageElement>('.prose img, .post__cover img')];
	let current = 0;
	let lastFocused: Element | null = null;

	function focusable(): HTMLElement[] {
		return [...lightbox!.querySelectorAll<HTMLElement>('button')].filter(
			(el) => el.offsetParent !== null && el.style.display !== 'none',
		);
	}

	function updateNav() {
		prevBtn!.style.display = current > 0 ? '' : 'none';
		nextBtn!.style.display = current < sources.length - 1 ? '' : 'none';
	}

	function open(index: number) {
		if (sources.length === 0) return;
		lastFocused = document.activeElement;
		current = index;
		const src = sources[current];
		image!.src = src.currentSrc || src.src;
		image!.alt = src.alt || '';
		caption!.textContent = src.alt || '';
		lightbox!.classList.add('active');
		lightbox!.removeAttribute('hidden');
		lightbox!.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		updateNav();
		closeBtn!.focus();
	}

	function close() {
		lightbox!.classList.remove('active');
		lightbox!.setAttribute('aria-hidden', 'true');
		lightbox!.setAttribute('hidden', '');
		document.body.style.overflow = '';
		if (lastFocused instanceof HTMLElement) lastFocused.focus();
	}

	sources.forEach((img, i) => {
		img.classList.add('is-zoomable');
		img.setAttribute('role', 'button');
		img.setAttribute('tabindex', '0');
		img.setAttribute('aria-label', `Enlarge image${img.alt ? `: ${img.alt}` : ` ${i + 1}`}`);
		img.addEventListener('click', () => open(i));
		img.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				open(i);
			}
		});
	});

	closeBtn.addEventListener('click', close);
	prevBtn.addEventListener('click', () => {
		if (current > 0) open(current - 1);
	});
	nextBtn.addEventListener('click', () => {
		if (current < sources.length - 1) open(current + 1);
	});
	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) close();
	});
	document.addEventListener('keydown', (event) => {
		if (!lightbox.classList.contains('active')) return;
		if (event.key === 'Escape') close();
		else if (event.key === 'ArrowLeft' && current > 0) open(current - 1);
		else if (event.key === 'ArrowRight' && current < sources.length - 1) open(current + 1);
		else if (event.key === 'Tab') {
			const items = focusable();
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	});
}
