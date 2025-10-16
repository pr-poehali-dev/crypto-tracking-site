import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin panel operations for user and crypto management
    Args: event with httpMethod, body, headers with X-User-Id
    Returns: HTTP response with admin operation results
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
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT is_admin FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        if not user or not user[0]:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            cur.execute(
                "SELECT id, username, is_blocked, created_at FROM users WHERE is_admin = FALSE ORDER BY created_at DESC"
            )
            users = cur.fetchall()
            
            result = [
                {
                    'id': u[0],
                    'username': u[1],
                    'is_blocked': u[2],
                    'created_at': u[3].isoformat() if u[3] else None
                }
                for u in users
            ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            target_user_id = body_data.get('user_id')
            
            if action == 'block':
                cur.execute("UPDATE users SET is_blocked = TRUE WHERE id = %s", (target_user_id,))
            elif action == 'unblock':
                cur.execute("UPDATE users SET is_blocked = FALSE WHERE id = %s", (target_user_id,))
            elif action == 'add_balance':
                crypto_id = body_data.get('crypto_id')
                amount = body_data.get('amount')
                
                cur.execute(
                    """
                    INSERT INTO user_balances (user_id, crypto_id, balance)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (user_id, crypto_id)
                    DO UPDATE SET balance = user_balances.balance + EXCLUDED.balance
                    """,
                    (target_user_id, crypto_id, amount)
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Action completed'}),
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
