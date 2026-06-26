-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Published reviews are readable by everyone
CREATE POLICY "Published reviews are readable by everyone"
  ON reviews FOR SELECT
  USING (is_published = TRUE);

-- Policy: Users can read reviews they wrote or received
CREATE POLICY "Users can read reviews they wrote or received"
  ON reviews FOR SELECT
  TO authenticated
  USING (reviewer_id = auth.uid() OR target_id = auth.uid());

-- Policy: Users can insert reviews they write
CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());
