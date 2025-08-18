from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

def get_database_url():
    """
    Get the AWS RDS database URL with fallback to local dev for development!
    """

    aws_db_url = os.getenv("AWS_DATABASE_URL")
    if aws_db_url:
        print("Using AWS RDS PostgreSQL!")
        return aws_db_url
    
    local_db_url = os.getenv("DATABASE_URL")
    if local_db_url:
        print("Using Local PostgreSQL")
        return local_db_url
    
    # final fallback
    print("Using SQLite")
    return 'sqlite:///./db/salon.db'


# Get DATABASE_URL from environment, fallback to SQLite
SQLALCHEMY_DATABASE_URL = get_database_url()

# Handle different database types
if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,        # Test connections before use
        pool_recycle=300,          # Recycle connections every 5 minutes  
        pool_size=5,               # Connection pool size
        max_overflow=10,           # Max additional connections
        echo=False                 # Set to True for debugging SQL queries
    )
    print('PostgreSQL engine created with connection pooling')
else:
    # SQLite for local development
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False},
        echo=False
    )
    print("SQLite engine created ")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection():
    """
    Test database connection
    """
    try:
        with engine.connect() as connection:
            print("Database connection successful!")
            # Get database info without exposing password 😊
            db_info = SQLALCHEMY_DATABASE_URL.split('@')[1] if '@' in SQLALCHEMY_DATABASE_URL else 'SQLite'
            print(f"Connected to: {db_info}")
            return True
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return False
    
# Test connection when module loads
if __name__ == "__main__":
    test_connection()