// In-page tag + text filtering for /blog. Progressive enhancement:
// without JS every post stays visible and nothing breaks.
const select = document.querySelector<HTMLSelectElement>('[data-tag-select]');
const rows = [...document.querySelectorAll<HTMLElement>('[data-post-tags]')];
const count = document.querySelector('[data-filter-count]');
const clear = document.querySelector<HTMLButtonElement>('[data-filter-clear]');
const search = document.querySelector<HTMLInputElement>('[data-search-input]');

function activeSlug(): string {
	return select?.value ?? '';
}

function queryTerms(): string[] {
	return (search?.value ?? '').toLowerCase().split(/\s+/).filter(Boolean);
}

function apply(syncHash: boolean) {
	const active = activeSlug();
	const terms = queryTerms();
	let shown = 0;
	for (const row of rows) {
		const tags = (row.dataset.postTags ?? '').split(' ').filter(Boolean);
		const haystack = row.dataset.search ?? '';
		const visible =
			(active === '' || tags.includes(active)) && terms.every((term) => haystack.includes(term));
		row.hidden = !visible;
		if (visible) shown += 1;
	}
	if (count) {
		const filtering = active !== '' || terms.length > 0;
		count.textContent = filtering
			? `Showing ${shown} of ${rows.length} posts`
			: `${rows.length} posts`;
	}
	if (clear) clear.hidden = active === '' && terms.length === 0;
	if (syncHash) {
		const params = new URLSearchParams();
		if (active !== '') params.set('tags', active);
		if (terms.length > 0) params.set('q', terms.join(' '));
		const query = params.toString();
		history.replaceState(null, '', query ? `#${query}` : location.pathname);
	}
}

function resetAll() {
	if (select) select.value = '';
	if (search) search.value = '';
}

function initFromHash() {
	// URLSearchParams also reads the legacy "#tags=a,b" shape: take the first slug
	// so old /blog#tags=x post links keep working with the single-select.
	const params = new URLSearchParams(location.hash.replace(/^#/, ''));
	const wanted = (params.get('tags') ?? '').split(',').filter(Boolean)[0] ?? '';
	if (select && wanted) {
		const exists = [...select.options].some((opt) => opt.value === wanted);
		if (exists) select.value = wanted;
	}
	const q = params.get('q');
	if (search && q) search.value = q;
}

select?.addEventListener('change', () => apply(true));

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
