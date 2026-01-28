from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db, engine
from database_models import Base, Message
from models import MessageCreate, MessageResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Messages Board")

# Update CORS to allow Netlify
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://*.netlify.app",  # Allow all Netlify apps
        "*",  # For development - remove in production and specify exact domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint for Render
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "Personal Messages Board API"}


# CREATE
@app.post("/messages", response_model=MessageResponse)
def create_message(payload: MessageCreate, db: Session = Depends(get_db)):
    new_message = Message(
        name=payload.name if payload.name and not payload.is_anonymous else "Anonymous",
        message=payload.message,
        emotion=payload.emotion,
        is_anonymous=payload.is_anonymous,
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message


# READ ALL
@app.get("/messages", response_model=List[MessageResponse])
def get_all_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).order_by(Message.created_at.desc()).all()
    return messages


# READ ONE
@app.get("/messages/{message_id}", response_model=MessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    return message


# UPDATE
@app.put("/messages/{message_id}", response_model=MessageResponse)
def update_message(
    message_id: int, payload: MessageCreate, db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.name = (
        payload.name if payload.name and not payload.is_anonymous else "Anonymous"
    )
    message.message = payload.message
    message.emotion = payload.emotion
    message.is_anonymous = payload.is_anonymous

    db.commit()
    db.refresh(message)

    return message


# DELETE
@app.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    db.delete(message)
    db.commit()

    return {"detail": "Message deleted successfully"}
