-- Migration: Add owner details and IP address fields to devices table
-- Run this SQL in Supabase SQL Editor if you already have an existing devices table

-- Add new columns to devices table
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_mobile TEXT,
ADD COLUMN IF NOT EXISTS owner_landline TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN devices.owner_name IS 'Name of the device owner';
COMMENT ON COLUMN devices.owner_mobile IS 'Mobile phone number of the device owner';
COMMENT ON COLUMN devices.owner_landline IS 'Landline phone number of the device owner';
COMMENT ON COLUMN devices.ip_address IS 'IP address of the device (optional)';
