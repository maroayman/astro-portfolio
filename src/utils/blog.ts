import { getCollection, type CollectionEntry } from 'astro:content';

/** URL-safe tag slug: "CI/CD" -> "ci-cd", "Arch Linux" -> "arch-linux". */
export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.replace(/\//g, '-')
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

export type BlogPost = CollectionEntry<'blog'>;

/** URL slug for a post: entry ids look like "my-post.md". */
export function postSlug(post: BlogPost): string {
	return post.id.replace(/\.mdx?$/, '');
}

/** All posts, newest first. */
export async function getPosts() {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Every used tag with its post count, most-used first. */
export async function getTags(): Promise<{ tag: string; slug: string; count: number }[]> {
	const posts = await getPosts();
	const counts = new Map<string, { tag: string; count: number }>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			const slug = tagSlug(tag);
			const hit = counts.get(slug);
			if (hit) hit.count += 1;
			else counts.set(slug, { tag, count: 1 });
		}
	}
	return [...counts.entries()]
		.map(([slug, { tag, count }]) => ({ tag, slug, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function readingTime(body: string): number {
	return Math.max(1, Math.round(body.split(/\s+/).length / 200));
}

/** Natural dimensions of cover images — rendered as width/height attrs
 *  so the browser reserves space (no layout shift) while CSS caps display
 *  size at the natural width (no blurry upscale). */
export const coverDims: Record<string, { width: number; height: number }> = {
	'/images/covers/cachy-os-experience.webp': { width: 256, height: 256 },
	'/images/covers/flask-mariadb-ec2-deploy.webp': { width: 1024, height: 683 },
	'/images/covers/go-web-app-aws-ansible.webp': { width: 1024, height: 683 },
	'/images/covers/kubernetes-deployments-part1.webp': { width: 1024, height: 490 },
	'/images/covers/kubernetes-deployments-part2.webp': { width: 1024, height: 490 },
};
