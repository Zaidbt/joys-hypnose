import { BlogPost } from '@/types/blog';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getAllPosts() {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const posts = await collection
    .find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .toArray();

  return posts.map(post => ({
    ...post,
    id: post._id.toString(),
    _id: undefined,
    coverImage: post.coverImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
    publishedAt: post.publishedAt || new Date().toISOString(),
  }));
}

export async function getPostBySlug(slug: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const post = await collection.findOne({ 
    slug,
    status: 'published'
  });
  
  if (!post) return null;
  
  return {
    ...post,
    id: post._id.toString(),
    _id: undefined,
    coverImage: post.coverImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
    publishedAt: post.publishedAt || new Date().toISOString(),
  };
}

export async function createPost(post: Omit<BlogPost, 'id'>) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const { _id, ...postWithoutId } = post;
  
  const result = await collection.insertOne({
    ...postWithoutId,
    publishedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    coverImage: post.featuredImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
  });
  
  return {
    ...post,
    id: result.insertedId.toString()
  };
}

export async function updatePost(id: string, post: Partial<BlogPost>) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: post }
  );
  
  return {
    ...post,
    id
  };
}

export async function deletePost(id: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  await collection.deleteOne({ _id: new ObjectId(id) });
  
  return { id };
} 