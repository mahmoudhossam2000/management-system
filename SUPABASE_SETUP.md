# إعداد قاعدة بيانات Supabase

## الجداول المطلوبة

### 1. جدول المستخدمين (users)

قم بإنشاء جدول `users` في Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow insert for authenticated users (for signup)
CREATE POLICY "Allow insert for authenticated users" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. جدول الأجهزة (devices)

قم بإنشاء جدول `devices` في Supabase SQL Editor:

```sql
-- Create devices table
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  sector TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'نشط',
  owner_name TEXT,
  owner_mobile TEXT,
  owner_landline TEXT,
  ip_address TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read devices
CREATE POLICY "Authenticated users can read devices" ON devices
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only admins can insert devices
CREATE POLICY "Admins can insert devices" ON devices
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy: Only admins can update devices
CREATE POLICY "Admins can update devices" ON devices
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy: Only admins can delete devices
CREATE POLICY "Admins can delete devices" ON devices
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Create index for better performance
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_department ON devices(department);
CREATE INDEX idx_devices_sector ON devices(sector);
CREATE INDEX idx_devices_created_by ON devices(created_by);
```

### 3. جدول سجل الإصلاحات (repair_history) - اختياري للمستقبل

```sql
-- Create repair_history table
CREATE TABLE repair_history (
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

-- Create index for better performance
CREATE INDEX idx_repair_history_device_id ON repair_history(device_id);
CREATE INDEX idx_repair_history_repair_date ON repair_history(repair_date);
CREATE INDEX idx_repair_history_created_by ON repair_history(created_by);
```

## إنشاء مستخدم مسؤول (Admin)

بعد إنشاء الجداول، قم بتسجيل حساب جديد من خلال التطبيق، ثم قم بتحديثه ليصبح مسؤول:

```sql
-- Update a user to be admin (replace 'user@example.com' with actual email)
UPDATE users 
SET is_admin = true 
WHERE email = 'user@example.com';
```

أو يمكنك إنشاء مستخدم مسؤول مباشرة:

```sql
-- First, create the user in Supabase Authentication
-- Then run this query with the user's ID
INSERT INTO users (id, email, full_name, is_admin)
VALUES (
  'USER_ID_FROM_AUTH',  -- Replace with actual user ID from auth.users
  'admin@example.com',
  'Admin User',
  true
);
```

## متغيرات البيئة (.env)

تأكد من أن ملف `.env` يحتوي على:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ملاحظات مهمة

1. **Row Level Security (RLS)**: تم تفعيل RLS على جميع الجداول لضمان الأمان
2. **صلاحيات المسؤول**: فقط المستخدمون الذين لديهم `is_admin = true` يمكنهم إضافة/تعديل/حذف الأجهزة
3. **جميع المستخدمين**: يمكنهم عرض الأجهزة فقط
4. **التحقق من البريد الإلكتروني**: يمكنك تعطيل التحقق من البريد الإلكتروني في إعدادات Supabase Authentication للتطوير

## خطوات التشغيل

1. قم بإنشاء مشروع جديد في Supabase
2. انسخ الـ URL و Anon Key إلى ملف `.env`
3. قم بتشغيل جميع الاستعلامات SQL أعلاه في SQL Editor
4. قم بتسجيل حساب جديد من التطبيق
5. قم بتحديث المستخدم ليصبح مسؤول باستخدام SQL
6. سجل الدخول مرة أخرى للوصول إلى لوحة التحكم

## حالات الأجهزة المتاحة

- نشط
- قيد الصيانة
- معطل
- متوقف

## أنواع الأجهزة المتاحة

- PC (كمبيوتر)
- Printer (طابعة)
- Scanner (ماسح ضوئي)
