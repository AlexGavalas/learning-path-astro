import { defineCollection, z } from "astro:content";

const notes = defineCollection({
    schema: z.object({
        title: z.string(),
        created: z.string().transform((val) => new Date(val)),
        updated: z.string().transform((val) => new Date(val)),
        published: z.boolean().optional(),
    }),
});

export const collections = {
    notes,
};
