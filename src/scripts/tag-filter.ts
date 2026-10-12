// In-page tag + text filtering for /blog. Progressive enhancement:
// without JS every post stays visible and nothing breaks.
const chips = [...document.querySelectorAll<HTMLButtonElement>('[data-tag-filter]')];
const rows = [...document.querySelectorAll<HTMLElement>('[data-post-tags]')];
const count = document.querySelector('[data-filter-count]');
const clear = document.querySelector<HTMLButtonElement>('[data-filter-clear]');
const search = document.querySelector<HTMLInputElement>('[data-search-input]');

function activeSlugs(): string[] {
	return chips
		.filter((chip) => chip.getAttribute('aria-pressed') === 'true')
		.map((chip) => chip.dataset.tagFilter ?? '')
		.filter(Boolean);
}

function queryTerms(): string[] {
	return (search?.value ?? '').toLowerCase().split(/\s+/).filter(Boolean);
}

function apply(syncHash: boolean) {
	const active = activeSlugs();
	const terms = queryTerms();
	let shown = 0;
	for (const row of rows) {
		const tags = (row.dataset.postTags ?? '').split(' ').filter(Boolean);
		const haystack = row.dataset.search ?? '';
		const visible =
			active.every((tag) => tags.includes(tag)) && terms.every((term) => haystack.includes(term));
		row.hidden = !visible;
		if (visible) shown += 1;
	}
	if (count) {
		const filtering = active.length > 0 || terms.length > 0;
		count.textContent = filtering
			? `Showing ${shown} of ${rows.length} posts`
			: `${rows.length} posts`;
	}
	if (clear) clear.hidden = active.length === 0 && terms.length === 0;
	if (syncHash) {
		const params = new URLSearchParams();
		if (active.length > 0) params.set('tags', active.join(','));
		if (terms.length > 0) params.set('q', terms.join(' '));
		const query = params.toString();
		history.replaceState(null, '', query ? `#${query}` : location.pathname);
	}
}

function resetAll() {
	chips.forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
	if (search) search.value = '';
}

function initFromHash() {
	// URLSearchParams also reads the legacy "#tags=a,b" shape.
	const params = new URLSearchParams(location.hash.replace(/^#/, ''));
	const wanted = new Set((params.get('tags') ?? '').split(',').filter(Boolean));
	for (const chip of chips) {
		if (wanted.has(chip.dataset.tagFilter ?? '')) chip.setAttribute('aria-pressed', 'true');
	}
	const q = params.get('q');
	if (search && q) search.value = q;
}

chips.forEach((chip) => {
	chip.addEventListener('click', () => {
		const on = chip.getAttribute('aria-pressed') === 'true';
		chip.setAttribute('aria-pressed', String(!on));
		apply(true);
	});
});

search?.addEventListener('input', () => apply(true));

clear?.addEventListener('click', () => {
	resetAll();
	apply(true);
	search?.focus();
});

addEventListener('hashchange', () => {
	resetAll();
	initFromHash();
	apply(false);
});

initFromHash();
apply(false);
