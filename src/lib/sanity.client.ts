import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2023-11-24',
  useCdn: false,
});

export async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      featuredImage,
      excerpt,
      publishedAt,
      categories[]->
    }
  `);
}

export async function getPost(slug: string) {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      featuredImage,
      content,
      publishedAt,
      categories[]->
    }
  `, { slug });
} 