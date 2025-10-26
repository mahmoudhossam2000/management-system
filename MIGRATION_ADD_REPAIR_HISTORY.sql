-- Migration: Create repair_history table with full CRUD policies
-- Run this SQL in Supabase SQL Editor

-- Create repair_history table
CREATE TABLE IF NOT EXISTS repair_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  repair_description TEXT NOT NULL,
  repair_date DATE NOT NULL,
  technician_name TEXT,
  cost DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'مكتمل',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE repair_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read repair history" ON repair_history;
DROP POLICY IF EXISTS "Admins can insert repair history" ON repair_history;

-- Policy: All authenticated users can read repair history
CREATE POLICY "Authenticated users can read repair history" ON repair_history
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only admins can insert repair history
CREATE POLICY "Admins can insert repair history" ON repair_history
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy: Only admins can update repair history
CREATE POLICY "Admins can update repair history" ON repair_history
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy: Only admins can delete repair history
CREATE POLICY "Admins can delete repair history" ON repair_history
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repair_history_device_id ON repair_history(device_id);
CREATE INDEX IF NOT EXISTS idx_repair_history_repair_date ON repair_history(repair_date);
CREATE INDEX IF NOT EXISTS idx_repair_history_created_by ON repair_history(created_by);

-- Add comments to document the table
COMMENT ON TABLE repair_history IS 'Stores repair and maintenance history for devices';
COMMENT ON COLUMN repair_history.device_id IS 'Reference to the device being repaired';
COMMENT ON COLUMN repair_history.repair_description IS 'Description of the repair work';
COMMENT ON COLUMN repair_history.repair_date IS 'Date when the repair was performed';
COMMENT ON COLUMN repair_history.technician_name IS 'Name of the technician who performed the repair';
COMMENT ON COLUMN repair_history.cost IS 'Cost of the repair in local currency';
COMMENT ON COLUMN repair_history.status IS 'Status of the repair (completed, pending, etc.)';
