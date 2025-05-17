CREATE TABLE price_history (
  id              SERIAL PRIMARY KEY,
  product_id      TEXT NOT NULL,
  title           TEXT NOT NULL,
  platform        TEXT NOT NULL,
  price           NUMERIC(12,2) NOT NULL,
  original_price  NUMERIC(12,2),
  currency        TEXT NOT NULL,
  discount        TEXT,
  image_url       TEXT,
  fetched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);