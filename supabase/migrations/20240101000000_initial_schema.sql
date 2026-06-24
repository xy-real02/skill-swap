
-- 1. Member Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id               UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name        TEXT NOT NULL,
  bio              TEXT,
  phone_number     TEXT,
  community_zone   TEXT NOT NULL,
  avatar_url       TEXT,
  reputation_score DECIMAL(3,2) DEFAULT 0.00,
  exchange_count   INT DEFAULT 0,
  role             TEXT DEFAULT 'Member'
                   CHECK (role IN ('Member', 'Moderator', 'Admin')),
  status           TEXT DEFAULT 'Active'
                   CHECK (status IN ('Active', 'Suspended', 'Pending')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
-- Note: `status = 'Pending'` is used when Admin approval is required.
-- A trigger on auth.users sets status to 'Pending' if the community
-- setting `require_approval = true`, and 'Active' otherwise.


-- 2. Skill Listings
CREATE TABLE listings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id            UUID REFERENCES profiles(id) NOT NULL,
  title               TEXT NOT NULL CHECK (char_length(title) <= 80),
  category            TEXT NOT NULL,
  description         TEXT NOT NULL CHECK (char_length(description) <= 500),
  availability        TEXT,
  exchange_preference TEXT,
  location_note       TEXT,
  status              TEXT DEFAULT 'Active'
                      CHECK (status IN ('Active', 'Paused', 'Archived')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- 3. Skill Requests
-- NOTE: This table was missing from the original schema. Added in v1.1.
CREATE TABLE requests (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id           UUID REFERENCES profiles(id) NOT NULL,
  title              TEXT NOT NULL CHECK (char_length(title) <= 80),
  category           TEXT NOT NULL,
  description        TEXT NOT NULL CHECK (char_length(description) <= 500),
  offered_in_return  TEXT NOT NULL,
  desired_timeframe  TEXT,
  status             TEXT DEFAULT 'Active'
                     CHECK (status IN ('Active', 'Fulfilled',
                                       'Cancelled', 'Expired')),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  expires_at         TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);


-- 4. Exchange Proposals (State Machine)
CREATE TABLE exchanges (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id        UUID REFERENCES listings(id),
  source_request_id UUID REFERENCES requests(id),  -- nullable
  requester_id      UUID REFERENCES profiles(id) NOT NULL,
  provider_id       UUID REFERENCES profiles(id) NOT NULL,
  offered_skill     TEXT NOT NULL,
  status            TEXT DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'Accepted', 'Scheduled',
                                      'Completed', 'Cancelled', 'Disputed')),
  completed_by      UUID REFERENCES profiles(id),  -- first party to mark done
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_exchange CHECK (requester_id != provider_id)
);


-- 5. Messages
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exchange_id UUID REFERENCES exchanges(id) NOT NULL,
  sender_id   UUID REFERENCES profiles(id) NOT NULL,
  content     TEXT NOT NULL CHECK (char_length(content) <= 1000),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- 6. Reviews
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exchange_id  UUID REFERENCES exchanges(id) NOT NULL,
  reviewer_id  UUID REFERENCES profiles(id) NOT NULL,
  target_id    UUID REFERENCES profiles(id) NOT NULL,
  rating       INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment      TEXT CHECK (char_length(comment) <= 500),
  is_published BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (exchange_id, reviewer_id)  -- one review per reviewer per exchange
);


-- 7. Notifications
-- NOTE: This table was missing from the original schema. Added in v1.1.
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) NOT NULL,
  type        TEXT NOT NULL,
  -- type values: proposal_received, proposal_accepted, proposal_declined,
  -- exchange_scheduled, exchange_completed, review_received,
  -- request_matched, account_warning, account_suspended, new_message
  message     TEXT NOT NULL,
  related_id  UUID,              -- links to the relevant exchange/listing/etc.
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- 8. Reports
-- NOTE: This table was entirely absent from the original schema. Added v1.1.
CREATE TABLE reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id     UUID REFERENCES profiles(id) NOT NULL,
  target_type     TEXT NOT NULL
                  CHECK (target_type IN ('listing', 'request',
                                         'message', 'review', 'profile')),
  target_id       UUID NOT NULL,
  reason          TEXT NOT NULL
                  CHECK (reason IN ('spam', 'inappropriate_content',
                                    'fraudulent_claim', 'harassment', 'other')),
  details         TEXT CHECK (char_length(details) <= 300),
  status          TEXT DEFAULT 'open'
                  CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_by     UUID REFERENCES profiles(id),
  resolution_note TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  UNIQUE (reporter_id, target_id)  -- prevent duplicate reports
);


-- 9. Moderation Log (immutable audit trail)
-- NOTE: This table was entirely absent from the original schema. Added v1.1.
CREATE TABLE moderation_log (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id       UUID REFERENCES profiles(id) NOT NULL,
  action             TEXT NOT NULL
                     CHECK (action IN ('warning_issued', 'content_removed',
                                       'member_suspended', 'member_reinstated',
                                       'review_removed', 'report_dismissed')),
  target_user_id     UUID REFERENCES profiles(id) NOT NULL,
  target_content_id  UUID,  -- nullable; ID of the content acted upon
  reason             TEXT NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT NOW()
  -- No UPDATE or DELETE RLS policy is set on this table.
  -- It is append-only by design.
);


-- 10. Community Settings
-- NOTE: This table was entirely absent from the original schema. Added v1.1.
CREATE TABLE community_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_name        TEXT NOT NULL,
  community_zone_list   TEXT[] NOT NULL DEFAULT '{}',
  require_approval      BOOLEAN DEFAULT FALSE,
  max_listings_per_user INT DEFAULT 5,
  request_expiry_days   INT DEFAULT 30,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Cache (populated by Edge Function, not queried live)
CREATE TABLE analytics_cache (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_key   TEXT NOT NULL UNIQUE,
  metric_value JSONB NOT NULL,
  refreshed_at TIMESTAMPTZ DEFAULT NOW()
);


--------------------------------------------------------------------
INDEXES
--------------------------------------------------------------------

-- Listings
CREATE INDEX idx_listings_category    ON listings(category);
CREATE INDEX idx_listings_owner       ON listings(owner_id);
CREATE INDEX idx_listings_status      ON listings(status);
-- Full-Text Search
ALTER TABLE listings ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || description)
  ) STORED;
CREATE INDEX idx_listings_fts ON listings USING GIN(fts);

-- Requests
CREATE INDEX idx_requests_category   ON requests(category);
CREATE INDEX idx_requests_owner      ON requests(owner_id);
CREATE INDEX idx_requests_expires_at ON requests(expires_at);

-- Exchanges
CREATE INDEX idx_exchanges_requester ON exchanges(requester_id);
CREATE INDEX idx_exchanges_provider  ON exchanges(provider_id);
CREATE INDEX idx_exchanges_status    ON exchanges(status);

-- Messages
CREATE INDEX idx_messages_exchange   ON messages(exchange_id);

-- Notifications
CREATE INDEX idx_notifications_user  ON notifications(user_id);
CREATE INDEX idx_notifications_read  ON notifications(user_id, is_read);

-- Reports
CREATE INDEX idx_reports_status      ON reports(status);
CREATE INDEX idx_reports_target      ON reports(target_id);

-- Moderation Log
CREATE INDEX idx_modlog_moderator    ON moderation_log(moderator_id);


--------------------------------------------------------------------
TRIGGERS
--------------------------------------------------------------------

-- T1: Auto-create profile row on new auth user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, community_zone, status)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    '',
    CASE WHEN (SELECT require_approval FROM community_settings LIMIT 1)
         THEN 'Pending' ELSE 'Active' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- T2: Update exchange updated_at on status change
CREATE OR REPLACE FUNCTION update_exchange_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_exchange_status_change
  BEFORE UPDATE OF status ON exchanges
  FOR EACH ROW EXECUTE FUNCTION update_exchange_timestamp();

-- T3: Publish reviews and update reputation score
CREATE OR REPLACE FUNCTION handle_review_publish()
RETURNS TRIGGER AS $$
DECLARE
  review_count INT;
  new_score    DECIMAL(3,2);
BEGIN
  -- Check if both reviews for this exchange exist
  SELECT COUNT(*) INTO review_count
  FROM reviews
  WHERE exchange_id = NEW.exchange_id;

  IF review_count = 2 THEN
    -- Publish both reviews
    UPDATE reviews
    SET is_published = TRUE
    WHERE exchange_id = NEW.exchange_id;

    -- Update reputation score for the target of the new review
    SELECT AVG(rating) INTO new_score
    FROM reviews
    WHERE target_id = NEW.target_id AND is_published = TRUE;

    UPDATE profiles
    SET reputation_score = new_score,
        exchange_count   = exchange_count + 1
    WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION handle_review_publish();

-- T4: Generate notification on new message
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_inserted
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_on_message();

-- T5: Generate notification on exchange status change
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_exchange_updated
  AFTER UPDATE OF status ON exchanges
  FOR EACH ROW EXECUTE FUNCTION notify_on_exchange_update();

-- T6: Notify matching members when a new request is posted
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
    AND status = 'Active'
    AND owner_id != NEW.owner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_request_inserted
  AFTER INSERT ON requests
  FOR EACH ROW EXECUTE FUNCTION notify_on_new_request();


--------------------------------------------------------------------
SUPABASE RPCS (STATE MACHINE ENFORCEMENT)
--------------------------------------------------------------------

-- accept_proposal: Pending -> Accepted
CREATE OR REPLACE FUNCTION accept_proposal(exchange_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE exchanges
  SET status = 'Accepted'
  WHERE id = exchange_id
    AND status = 'Pending'
    AND provider_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid transition or unauthorized.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- mark_complete: Scheduled -> (Completed by one) or Completed
CREATE OR REPLACE FUNCTION mark_complete(exchange_id UUID)
RETURNS VOID AS $$
DECLARE
  ex exchanges%ROWTYPE;
BEGIN
  SELECT * INTO ex FROM exchanges WHERE id = exchange_id;

  IF ex.status NOT IN ('Accepted', 'Scheduled') THEN
    RAISE EXCEPTION 'Exchange is not in a completable state.';
  END IF;

  IF auth.uid() NOT IN (ex.requester_id, ex.provider_id) THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF ex.completed_by IS NULL THEN
    -- First party to mark complete
    UPDATE exchanges
    SET completed_by = auth.uid()
    WHERE id = exchange_id;
  ELSE
    -- Second party confirms: set to Completed
    UPDATE exchanges
    SET status = 'Completed'
    WHERE id = exchange_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


--------------------------------------------------------------------
SCHEDULED JOBS (pg_cron)
--------------------------------------------------------------------

-- Run daily at 02:00 UTC.

-- J1: Auto-expire requests older than expiry window
SELECT cron.schedule(
  'expire-old-requests',
  '0 2 * * *',
  $$
    UPDATE requests
    SET status = 'Expired'
    WHERE expires_at < NOW() AND status = 'Active';
  $$
);

-- J2: Auto-complete exchanges where one party confirmed > 7 days ago
SELECT cron.schedule(
  'auto-complete-exchanges',
  '0 2 * * *',
  $$
    UPDATE exchanges
    SET status = 'Completed'
    WHERE completed_by IS NOT NULL
      AND status IN ('Accepted', 'Scheduled')
      AND updated_at < NOW() - INTERVAL '7 days';
  $$
);

-- J3: Publish orphaned reviews after 7-day window
SELECT cron.schedule(
  'publish-orphaned-reviews',
  '0 2 * * *',
  $$
    UPDATE reviews r
    SET is_published = TRUE
    WHERE is_published = FALSE
      AND created_at < NOW() - INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM reviews r2
        WHERE r2.exchange_id = r.exchange_id
          AND r2.reviewer_id != r.reviewer_id
          AND r2.is_published = TRUE
      );
  $$
);

-- J4: Clean up notifications older than 90 days
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 3 * * *',
  $$
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '90 days'
      AND is_read = TRUE;
  $$
);


--------------------------------------------------------------------
SAMPLE RLS POLICIES
--------------------------------------------------------------------

-- Profiles: members read all; write own only
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Members can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);


-- Listings: all authenticated can read Active; owners manage theirs
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are readable"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'Active' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert and update their listings"
  ON listings FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());


-- Exchanges: only parties involved can read/update
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exchange parties only"
  ON exchanges FOR ALL
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = provider_id);


-- Messages: parties of the exchange can read/insert
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exchange parties can read and send messages"
  ON messages FOR ALL
  TO authenticated
  USING (
    exchange_id IN (
      SELECT id FROM exchanges
      WHERE requester_id = auth.uid() OR provider_id = auth.uid()
    )
  );


-- Notifications: users read their own only
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update their own notifications (mark read)"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());


-- Reports: members insert; moderators read/update
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

