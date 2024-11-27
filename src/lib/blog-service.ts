import { BlogPost, CreateBlogPost, UpdateBlogPost } from '@/types/blog';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getAllPosts() {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');
  
  const posts = await collection
    .find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .toArray();

  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    featuredImage: post.featuredImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
  }));
}

export async function getPostById(id: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');
  
  const post = await collection.findOne({ 
    _id: new ObjectId(id)
  });
  
  if (!post) return null;
  
  return {
    ...post,
    _id: post._id.toString(),
    featuredImage: post.featuredImage || '',
    tags: post.tags || [],
    author: post.author || 'Admin',
  };
}

export async function createPost(post: CreateBlogPost) {
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

export async function updatePost(id: string, post: UpdateBlogPost) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...post,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error('Post not found');
  }
  
  return {
    ...result,
    _id: result._id.toString()
  };
}

export async function deletePost(id: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('posts');
  
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
  if (result.deletedCount === 0) {
    throw new Error('Post not found');
  }
  
  return { _id: id };
} 