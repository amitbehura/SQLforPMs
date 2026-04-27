import { PGlite } from '@electric-sql/pglite';

export async function seedDatabase(db: PGlite) {
  // 1. Schema Creation
  const schema = `
    -- ==========================================
    -- DEPARTMENT 1: USER / CORE
    -- ==========================================
    CREATE TABLE pricing_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      monthly_fee DECIMAL(10, 2) NOT NULL,
      transaction_fee_percent DECIMAL(5, 2) NOT NULL
    );

    CREATE TABLE merchants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      country VARCHAR(2) NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      pricing_plan_id INTEGER REFERENCES pricing_plans(id)
    );

    CREATE TABLE merchant_users (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      email VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      last_login TIMESTAMP
    );

    CREATE TABLE features (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      description TEXT
    );

    CREATE TABLE merchant_features (
      merchant_id INTEGER REFERENCES merchants(id),
      feature_id INTEGER REFERENCES features(id),
      enabled_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (merchant_id, feature_id)
    );

    CREATE TABLE subscriptions (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      plan_id INTEGER REFERENCES pricing_plans(id),
      start_date DATE NOT NULL,
      end_date DATE,
      status VARCHAR(20) NOT NULL
    );

    -- ==========================================
    -- DEPARTMENT 2: SALES
    -- ==========================================
    CREATE TABLE sales_reps (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      region VARCHAR(50) NOT NULL
    );

    CREATE TABLE sales_leads (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      sales_rep_id INTEGER REFERENCES sales_reps(id),
      lead_score INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL
    );

    CREATE TABLE contracts (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      sales_rep_id INTEGER REFERENCES sales_reps(id),
      signed_date DATE NOT NULL,
      custom_rate DECIMAL(5, 2)
    );

    CREATE TABLE campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      budget DECIMAL(10, 2) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE
    );

    CREATE TABLE promotions (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id),
      discount_percent DECIMAL(5, 2) NOT NULL
    );

    CREATE TABLE coupon_codes (
      code VARCHAR(20) PRIMARY KEY,
      promotion_id INTEGER REFERENCES promotions(id),
      max_uses INTEGER NOT NULL,
      times_used INTEGER DEFAULT 0
    );

    -- ==========================================
    -- DEPARTMENT 3: FINANCE
    -- ==========================================
    CREATE TABLE bank_partners (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      uptime_sla DECIMAL(5, 2) NOT NULL
    );

    CREATE TABLE payments (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) NOT NULL,
      status VARCHAR(20) NOT NULL, -- success, failed, pending
      method VARCHAR(50) NOT NULL, -- card, upi, netbanking
      bank_partner_id INTEGER REFERENCES bank_partners(id),
      created_at TIMESTAMP NOT NULL
    );

    CREATE TABLE refunds (
      id SERIAL PRIMARY KEY,
      payment_id INTEGER REFERENCES payments(id),
      amount DECIMAL(10, 2) NOT NULL,
      reason VARCHAR(255),
      created_at TIMESTAMP NOT NULL
    );

    CREATE TABLE settlements (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      settled_at TIMESTAMP
    );

    CREATE TABLE taxes (
      id SERIAL PRIMARY KEY,
      payment_id INTEGER REFERENCES payments(id),
      tax_amount DECIMAL(10, 2) NOT NULL,
      tax_type VARCHAR(20) NOT NULL
    );

    CREATE TABLE invoices (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      month DATE NOT NULL,
      total_fees DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL
    );

    CREATE TABLE bank_accounts (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      account_number_last_4 VARCHAR(4) NOT NULL,
      routing_number VARCHAR(20) NOT NULL,
      is_primary BOOLEAN DEFAULT true
    );

    -- ==========================================
    -- DEPARTMENT 4: OPS & RISK
    -- ==========================================
    CREATE TABLE support_tickets (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      category VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      resolved_at TIMESTAMP
    );

    CREATE TABLE risk_flags (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      flag_reason VARCHAR(255) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      created_at TIMESTAMP NOT NULL
    );

    CREATE TABLE chargebacks (
      id SERIAL PRIMARY KEY,
      payment_id INTEGER REFERENCES payments(id),
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      filed_at TIMESTAMP NOT NULL
    );

    CREATE TABLE kyc_documents (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      document_type VARCHAR(50) NOT NULL,
      verification_status VARCHAR(20) NOT NULL,
      uploaded_at TIMESTAMP NOT NULL
    );

    CREATE TABLE fraud_rules (
      id SERIAL PRIMARY KEY,
      rule_name VARCHAR(100) NOT NULL,
      score_weight INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE disputes (
      id SERIAL PRIMARY KEY,
      chargeback_id INTEGER REFERENCES chargebacks(id),
      evidence_submitted BOOLEAN DEFAULT false,
      win_status VARCHAR(20)
    );

    -- ==========================================
    -- DEPARTMENT 5: TECH
    -- ==========================================
    CREATE TABLE deployments (
      id SERIAL PRIMARY KEY,
      version VARCHAR(20) NOT NULL,
      deployed_at TIMESTAMP NOT NULL,
      status VARCHAR(20) NOT NULL
    );

    CREATE TABLE api_requests_log (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      endpoint VARCHAR(255) NOT NULL,
      status_code INTEGER NOT NULL,
      response_time_ms INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL
    );

    CREATE TABLE webhooks (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      url VARCHAR(255) NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE api_keys (
      id SERIAL PRIMARY KEY,
      merchant_id INTEGER REFERENCES merchants(id),
      key_prefix VARCHAR(10) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      last_used_at TIMESTAMP
    );

    CREATE TABLE server_logs (
      id SERIAL PRIMARY KEY,
      server_ip VARCHAR(20) NOT NULL,
      cpu_usage_percent INTEGER NOT NULL,
      memory_usage_mb INTEGER NOT NULL,
      logged_at TIMESTAMP NOT NULL
    );

    CREATE TABLE feature_flags (
      flag_name VARCHAR(50) PRIMARY KEY,
      rollout_percentage INTEGER NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `;

  await db.exec(schema);

  // 2. Base Data Insertion
  await db.exec(`
    INSERT INTO pricing_plans (name, monthly_fee, transaction_fee_percent) VALUES
    ('Free', 0.00, 2.00),
    ('Pro', 49.00, 1.50),
    ('Enterprise', 499.00, 0.90);

    INSERT INTO bank_partners (name, uptime_sla) VALUES
    ('HDFC Bank', 99.9),
    ('ICICI Bank', 99.8),
    ('SBI', 98.5),
    ('Axis Bank', 99.5);

    INSERT INTO sales_reps (name, region) VALUES
    ('Jim Halpert', 'North America'),
    ('Dwight Schrute', 'North America'),
    ('Vikram', 'APAC'),
    ('Mia', 'Europe');

    INSERT INTO deployments (version, deployed_at, status) VALUES
    ('v1.0.0', NOW() - INTERVAL '30 days', 'success'),
    ('v1.1.0', NOW() - INTERVAL '15 days', 'success'),
    ('v1.1.1', NOW() - INTERVAL '2 days', 'rollback'),
    ('v1.1.2', NOW() - INTERVAL '1 day', 'success');
  `);

  // 3. Dynamic Data Generation (Batched for Performance)
  let batchSql = '';

  // Generate 100 Merchants
  for (let i = 1; i <= 100; i++) {
    const planId = Math.random() > 0.8 ? 3 : (Math.random() > 0.4 ? 2 : 1);
    const country = Math.random() > 0.5 ? 'IN' : 'US';
    const status = Math.random() > 0.9 ? 'suspended' : 'active';
    batchSql += `
      INSERT INTO merchants (name, created_at, country, status, pricing_plan_id)
      VALUES ('Merchant ${i} Corp', NOW() - INTERVAL '${Math.floor(Math.random() * 300)} days', '${country}', '${status}', ${planId});
    `;
  }

  // Generate Payments (Approx 1000)
  for (let i = 1; i <= 1000; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const amount = (Math.random() * 5000).toFixed(2);
    const status = Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'failed' : 'pending');
    const bankPartnerId = Math.floor(Math.random() * 4) + 1;
    batchSql += `
      INSERT INTO payments (merchant_id, amount, currency, status, method, bank_partner_id, created_at)
      VALUES (${merchantId}, ${amount}, 'USD', '${status}', 'card', ${bankPartnerId}, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days');
    `;
    
    // Explicitly duplicate 5% of payments to test self-joins
    if (Math.random() > 0.95) {
      batchSql += `
        INSERT INTO payments (merchant_id, amount, currency, status, method, bank_partner_id, created_at)
        VALUES (${merchantId}, ${amount}, 'USD', '${status}', 'card', ${bankPartnerId}, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days');
      `;
    }
  }

  // Generate Support Tickets
  for (let i = 1; i <= 150; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const randCat = Math.random();
    const category = randCat > 0.7 ? 'Delayed Settlement' : (randCat > 0.4 ? 'API Integration' : 'Fraud Alert');
    const status = Math.random() > 0.8 ? 'closed' : 'open';
    const daysAgo = Math.floor(Math.random() * 30);
    
    batchSql += `
      INSERT INTO support_tickets (merchant_id, category, status, created_at)
      VALUES (${merchantId}, '${category}', '${status}', NOW() - INTERVAL '${daysAgo} days');
    `;
  }

  // Generate API Logs (Errors associated with recent rollback deployment)
  for (let i = 1; i <= 500; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const isRecentError = Math.random() > 0.8;
    const statusCode = isRecentError ? 500 : 200;
    const responseTime = isRecentError ? 1200 : Math.floor(Math.random() * 100) + 20;
    const daysAgo = isRecentError ? 2 : Math.floor(Math.random() * 10);
    
    batchSql += `
      INSERT INTO api_requests_log (merchant_id, endpoint, status_code, response_time_ms, created_at)
      VALUES (${merchantId}, '/v1/charges', ${statusCode}, ${responseTime}, NOW() - INTERVAL '${daysAgo} days');
    `;
  }

  // Generate Merchant Users (0-3 per merchant)
  for (let i = 1; i <= 100; i++) {
    const numUsers = Math.floor(Math.random() * 4); // 0 to 3 users
    for (let u = 0; u < numUsers; u++) {
      const role = u === 0 ? 'admin' : (Math.random() > 0.5 ? 'developer' : 'finance');
      batchSql += `
        INSERT INTO merchant_users (merchant_id, email, role, last_login)
        VALUES (${i}, 'user${u}@merchant${i}.com', '${role}', NOW() - INTERVAL '${Math.floor(Math.random() * 10)} days');
      `;
    }
  }

  // Generate Contracts
  for (let i = 1; i <= 30; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const repId = Math.floor(Math.random() * 4) + 1;
    batchSql += `
      INSERT INTO contracts (merchant_id, sales_rep_id, signed_date, custom_rate)
      VALUES (${merchantId}, ${repId}, NOW() - INTERVAL '${Math.floor(Math.random() * 100)} days', 1.20);
    `;
  }

  // Generate Refunds
  for (let i = 1; i <= 50; i++) {
    const paymentId = Math.floor(Math.random() * 1000) + 1;
    batchSql += `
      INSERT INTO refunds (payment_id, amount, reason, created_at)
      VALUES (${paymentId}, ${(Math.random() * 100).toFixed(2)}, 'Customer Request', NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days');
    `;
  }

  // Generate Invoices
  for (let i = 1; i <= 120; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const status = Math.random() > 0.7 ? 'paid' : (Math.random() > 0.5 ? 'unpaid' : 'overdue');
    batchSql += `
      INSERT INTO invoices (merchant_id, month, total_fees, status)
      VALUES (${merchantId}, NOW() - INTERVAL '${Math.floor(Math.random() * 90)} days', ${(Math.random() * 1000).toFixed(2)}, '${status}');
    `;
  }

  // Generate Bank Accounts
  for (let i = 1; i <= 80; i++) {
    const merchantId = Math.floor(Math.random() * 100) + 1;
    const routingPrefix = Math.random() > 0.5 ? 'ROUTING' : 'BANKING';
    batchSql += `
      INSERT INTO bank_accounts (merchant_id, account_number_last_4, routing_number, is_primary)
      VALUES (${merchantId}, '${Math.floor(Math.random() * 9000) + 1000}', '${routingPrefix}${Math.floor(Math.random() * 90000)}', true);
    `;
  }

  // Generate Campaigns
  for (let i = 1; i <= 10; i++) {
    batchSql += `
      INSERT INTO campaigns (name, budget, start_date, end_date)
      VALUES ('Campaign 202${Math.floor(Math.random() * 4)} - ${i}', ${(Math.random() * 50000).toFixed(2)}, NOW() - INTERVAL '${Math.floor(Math.random() * 100)} days', NOW() + INTERVAL '${Math.floor(Math.random() * 30)} days');
    `;
  }

  // Generate Sales Leads
  for (let i = 1; i <= 100; i++) {
    const repId = Math.floor(Math.random() * 4) + 1;
    const score = Math.floor(Math.random() * 100);
    const status = score > 80 ? 'hot' : 'cold';
    batchSql += `
      INSERT INTO sales_leads (company_name, status, sales_rep_id, lead_score, created_at)
      VALUES ('Tech Startup ${i}', '${status}', ${repId}, ${score}, NOW() - INTERVAL '${Math.floor(Math.random() * 60)} days');
    `;
  }

  await db.exec(batchSql);
}
