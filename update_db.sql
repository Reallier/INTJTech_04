-- 创建退款申请表
CREATE TABLE IF NOT EXISTS refund_requests (
  id VARCHAR(30) PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  trade_no VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);

-- 删除 payment_orders 的 token_quantity 列（如果存在）
ALTER TABLE payment_orders DROP COLUMN IF EXISTS token_quantity;
