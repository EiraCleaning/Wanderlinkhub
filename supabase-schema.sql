-- WanderLink Hub Database Schema
-- Run this in your Supabase SQL editor

-- ENUMS
create type listing_type as enum ('event','hub');
create type verify_status as enum ('pending','verified','rejected');

-- USERS come from auth.users; mirror minimal profile
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  kids_ages int[] default '{}',
  created_at timestamptz default now()
);

-- EVENT/HUB combined table
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ltype listing_type not null,                     -- event or hub
  description text,
  start_date date,
  end_date date,
  is_permanent boolean default false,             -- for permanent hubs
  price numeric,                                   -- optional
  website_url text,
  city text,
  region text,
  country text,
  lat double precision,
  lng double precision,
  geohash text,                                    -- optional future use
  verify verify_status not null default 'pending', -- pending/verified/rejected
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  
  -- New fields for enhanced information
  contact_email text,                              -- private, for verification only
  contact_phone text,                              -- private, for verification only
  organiser_name text,                             -- public, who's running this
  organiser_about text,                            -- public, short bio about organiser
  age_range text,                                  -- public, target age group
  capacity text,                                   -- public, group size capacity
  photos text[],                                   -- public, array of photo URLs
  verified_intent boolean default false,           -- private, agreement to provide proof
  social_links jsonb                               -- public, structured social media links
);

-- REVIEWS
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (listing_id, author_id)                   -- one review per user per listing
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table reviews enable row level security;

-- PROFILES policies
create policy "Profiles are readable by self"
on profiles for select using (auth.uid() = id);

create policy "Profiles upsert by self"
on profiles for insert with check (auth.uid() = id);

create policy "Profiles update by self"
on profiles for update using (auth.uid() = id);

-- LISTINGS policies
-- Public can read VERIFIED and PENDING listings (but not rejected)
create policy "Public read verified and pending listings"
on listings for select
using (verify IN ('verified', 'pending'));

-- Owners (creator) can read their own rejected listings in client
create policy "Owner read own listings"
on listings for select
using (created_by = auth.uid());

-- Authenticated users can insert PENDING listings they create
create policy "Users insert pending listings"
on listings for insert
with check (created_by = auth.uid() and verify = 'pending');

-- Only admin (via service role or custom claim) can update verify status
-- Client-side: restrict updates to owners except verify
create policy "Owner update own non-verify fields"
on listings for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

-- REVIEWS policies
-- Read reviews for verified and pending listings
create policy "Read reviews for verified and pending listings"
on reviews for select
using (exists (select 1 from listings l where l.id = listing_id and l.verify IN ('verified', 'pending')));

-- Insert reviews if user is logged in and listing is verified or pending
create policy "Insert review if listing verified or pending"
on reviews for insert
with check (
  auth.uid() = author_id
  and exists (select 1 from listings l where l.id = listing_id and l.verify IN ('verified', 'pending'))
);

-- Update/Delete only by author
create policy "Update own review"
on reviews for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

create policy "Delete own review"
on reviews for delete using (auth.uid() = author_id);

-- Create indexes for better performance
create index idx_listings_verify on listings(verify);
create index idx_listings_ltype on listings(ltype);
create index idx_listings_dates on listings(start_date, end_date);
create index idx_listings_location on listings(lat, lng);
create index idx_reviews_listing on reviews(listing_id); 

-- User Profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favourites table
CREATE TABLE IF NOT EXISTS public.favourites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- RLS Policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for favourites
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favourites" ON public.favourites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites" ON public.favourites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites" ON public.favourites
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON public.favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_listing_id ON public.favourites(listing_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email); 