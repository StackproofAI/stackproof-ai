-- Assessment requests. One person submitting twice on the same (UTC) day = one lead.
CREATE TABLE IF NOT EXISTS leads (
  id                   TEXT PRIMARY KEY,
  created_at           TEXT NOT NULL,           -- ISO 8601 UTC
  submit_date          TEXT NOT NULL,           -- YYYY-MM-DD (UTC)
  name                 TEXT NOT NULL,
  email                TEXT NOT NULL,
  email_normalised     TEXT NOT NULL,
  company              TEXT NOT NULL,
  website              TEXT,
  country              TEXT NOT NULL,
  team_size            TEXT NOT NULL,
  tools                TEXT,                    -- JSON array of strings
  process_description  TEXT NOT NULL,
  consent_at           TEXT NOT NULL,
  consent_text_version TEXT NOT NULL,
  locale               TEXT NOT NULL DEFAULT 'en',
  source_path          TEXT,
  status               TEXT NOT NULL DEFAULT 'new'
);
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_day ON leads (email_normalised, submit_date);
CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at);
