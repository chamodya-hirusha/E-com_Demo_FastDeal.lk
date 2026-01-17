-- Add admin role to a specific user
-- Replace 'your-email@example.com' with the actual email of the user you want to make admin

-- First, get the user ID from auth.users
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID for the email (update this email)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@everydayessentials.lk' -- Change this to your email
  LIMIT 1;

  -- If user exists, add admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added to user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'User not found. Please create an account first.';
  END IF;
END $$;
