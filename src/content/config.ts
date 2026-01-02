import { defineCollection, z } from 'astro:content';

// Projects collection schema
const projectsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        summary: z.string(),
        description: z.string(),
        tech: z.array(z.string()),
        role: z.string(),
        period: z.string(),
        highlights: z.array(z.string()),
        link: z.string(),
        category: z.enum(['personal', 'academic']),
    }),
});

// Experience collection schema
const experienceCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        company: z.string(),
        companyUrl: z.string(),
        location: z.string(),
        period: z.string(),
        description: z.string(),
        responsibilities: z.array(z.string()),
        tags: z.array(z.string()),
        promotion: z.boolean().optional(),
    }),
});

// Certifications collection schema
const certificationsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        issuer: z.string(),
        date: z.string(),
        expiryDate: z.string().optional(),
        credentialId: z.string().optional(),
        description: z.string(),
        link: z.string().optional(),
    }),
});

export const collections = {
    projects: projectsCollection,
    experience: experienceCollection,
    certifications: certificationsCollection,
};
