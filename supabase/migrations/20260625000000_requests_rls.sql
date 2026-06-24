ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active requests are readable"
  ON requests FOR SELECT
  TO authenticated
  USING (status = 'Active' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert and update their requests"
  ON requests FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());
