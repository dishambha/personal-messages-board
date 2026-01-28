from database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
db.execute(text("UPDATE messages SET updated_at = created_at WHERE updated_at IS NULL"))
db.commit()
print("✓ Database fixed!")
db.close()