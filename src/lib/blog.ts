import clientPromise from './mongodb';
import { BlogPost } from '@/types/blog';
import { ObjectId } from 'mongodb';

export async function createBlogPost(post: Omit<BlogPost, '_id'>) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const newPost = {
    ...post,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await collection.insertOne(newPost);
  
  return {
    ...newPost,
    _id: result.insertedId.toString()
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const posts = await collection
    .find({})
    .sort({ publishedAt: -1 })
    .toArray();

  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
    readingTime: post.readingTime || 1,
    createdAt: post.createdAt || new Date(),
    updatedAt: post.updatedAt || new Date()
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const post = await collection.findOne({ slug });
  
  if (!post) return null;
  
  return {
    ...post,
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
    readingTime: post.readingTime || 1,
    createdAt: post.createdAt || new Date(),
    updatedAt: post.updatedAt || new Date()
  };
} 