// Copy buttons for blog code blocks. Runs on post pages only —
// without JS the blocks are just plain <pre> elements, which is fine.
async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const field = document.createElement('textarea');
		field.value = text;
		field.setAttribute('readonly', '');
		field.style.position = 'fixed';
		field.style.opacity = '0';
		document.body.append(field);
		field.select();
		const ok = document.execCommand('copy');
		field.remove();
		return ok;
	}
}

document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
	const source = pre.querySelector('code') ?? pre;
	if (!source.textContent?.trim()) return;

	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'code-copy';
	button.setAttribute('aria-label', 'Copy code block to clipboard');

	const label = document.createElement('span');
	label.textContent = 'Copy';
	label.setAttribute('aria-live', 'polite');
	button.append(label);

	let timer: ReturnType<typeof setTimeout>;
	button.addEventListener('click', async () => {
		const ok = await copyText(source.innerText);
		label.textContent = ok ? 'Copied' : 'Select + ⌘C';
		clearTimeout(timer);
		timer = setTimeout(() => {
			label.textContent = 'Copy';
		}, 2000);
	});

	pre.append(button);
});
