// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import imageDims from './src/plugins/image-dims.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://maroayman.vercel.app',
	integrations: [sitemap()],
	markdown: {
		rehypePlugins: [imageDims],
	},
	build: {
		format: 'directory',
		inlineStylesheets: 'always',
	},
	vite: {
		server: {
			allowedHosts: true,
		},
	},
});
