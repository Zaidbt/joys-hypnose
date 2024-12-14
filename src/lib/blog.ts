import clientPromise from './mongodb';
import { BlogPost } from '@/types/blog';
import { ObjectId } from 'mongodb';

export async function createBlogPost(post: Omit<BlogPost, '_id'>) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  // Check if slug already exists
  const existingPost = await collection.findOne({ slug: post.slug });
  if (existingPost) {
    throw new Error('A post with this slug already exists');
  }

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
    .sort({ createdAt: -1 })
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

export async function updatePost(slug: string, updates: Partial<BlogPost>) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  // If trying to update slug, check if new slug already exists
  if (updates.slug && updates.slug !== slug) {
    const existingPost = await collection.findOne({ slug: updates.slug });
    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }
  }

  const result = await collection.findOneAndUpdate(
    { slug },
    { 
      $set: {
        ...updates,
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

export async function deletePost(slug: string) {
  const client = await clientPromise;
  const collection = client.db('joyshypnose').collection('blog_posts');
  
  const result = await collection.deleteOne({ slug });
  
  if (result.deletedCount === 0) {
    throw new Error('Post not found');
  }
  
  return { slug };
} 