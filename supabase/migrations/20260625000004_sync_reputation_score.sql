-- Trigger function to automatically maintain profiles.exchange_count strictly for Completed exchanges
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
        AND status = 'Completed'
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
        AND status = 'Completed'
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
          AND status = 'Completed'
      )
      WHERE id = old_p_id;
    END IF;
    IF old_r_id IS NOT NULL AND old_r_id IS DISTINCT FROM r_id AND old_r_id IS DISTINCT FROM p_id AND old_r_id IS DISTINCT FROM old_p_id THEN
      UPDATE profiles
      SET exchange_count = (
        SELECT COUNT(*)
        FROM exchanges
        WHERE (provider_id = old_r_id OR requester_id = old_r_id)
          AND status = 'Completed'
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

-- Trigger function to automatically maintain profiles.reputation_score
CREATE OR REPLACE FUNCTION update_profile_reputation()
RETURNS TRIGGER AS $$
DECLARE
  t_id UUID;
  new_score DECIMAL(3,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    t_id := OLD.target_id;
  ELSE
    t_id := NEW.target_id;
    -- Auto publish inserted/updated review
    NEW.is_published := TRUE;
  END IF;

  IF t_id IS NOT NULL THEN
    SELECT AVG(rating) INTO new_score
    FROM reviews
    WHERE target_id = t_id;

    UPDATE profiles
    SET reputation_score = COALESCE(ROUND(new_score::numeric, 2), 0)
    WHERE id = t_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_inserted ON reviews;
DROP TRIGGER IF EXISTS tr_update_profile_reputation ON reviews;

CREATE TRIGGER tr_update_profile_reputation
  BEFORE INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_reputation();

-- Immediately backfill all exchange counts in the DB right now!
UPDATE profiles p
SET exchange_count = (
  SELECT COUNT(*)
  FROM exchanges e
  WHERE (e.provider_id = p.id OR e.requester_id = p.id)
    AND e.status = 'Completed'
);

-- Immediately backfill all reputation scores in the DB right now!
UPDATE profiles p
SET reputation_score = COALESCE((
  SELECT ROUND(AVG(rating)::numeric, 2)
  FROM reviews r
  WHERE r.target_id = p.id
), 0);
