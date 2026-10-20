/**
 * Portfolio content — migrated from the Deno/Lume site (~/Projects/deno).
 * Experience, projects, certifications, links, and stack all mirror
 * src/_data/*.yml over there. Stats below are counts derived from that data.
 */

export const profile = {
	name: 'Marwan Ayman Shawky',
	role: 'Cloud & DevOps Engineer',
	tagline: 'Infrastructure automation, GitOps, and reliable systems.',
	intro:
		'Hands-on experience building GitOps CI/CD pipelines, automating cloud infrastructure ' +
		'with Terraform, and deploying Kubernetes clusters on AWS and on-premises. Focused on ' +
		'reliable, scalable systems and infrastructure as code.',
	location: 'Cairo, Egypt',
	email: 'marwanayman.shawky@gmail.com',
	links: {
		github: 'https://github.com/maroayman',
		linkedin: 'https://www.linkedin.com/in/maroayman/',
		linktree: 'https://linktr.ee/maroayman',
	},
} as const;

/** Simple monochrome icon paths (24x24 viewBox) used across the site. */
export const icons = {
	github:
		'M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z',
	gitlab:
		'm23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z',
	linkedin:
		'M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.7 4.8 6.2V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z',
	linktree:
		'm13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z',
	mail: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm1.5-.5 7.5 5.3L19.5 6H4.5Z',
	arrow: 'M5 12h14M13 6l6 6-6 6',
	cube: 'M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9ZM4 7.5 12 12m0 0 8-4.5M12 12v9',
	up: 'M12 20V5M6 11l6-6 6 6',
	copy: 'M9 9h11v11H9V9Zm-4 6V6a2 2 0 0 1 2-2h9',
	download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
} as const;

export type SkillGroup = {
	title: string;
	summary: string;
	items: string[];
};

/** Condensed from uses.yml — hardware and site-meta groups left out. */
export const skills: SkillGroup[] = [
	{
		title: 'Infrastructure & DevOps',
		summary: 'Container orchestration and infrastructure as code — managed cloud or bare metal.',
		items: [
			'Kubernetes',
			'Terraform',
			'Ansible',
			'Helm',
			'ArgoCD / Flux CD',
			'Docker',
			'Proxmox VE',
		],
	},
	{
		title: 'CI/CD',
		summary: 'Pipelines for open-source and enterprise — cloud-hosted or self-hosted.',
		items: ['GitHub Actions', 'Jenkins', 'Gitea'],
	},
	{
		title: 'Cloud',
		summary: 'AWS and GCP heavily, with working knowledge across the Azure ecosystem.',
		items: ['AWS', 'GCP', 'Azure'],
	},
	{
		title: 'Monitoring & Storage',
		summary: 'Metrics, dashboards, and S3-compatible storage for on-prem artifacts.',
		items: ['Prometheus + Grafana', 'MinIO'],
	},
	{
		title: 'OS & Shell',
		summary: 'Windows 11 + WSL2 daily, Linux on servers, Starship prompt everywhere.',
		items: ['Windows + WSL2', 'Linux', 'Bash / Zsh', 'Fish'],
	},
	{
		title: 'Editor & Terminal',
		summary: 'VS Code daily with K8s/Terraform/Docker extensions, Vim over SSH.',
		items: ['VS Code', 'Vim', 'Termora', 'Starship', 'Fish'],
	},
	{
		title: 'Hardware',
		summary: 'Daily driver — one machine for everything.',
		items: ['Lenovo Yoga 6i (i7-13th H)'],
	},
];

export type Experience = {
	company: string;
	companyUrl?: string;
	title: string;
	period: string;
	location: string;
	description: string;
	highlights: string[];
	stack: string[];
};

export const experience: Experience[] = [
	{
		company: 'IP-Protocol INC',
		companyUrl: 'https://ipprotocolinc.com',
		title: 'DevOps Engineer',
		period: 'Jan 2026 – Apr 2026',
		location: 'Cairo, Egypt',
		description:
			'Building and maintaining on-premises infrastructure for a cybersecurity company — no cloud, all bare-metal and self-hosted.',
		highlights: [
			'Designed and deployed a production-grade, multi-node Kubernetes cluster with high availability on on-premises infrastructure',
			'Implemented end-to-end GitOps workflows using Flux CD for automated infrastructure synchronization and application delivery',
			'Built and maintained a private Docker registry with MinIO S3-compatible storage for secure artifact management',
			'Set up Gitea as the internal Git solution, enabling automated GitOps pipelines and version-controlled infrastructure',
			'Provisioned and managed Rocky Linux VMs on Proxmox VE, optimizing resource utilization for containerized workloads',
			'Customized and adapted cloud-native GitOps patterns to meet specific on-premises infrastructure requirements',
		],
		stack: [
			'Kubernetes',
			'GitOps',
			'Flux CD',
			'Proxmox VE',
			'Gitea',
			'MinIO',
			'Docker',
			'Rocky Linux',
		],
	},
	{
		company: 'Digital Egypt Pioneers Initiative',
		companyUrl: 'https://depi.gov.eg',
		title: 'DevOps Trainee',
		period: 'Jun 2025 – Dec 2025',
		location: 'Cairo, Egypt',
		description:
			'Undergoing structured training in DevOps, cloud computing, and Linux administration.',
		highlights: [
			'Designing and implementing CI/CD pipelines with Jenkins and GitHub Actions',
			'Managing Kubernetes clusters for container orchestration',
			'Implementing GitOps workflows using ArgoCD for automated application delivery',
			'Automating infrastructure provisioning using Terraform',
			'Configuring and maintaining Linux servers',
		],
		stack: ['Linux', 'Kubernetes', 'Terraform', 'Ansible', 'Docker', 'Jenkins', 'ArgoCD'],
	},
	{
		company: 'Ghaymah Cloud Solutions',
		companyUrl: 'https://ghaymah.systems',
		title: 'DevOps Intern',
		period: 'Sep 2025 – Oct 2025',
		location: 'Remote, Saudi Arabia',
		description: 'Working on cloud automation, CI/CD pipelines, and infrastructure provisioning.',
		highlights: [
			'Building and maintaining CI/CD pipelines for automated deployments',
			'Containerizing applications using Docker',
			'Automating cloud infrastructure provisioning',
			'Integrating APIs for cloud service automation',
		],
		stack: ['Docker', 'CI/CD', 'Cloud Automation', 'API', 'Cloud Deployment'],
	},
];

export type Project = {
	name: string;
	description: string;
	tags: string[];
	link?: string;
	metric?: string;
};

export const projects: Project[] = [
	{
		name: '3-Tier GitOps App on EKS',
		description:
			'A complete 3-tier notes application with GitOps CI/CD pipeline using GitHub Actions, Terraform, Ansible, Helm, and ArgoCD on AWS EKS.',
		tags: ['GitHub Actions', 'Terraform', 'Ansible', 'Helm', 'ArgoCD', 'AWS EKS', 'Kubernetes'],
		link: 'https://github.com/maroayman/depi-notes-app-gitops',
	},
	{
		name: 'Highly Available AWS Infrastructure',
		description:
			'A highly available, scalable web application infrastructure on AWS with ALB, Auto Scaling Group, and secure multi-AZ network architecture.',
		tags: ['AWS', 'Terraform', 'ALB', 'Auto Scaling', 'VPC', 'EC2'],
		link: 'https://github.com/maroayman/depi-project-5',
	},
	{
		name: 'Terraform EC2 Monitoring Stack',
		description:
			'A production-ready Terraform project that automates the deployment of secure EC2 instances on AWS with real-time monitoring.',
		tags: ['Terraform', 'AWS EC2', 'Monitoring', 'SSH'],
		link: 'https://github.com/maroayman/depi-project-4',
	},
	{
		name: 'Dockerized Flask Production Stack',
		description:
			'A complete end-to-end web application deployed on AWS EC2 with production-ready features and monitoring.',
		tags: ['Docker', 'Flask', 'Nginx', 'MySQL', 'SQLAlchemy', 'AWS EC2'],
		link: 'https://github.com/maroayman/depi-project-3',
	},
	{
		name: 'Ansible-Managed Go Web App',
		description:
			'A Go-based web application for note management with Ansible automation and scheduled tasks.',
		tags: ['Go', 'Ansible', 'SQLite', 'Cron'],
		link: 'https://github.com/maroayman/depi-project-2/',
	},
	{
		name: 'Flask App with Persistent AWS Storage',
		description:
			'A full-stack note-taking application on AWS infrastructure with EBS backup and MariaDB.',
		tags: ['Flask', 'AWS EC2', 'AWS EBS', 'MariaDB', 'SQLAlchemy'],
		link: 'https://github.com/maroayman/depi-project-1/',
	},
	{
		name: '2D Platformer Game',
		description:
			'A 2D platformer game built with Unity and C#, featuring collaborative development and asset integration.',
		tags: ['Unity', 'C#', 'Game Development'],
		link: 'https://github.com/maroayman/unity-game',
	},
	{
		name: 'E-Commerce Platform',
		description:
			'Graduation project — a comprehensive e-commerce platform with YouTube integration for product recommendations.',
		tags: ['Angular', 'ASP.NET', 'Bootstrap', 'SQL Server', 'YouTube API'],
	},
	{
		name: 'File Encryption Tool',
		description:
			'A Python-based security application implementing encryption and decryption techniques.',
		tags: ['Python', 'Encryption', 'Security'],
	},
	{
		name: 'Football Analytics Dashboard',
		description:
			'Interactive data visualization dashboard built with Microsoft Power BI for football analytics.',
		tags: ['Power BI', 'Data Visualization', 'Kaggle'],
	},
	{
		name: 'Learning Management System',
		description: 'A Java-based LMS with role-based access control for educational institutions.',
		tags: ['Java', 'Java Swing', 'SQLite', 'Role-Based Access Control'],
		link: 'https://github.com/maroayman/Learning-System',
	},
	{
		name: 'Linux File Link Utility',
		description:
			'A C-based terminal utility for creating and managing file links in Linux environments.',
		tags: ['C', 'Linux', 'Ubuntu'],
		link: 'https://github.com/maroayman/Operating-System-FCIH-College-Task-',
	},
];

export type Certification = {
	title: string;
	issuer: string;
	date: string;
	url?: string;
};

export const certifications: Certification[] = [
	{ title: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft Azure', date: 'Sep 2026' },
	{ title: 'Google Cloud Associate Cloud Engineer', issuer: 'Google Cloud', date: 'Jun 2026' },
	{
		title: 'AWS Certified Cloud Practitioner',
		issuer: 'Amazon Web Services',
		date: 'May 2026',
	},
	{
		title: 'Introduction to AWS Cloud: Builder Labs',
		issuer: 'Amazon Web Services',
		date: 'Aug 2025',
	},
	{ title: 'Introduction to Kubernetes', issuer: 'The Linux Foundation', date: 'May 2025' },
	{
		title: 'Introduction to Cloud Infrastructure Technologies',
		issuer: 'The Linux Foundation',
		date: 'May 2025',
	},
	{ title: 'Introduction to Linux', issuer: 'The Linux Foundation', date: 'May 2025' },
	{ title: 'HCCDA - AI', issuer: 'Huawei Cloud', date: 'Mar 2025' },
	{ title: 'HCCDA - Tech Essentials', issuer: 'Huawei Cloud', date: 'Jan 2025' },
];
