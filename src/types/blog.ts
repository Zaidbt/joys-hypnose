export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  author?: string;
  readingTime?: number;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBlogPost = Omit<BlogPost, '_id' | 'author' | 'createdAt' | 'updatedAt'>;
export type UpdateBlogPost = Partial<Omit<BlogPost, '_id' | 'author' | 'createdAt' | 'updatedAt'>>; 