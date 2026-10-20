// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import imageDims from './src/plugins/image-dims.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://maroayman.vercel.app',
	redirects: {
		'/skills': '/uses',
		'/skills/': '/uses/',
	},
	integrations: [sitemap()],
	markdown: {
		processor: unified({ rehypePlugins: [imageDims] }),
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
