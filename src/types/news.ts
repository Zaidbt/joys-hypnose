export type NewsType = 'press' | 'event' | 'general';
export type NewsStatus = 'draft' | 'published';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface NewsItem {
  _id?: string;
  type: NewsType;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  status: NewsStatus;
  slug: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  
  // Press specific fields
  publication?: string;
  originalArticleUrl?: string;
  pdfUrl?: string;
  
  // Event specific fields
  eventDate?: Date;
  eventEndDate?: Date;
  eventLocation?: string;
  eventCapacity?: number;
  eventPrice?: number;
  isOnline?: boolean;
  registrationDeadline?: Date;
  registrationsCount?: number;
  isRegistrationClosed?: boolean;
}

export interface EventRegistration {
  _id?: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: Date;
  status: RegistrationStatus;
  notes?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentAmount?: number;
  attendanceConfirmed?: boolean;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem | NewsItem[];
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface RegistrationResponse {
  success: boolean;
  data: EventRegistration | EventRegistration[];
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
} 