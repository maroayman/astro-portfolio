import rss from '@astrojs/rss';
import { getPosts } from '../utils/blog';
import { postSlug } from '../utils/blog';
import { profile } from '../data/portfolio';

export async function GET(context: { site: URL | undefined }) {
	const posts = await getPosts();
	return rss({
		title: `${profile.name} — Blog`,
		description:
			'Notes on Linux, Docker, Kubernetes, AWS, and DevOps — guides from real homelab and production work.',
		site: context.site ?? 'https://maroayman.vercel.app',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/blog/${postSlug(post)}/`,
		})),
	});
}
