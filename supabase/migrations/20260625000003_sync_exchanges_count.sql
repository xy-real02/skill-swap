-- Trigger function to automatically maintain profiles.exchange_count
CREATE OR REPLACE FUNCTION update_profile_exchange_counts()
RETURNS TRIGGER AS $$
DECLARE
  p_id UUID;
  r_id UUID;
  old_p_id UUID;
  old_r_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    p_id := OLD.provider_id;
    r_id := OLD.requester_id;
  ELSIF TG_OP = 'UPDATE' THEN
    p_id := NEW.provider_id;
    r_id := NEW.requester_id;
    old_p_id := OLD.provider_id;
    old_r_id := OLD.requester_id;
  ELSE
    p_id := NEW.provider_id;
    r_id := NEW.requester_id;
  END IF;

  -- Update provider
  IF p_id IS NOT NULL THEN
    UPDATE profiles
    SET exchange_count = (
      SELECT COUNT(*)
      FROM exchanges
      WHERE (provider_id = p_id OR requester_id = p_id)
        AND status NOT IN ('Cancelled', 'Declined')
    )
    WHERE id = p_id;
  END IF;

  -- Update requester
  IF r_id IS NOT NULL AND r_id IS DISTINCT FROM p_id THEN
    UPDATE profiles
    SET exchange_count = (
      SELECT COUNT(*)
      FROM exchanges
      WHERE (provider_id = r_id OR requester_id = r_id)
        AND status NOT IN ('Cancelled', 'Declined')
    )
    WHERE id = r_id;
  END IF;

  -- If provider or requester changed in UPDATE, update old ones too
  IF TG_OP = 'UPDATE' THEN
    IF old_p_id IS NOT NULL AND old_p_id IS DISTINCT FROM p_id AND old_p_id IS DISTINCT FROM r_id THEN
      UPDATE profiles
      SET exchange_count = (
        SELECT COUNT(*)
        FROM exchanges
        WHERE (provider_id = old_p_id OR requester_id = old_p_id)
          AND status NOT IN ('Cancelled', 'Declined')
      )
      WHERE id = old_p_id;
    END IF;
    IF old_r_id IS NOT NULL AND old_r_id IS DISTINCT FROM r_id AND old_r_id IS DISTINCT FROM p_id AND old_r_id IS DISTINCT FROM old_p_id THEN
      UPDATE profiles
      SET exchange_count = (
        SELECT COUNT(*)
        FROM exchanges
        WHERE (provider_id = old_r_id OR requester_id = old_r_id)
          AND status NOT IN ('Cancelled', 'Declined')
      )
      WHERE id = old_r_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_profile_exchange_counts ON exchanges;

CREATE TRIGGER tr_update_profile_exchange_counts
  AFTER INSERT OR UPDATE OR DELETE ON exchanges
  FOR EACH ROW EXECUTE FUNCTION update_profile_exchange_counts();

-- Modify handle_review_publish() so it only updates reputation_score, avoiding double counting exchange_count
CREATE OR REPLACE FUNCTION handle_review_publish()
RETURNS TRIGGER AS $$
DECLARE
  review_count INT;
  new_score    DECIMAL(3,2);
BEGIN
  SELECT COUNT(*) INTO review_count
  FROM reviews
  WHERE exchange_id = NEW.exchange_id;

  IF review_count = 2 THEN
    UPDATE reviews
    SET is_published = TRUE
    WHERE exchange_id = NEW.exchange_id;

    SELECT AVG(rating) INTO new_score
    FROM reviews
    WHERE target_id = NEW.target_id AND is_published = TRUE;

    UPDATE profiles
    SET reputation_score = new_score
    WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Immediately backfill all profiles in the DB right now!
UPDATE profiles p
SET exchange_count = (
  SELECT COUNT(*)
  FROM exchanges e
  WHERE (e.provider_id = p.id OR e.requester_id = p.id)
    AND e.status NOT IN ('Cancelled', 'Declined')
);
