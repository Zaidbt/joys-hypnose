import clientPromise from './mongodb';
import { BlogPost, CreateBlogPost } from '@/types/blog';
import { ObjectId } from 'mongodb';

export async function createBlogPost(post: CreateBlogPost) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');

  const postToInsert = {
    ...post,
    featuredImage: post.featuredImage || '',
    tags: post.tags || [],
    author: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await collection.insertOne(postToInsert);

  return {
    ...postToInsert,
    _id: result.insertedId.toString()
  };
}

export async function getBlogPosts() {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');

  const posts = await collection
    .find({ status: 'published' })
    .sort({ createdAt: -1 })
    .toArray();

  return posts.map(post => ({
    ...post,
    _id: post._id.toString()
  }));
}

export async function getBlogPost(id: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');

  const post = await collection.findOne({ _id: new ObjectId(id) });
  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString()
  };
} 