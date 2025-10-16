import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Cryptocurrency data management and market prices
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with crypto data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute(
                "SELECT id, name, symbol, price_usd, price_stars, total_supply FROM cryptocurrencies ORDER BY id"
            )
            cryptos = cur.fetchall()
            
            result = [
                {
                    'id': crypto[0],
                    'name': crypto[1],
                    'symbol': crypto[2],
                    'price_usd': float(crypto[3]),
                    'price_stars': float(crypto[4]),
                    'total_supply': float(crypto[5])
                }
                for crypto in cryptos
            ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            symbol = body_data.get('symbol')
            price_usd = body_data.get('price_usd', 0)
            price_stars = body_data.get('price_stars', 0)
            total_supply = body_data.get('total_supply', 0)
            
            cur.execute(
                "INSERT INTO cryptocurrencies (name, symbol, price_usd, price_stars, total_supply) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (name, symbol, price_usd, price_stars, total_supply)
            )
            crypto_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': crypto_id, 'message': 'Cryptocurrency created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            crypto_id = body_data.get('id')
            price_usd = body_data.get('price_usd')
            price_stars = body_data.get('price_stars')
            
            cur.execute(
                "UPDATE cryptocurrencies SET price_usd = %s, price_stars = %s WHERE id = %s",
                (price_usd, price_stars, crypto_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Price updated'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
