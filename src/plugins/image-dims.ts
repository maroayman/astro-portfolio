import dims from '../data/image-dims.json';

/**
 * Rehype plugin: stamp natural width/height onto Markdown images that
 * lack them, so the browser reserves space (no layout shift). Dimensions
 * come from src/data/image-dims.json, generated from public/images/.
 * Images missing from the map (or already annotated, e.g. covers) are
 * left untouched. No dependencies.
 */
export default function imageDims() {
	return (tree: any) => {
		const walk = (node: any): void => {
			if (node?.type === 'element' && node.tagName === 'img') {
				const props = (node.properties ??= {});
				const src = typeof props.src === 'string' ? props.src : null;
				const known = src ? (dims as Record<string, { width: number; height: number }>)[src] : null;
				if (known && !props.width && !props.height) {
					props.width = known.width;
					props.height = known.height;
				}
				if (props.loading === undefined) props.loading = 'lazy';
				if (props.decoding === undefined) props.decoding = 'async';
			}
			if (Array.isArray(node?.children)) node.children.forEach(walk);
		};
		walk(tree);
	};
}
