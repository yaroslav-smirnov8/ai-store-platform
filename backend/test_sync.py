import psycopg2

try:
    print("Testing sync connection with psycopg2...")
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=5432,
        database="postgres",
        user="postgres",
        password="upp7ufary"
    )
    print("Connection successful!")
    
    cur = conn.cursor()
    cur.execute("SELECT version()")
    version = cur.fetchone()[0]
    print(f"PostgreSQL version: {version}")
    
    cur.execute("SELECT datname FROM pg_database WHERE datistemplate = false")
    databases = cur.fetchall()
    print("Available databases:")
    for db in databases:
        print(f"  - {db[0]}")
    
    cur.close()
    conn.close()
    print("Connection closed successfully")
    
except Exception as e:
    print(f"Connection failed: {e}")
    import traceback
    traceback.print_exc()