INSERT INTO cryptocurrencies (name, symbol, price_usd, price_stars, total_supply) 
VALUES 
    ('Solana', 'SOL', 145.32, 2.50, 580000000),
    ('Cardano', 'ADA', 0.47, 0.008, 45000000000),
    ('Ripple', 'XRP', 0.52, 0.009, 100000000000),
    ('Polkadot', 'DOT', 7.23, 0.12, 1400000000),
    ('Avalanche', 'AVAX', 35.80, 0.60, 450000000),
    ('Chainlink', 'LINK', 14.56, 0.25, 1000000000),
    ('Polygon', 'MATIC', 0.87, 0.015, 10000000000),
    ('Litecoin', 'LTC', 68.42, 1.15, 84000000),
    ('Uniswap', 'UNI', 8.90, 0.15, 1000000000),
    ('Stellar', 'XLM', 0.12, 0.002, 50000000000),
    ('Cosmos', 'ATOM', 9.45, 0.16, 390000000),
    ('Monero', 'XMR', 155.67, 2.60, 18400000),
    ('Toncoin', 'TON', 5.32, 0.09, 5000000000),
    ('Tron', 'TRX', 0.16, 0.003, 86000000000),
    ('Shiba Inu', 'SHIB', 0.000024, 0.0000004, 589000000000000),
    ('Dogecoin', 'DOGE', 0.14, 0.0024, 146000000000),
    ('BNB', 'BNB', 315.50, 5.30, 166000000),
    ('Near Protocol', 'NEAR', 5.67, 0.095, 1200000000),
    ('Aptos', 'APT', 8.92, 0.15, 1100000000),
    ('Arbitrum', 'ARB', 0.76, 0.013, 10000000000)
ON CONFLICT DO NOTHING;