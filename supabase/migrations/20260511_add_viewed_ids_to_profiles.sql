-- Migration: Add viewed_ids to profiles table
-- Add this column to persist viewed items history per user account

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS viewed_ids text[] DEFAULT array[]::text[];
