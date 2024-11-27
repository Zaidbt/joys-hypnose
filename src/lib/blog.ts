import { getCollection } from './mongodb';
import { BlogPost } from '@/types/blog';

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>) {
  const collection = await getCollection('posts');
  
  const newPost = {
    ...post,
    publishedAt: new Date().toISOString()
  };

  const result = await collection.insertOne(newPost);
  
  return {
    id: result.insertedId.toString(),
    ...newPost
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const collection = await getCollection('posts');
  
  const posts = await collection
    .find({}, { sort: { publishedAt: -1 } })
    .asArray();

  return posts.map(post => ({
    ...post,
    id: post._id.toString(),
    _id: undefined
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getCollection('posts');
  
  const post = await collection.findOne({ slug });
  
  if (!post) return null;

  return {
    ...post,
    id: post._id.toString(),
    _id: undefined
  };
} 