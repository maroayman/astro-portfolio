// Site chrome: mailto + Copy button, homepage peek line, kinetic name,
// Cairo clock. Runs on every page (imported by KineticLayout); each
// feature no-ops when its elements are absent. No dependencies.
const $ = (id: string): HTMLElement | null => document.getElementById(id);

// Email: mailto + Copy follow the #mail link
const mail = $('mail') as HTMLAnchorElement | null;
if (mail) {
	const address = (): string => (mail.textContent ?? '').trim();
	mail.href = 'mailto:' + address();
	const btn = $('copy');
	let t: ReturnType<typeof setTimeout> | undefined;
	btn?.addEventListener('click', async () => {
		const status = $('copy-status');
		const announce = (msg: string): void => {
			if (status) status.textContent = msg;
		};
		try {
			await navigator.clipboard.writeText(address());
		} catch {
			const r = document.createRange();
			r.selectNodeContents(mail);
			const s = getSelection();
			if (s) {
				s.removeAllRanges();
				s.addRange(r);
			}
			announce('Copy failed. Email address selected — press Control C to copy.');
			return;
		}
		btn.classList.add('done');
		btn.textContent = 'Copied';
		btn.setAttribute('aria-label', 'Email address copied');
		announce('Email address copied.');
		clearTimeout(t);
		t = setTimeout(() => {
			btn.classList.remove('done');
			btn.textContent = 'Copy';
			btn.setAttribute('aria-label', 'Copy email address');
		}, 1800);
	});
}

// Peek line (homepage only): instant preview on hover and focus.
const peek = $('peek');
const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav a')];
if (peek && links.length) {
	const def = peek.textContent;
	const show = (a: HTMLAnchorElement): void => {
		peek.textContent = a.dataset.peek ?? def;
	};
	links.forEach((a) => {
		a.addEventListener('mouseenter', () => show(a));
		a.addEventListener('focus', () => show(a));
	});
	document.querySelector('.nav')?.addEventListener('mouseleave', () => {
		peek.textContent = def;
	});
	document.querySelector('.nav')?.addEventListener('focusout', () => {
		peek.textContent = def;
	});
}

// Kinetic name: width follows pointer x, weight follows pointer y.
// The loop sleeps when the tab is hidden or the pointer has been
// idle for a while, and wakes on the next pointer movement.
const kineticName: HTMLElement | null = $('name') ?? document.querySelector<HTMLElement>('.ptitle');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
if (kineticName && !reduce && fine) {
	let tx = 0.5;
	let ty = 0.5;
	let cx = 0.5;
	let cy = 0.5;
	let lastMove = 0;
	let running = false;
	const frame = (): void => {
		if (document.hidden || performance.now() - lastMove > 5000) {
			running = false;
			return;
		}
		cx += (tx - cx) * 0.07;
		cy += (ty - cy) * 0.07;
		kineticName.style.setProperty('--wd', (75 + cx * 76).toFixed(1));
		kineticName.style.setProperty('--wg', String(Math.round(200 + (1 - cy) * 700)));
		requestAnimationFrame(frame);
	};
	addEventListener('pointermove', (e) => {
		tx = e.clientX / innerWidth;
		ty = e.clientY / innerHeight;
		lastMove = performance.now();
		if (!running) {
			running = true;
			requestAnimationFrame(frame);
		}
	});
}

// Cairo clock
try {
	const fmt = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Africa/Cairo',
		hour: '2-digit',
		minute: '2-digit',
	});
	const tick = (): void => {
		const el = $('clock');
		if (el) el.textContent = fmt.format(new Date()) + ' in Cairo, Egypt';
	};
	tick();
	setInterval(tick, 30000);
} catch {
	// Intl without timeZone data: leave the static fallback text.
}
