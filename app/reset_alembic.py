import sqlite3

conn = sqlite3.connect('salon.db')
cursor = conn.cursor()

# Get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables in database:")
for table in tables:
    print(f"  • {table[0]}")

# Check alembic version specifically
cursor.execute("SELECT * FROM alembic_version;")
version = cursor.fetchall()

print(f"\nCurrent Alembic version: {version[0][0] if version else 'None'}")

conn.close()