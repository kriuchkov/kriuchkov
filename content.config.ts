import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        description: z.string(),
        externalUrl: z.string().optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        sort: z.number().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        link: z.string().optional(),
        license: z.string().optional(),
        stack: z.array(z.string()).optional()
      })
    }),
    academy: defineCollection({
      type: 'page',
      source: 'academy/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        date: z.string().optional()
      })
    }),
    ai: defineCollection({
      type: 'page',
      source: 'ai/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
        category: z.string().optional()
      })
    })
  }
})
