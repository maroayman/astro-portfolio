// Accessible tab switching for blog post code examples.
// Progressive enhancement: without JS all panels stay visible stacked.
// With JS only the active panel shows, with full keyboard support
// (ArrowLeft/ArrowRight/Home/End per the WAI-ARIA tabs pattern).
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
	const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
	const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
	if (tabs.length === 0 || panels.length === 0) return;

	function activate(tab: HTMLButtonElement, focus = false) {
		for (const t of tabs) {
			const selected = t === tab;
			t.setAttribute('aria-selected', String(selected));
			t.classList.toggle('is-active', selected);
			t.tabIndex = selected ? 0 : -1;
		}
		for (const p of panels) {
			const show = p.getAttribute('aria-labelledby') === tab.id;
			if (show) p.removeAttribute('hidden');
			else p.setAttribute('hidden', '');
		}
		if (focus) tab.focus();
	}

	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => activate(tab));
		tab.addEventListener('keydown', (event) => {
			let next: number | null = null;
			if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
			else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
			else if (event.key === 'Home') next = 0;
			else if (event.key === 'End') next = tabs.length - 1;
			if (next !== null) {
				event.preventDefault();
				activate(tabs[next], true);
			}
		});
	});

	activate(tabs[0]);
});
