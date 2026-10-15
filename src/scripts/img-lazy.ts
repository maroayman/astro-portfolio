// Below-the-fold article images: lazy-load + async decode.
// Cover images already carry eager loading and dimensions in markup;
// only bare Markdown images are touched. Progressive enhancement:
// without JS the images simply load eagerly as before.
document.querySelectorAll<HTMLImageElement>('.prose-k img:not([loading])').forEach((img) => {
	img.loading = 'lazy';
	img.decoding = 'async';
});
