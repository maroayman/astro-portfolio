// Table frames for blog posts. Wraps each .prose table in a scrolling
// container and flags .prose as enhanced (.tni) so the collapsed-border
// styles apply. Without JS the tables keep their block+scroll fallback.
const prose = document.querySelector<HTMLElement>('.prose');
if (prose) {
	const tables = [...prose.querySelectorAll('table')];
	for (const table of tables) {
		const frame = document.createElement('div');
		frame.className = 'table-wrap';
		table.replaceWith(frame);
		frame.append(table);
	}
	if (tables.length > 0) prose.classList.add('tni');
}
