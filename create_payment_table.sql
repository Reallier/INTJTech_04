CREATE TABLE IF NOT EXISTS payment_orders (
  id VARCHAR(30) PRIMARY KEY,
  order_id VARCHAR(64) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  token_quantity INT NOT NULL,
  trade_no VARCHAR(64),
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
