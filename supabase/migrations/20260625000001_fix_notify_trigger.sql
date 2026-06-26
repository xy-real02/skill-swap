CREATE OR REPLACE FUNCTION notify_on_new_request()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, message, related_id)
  SELECT DISTINCT owner_id,
    'request_matched',
    'A new skill request matches one of your listings.',
    NEW.id
  FROM listings 
  WHERE category = NEW.category 
    AND owner_id != NEW.owner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
