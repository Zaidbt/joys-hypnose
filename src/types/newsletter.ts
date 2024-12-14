export interface NewsletterSubscription {
  _id?: string;
  email: string;
  createdAt: Date;
  status: 'active' | 'unsubscribed';
} 