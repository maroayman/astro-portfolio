import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	if (context.url.pathname === '/resume') {
		return context.redirect('/resume.pdf', 302);
	}
	return next();
});
