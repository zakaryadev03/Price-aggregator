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

CREATE TABLE products (
  platform        TEXT    NOT NULL,                 -- “Amazon” or “AliExpress”
  product_id      TEXT    NOT NULL,                 -- ASIN or AliExpress itemId
  title           TEXT    NOT NULL,
  price           NUMERIC(12,2) NOT NULL,
  original_price  NUMERIC(12,2),
  currency        TEXT    NOT NULL,
  discount        TEXT,
  image_url       TEXT,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (platform, product_id)
);

CREATE INDEX idx_products_title ON products USING gin (to_tsvector('english', title));