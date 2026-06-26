-- Update the trigger to handle the new multi-step registration fields
-- We need to extract bio, community_zone, and phone_number from raw_user_meta_data

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, bio, phone_number, community_zone, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(NEW.raw_user_meta_data->>'community_zone', ''),
    COALESCE(
      (SELECT CASE WHEN require_approval THEN 'Pending' ELSE 'Active' END 
       FROM public.community_settings LIMIT 1), 
      'Active'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
