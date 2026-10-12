// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://maroayman.vercel.app',
	integrations: [sitemap()],
	build: {
		format: 'directory',
		inlineStylesheets: 'always',
	},
	vite: {
		server: {
			allowedHosts: ['11b4d6c352b343ac-197-49-168-40.serveousercontent.com'],
		},
	},
});
