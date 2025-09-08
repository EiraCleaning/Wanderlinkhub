import { z } from 'zod';

// Database enums
export const ListingTypeSchema = z.enum(['event', 'hub']);
export const VerifyStatusSchema = z.enum(['pending', 'verified', 'rejected']);

// Base schemas
export const BaseListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  ltype: ListingTypeSchema,
  description: z.string().optional(),
  start_date: z.string().nullable().optional(), // Allow null for permanent hubs
  end_date: z.string().nullable().optional(), // Allow null for permanent hubs
  is_permanent: z.boolean().default(false), // Add permanent hub support
  price: z.number().min(0).optional(),
  website_url: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  
  // New fields
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().optional(),
  organiser_name: z.string().min(1, 'Organiser name is required'),
  organiser_about: z.string().max(200, 'About section must be 200 characters or less').optional(),
  age_range: z.string().optional(),
  capacity: z.string().optional(),
  photos: z.array(z.string()).optional(),
  verified_intent: z.boolean(),
  social_links: z.object({
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    other: z.string().optional(),
  }).optional(),
});

// Create listing schema
export const CreateListingSchema = BaseListingSchema;

// Update listing schema (partial)
export const UpdateListingSchema = BaseListingSchema.partial();

// Review schema
export const ReviewSchema = z.object({
  listing_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required').max(500, 'Comment too long'),
  author_name: z.string().optional(),
});

// Admin verification schema
export const AdminVerifySchema = z.object({
  id: z.string().uuid(),
  action: z.enum(['verify', 'reject']),
});

// Query parameters for listings
export const ListingsQuerySchema = z.object({
  ltype: ListingTypeSchema.optional(),
  from: z.string().optional(), // ISO date string
  to: z.string().optional(), // ISO date string
  verified: z.boolean().optional(), // Allow undefined to show all listings
  near: z.array(z.number()).length(2).optional(), // [lng, lat] format
  radiusKm: z.number().min(0.1).max(1000).optional(),
  location: z.string().optional(), // Text-based location search
});

// API response schemas
export const ListingResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  ltype: ListingTypeSchema,
  description: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  is_permanent: z.boolean().default(false), // Add permanent hub support
  price: z.number().nullable(),
  website_url: z.string().nullable(),
  city: z.string(),
  region: z.string().nullable(),
  country: z.string(),
  lat: z.number(),
  lng: z.number(),
  verify: VerifyStatusSchema,
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
  
  // New fields
  contact_email: z.string().nullable(),
  contact_phone: z.string().nullable(),
  organiser_name: z.string().nullable(),
  organiser_about: z.string().nullable(),
  age_range: z.string().nullable(),
  capacity: z.string().nullable(),
  photos: z.array(z.string()).nullable(),
  verified_intent: z.boolean().nullable(),
  social_links: z.object({
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    other: z.string().optional(),
  }).nullable(),
});

export const ReviewResponseSchema = z.object({
  id: z.string().uuid(),
  listing_id: z.string().uuid(),
  author_id: z.string().uuid(),
  author_name: z.string(),
  rating: z.number(),
  comment: z.string(),
  created_at: z.string(),
});

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  kids_ages: z.array(z.number()).default([]),
  created_at: z.string(),
});

// Type exports
export type ListingType = 'event' | 'hub';
export type VerifyStatus = z.infer<typeof VerifyStatusSchema>;
export type CreateListing = z.infer<typeof CreateListingSchema>;
export type UpdateListing = z.infer<typeof UpdateListingSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type AdminVerify = z.infer<typeof AdminVerifySchema>;
export type ListingsQuery = z.infer<typeof ListingsQuerySchema>;
export type ListingResponse = z.infer<typeof ListingResponseSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type Profile = z.infer<typeof ProfileSchema>;

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  other?: string;
}

export interface ListingPayload {
  type: ListingType;                 // event | hub
  title: string;
  description: string;
  startDate?: string;                // ISO (events only)
  endDate?: string;                  // ISO (events only)
  locationText: string;              // user-entered address
  lat?: number;
  lon?: number;                      // geocoded coords
  contactEmail: string;              // required (not public by default)
  contactPhone?: string;             // optional
  organiserName: string;             // required (first name + initial ok)
  organiserAbout?: string;           // short bio (≤ 200)
  socials: SocialLinks;              // website + socials
  ageRange?: string;                 // e.g., "5–12", "All ages"
  capacity?: string;                 // e.g., "Small (5–10)", "Up to 50"
  price?: string;                    // free/£/€
  photos: string[];                  // uploaded URLs (min 1 for hubs)
  verifiedIntent: boolean;           // "agree to provide proof if requested"
  status: 'pending' | 'verified';    // server-controlled
} 