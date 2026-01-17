-- Create a demo admin user
-- This will create a user with email demouser@admin.com and password user12345

-- Note: In Supabase, we need to use email for authentication
-- We'll use 'demouser@admin.com' as the email

-- First, you need to manually create this user in Supabase Auth
-- Then run this migration to add admin role

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Try to find the demo user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'demouser@admin.com'
  LIMIT 1;

  -- If user exists, add admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added to demo user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Demo user not found. Please create user with email: demouser@admin.com';
  END IF;
END $$;
