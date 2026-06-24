CREATE OR REPLACE FUNCTION notify_on_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
BEGIN
  SELECT CASE
    WHEN NEW.sender_id = requester_id THEN provider_id
    ELSE requester_id
  END INTO recipient_id
  FROM exchanges WHERE id = NEW.exchange_id;

  INSERT INTO notifications (user_id, type, message, related_id)
  VALUES (
    recipient_id,
    'new_message',
    'You have a new message on your exchange.',
    NEW.exchange_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_on_exchange_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Accepted' THEN
    INSERT INTO notifications (user_id, type, message, related_id)
    VALUES (NEW.requester_id, 'proposal_accepted',
            'Your exchange proposal was accepted.', NEW.id);
  ELSIF NEW.status = 'Cancelled' THEN
    INSERT INTO notifications (user_id, type, message, related_id)
    VALUES (NEW.requester_id, 'proposal_declined',
            'Your exchange proposal was declined or cancelled.', NEW.id);
  ELSIF NEW.status = 'Completed' THEN
    INSERT INTO notifications (user_id, type, message, related_id)
    VALUES (NEW.requester_id, 'exchange_completed',
            'Your exchange has been marked as completed.', NEW.id);
    INSERT INTO notifications (user_id, type, message, related_id)
    VALUES (NEW.provider_id, 'exchange_completed',
            'Your exchange has been marked as completed.', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
    AND owner_id != NEW.requester_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
