// Reveal-on-scroll for `.reveal` elements (used by every page).
const reveals = document.querySelectorAll<HTMLElement>('.reveal');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
	);
	reveals.forEach((el) => observer.observe(el));
} else {
	reveals.forEach((el) => el.classList.add('is-visible'));
}
