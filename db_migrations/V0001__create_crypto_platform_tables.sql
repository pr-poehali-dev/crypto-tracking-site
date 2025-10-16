-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cryptocurrencies table
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    price_usd DECIMAL(20, 8) DEFAULT 0,
    price_stars DECIMAL(20, 8) DEFAULT 0,
    total_supply DECIMAL(30, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User balances table
CREATE TABLE IF NOT EXISTS user_balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    crypto_id INTEGER REFERENCES cryptocurrencies(id),
    balance DECIMAL(30, 8) DEFAULT 0,
    UNIQUE(user_id, crypto_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    crypto_id INTEGER REFERENCES cryptocurrencies(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(30, 8) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (username, password, is_admin) 
VALUES ('ohsxnta', '77850084', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert sample cryptocurrencies
INSERT INTO cryptocurrencies (name, symbol, price_usd, price_stars, total_supply) 
VALUES 
    ('Bitcoin', 'BTC', 64250.50, 1000.00, 21000000),
    ('Ethereum', 'ETH', 3125.75, 50.00, 120000000),
    ('Custom Coin', 'CUSTOM', 1.50, 0.10, 1000000000)
ON CONFLICT DO NOTHING;