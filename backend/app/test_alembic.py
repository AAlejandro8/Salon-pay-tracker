import sqlite3
import os

# Use the correct database path
db_path = './db/salon.db'

# Check if the database exists
if not os.path.exists(db_path):
    print(f"Database not found at: {db_path}")
    print("Run 'alembic upgrade head' first to create the database.")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables in database:")
for table in tables:
    print(f"  • {table[0]}")

# Check alembic version specifically (only if table exists)
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='alembic_version';")
if cursor.fetchone():
    cursor.execute("SELECT * FROM alembic_version;")
    version = cursor.fetchall()
    print(f"\nCurrent Alembic version: {version[0][0] if version else 'None'}")
else:
    print("\nNo alembic_version table found - database not initialized with Alembic")

conn.close()