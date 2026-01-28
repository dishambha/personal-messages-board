# Personal Messages Board

A modern web application where people can write messages about you. Built with FastAPI backend and vanilla JavaScript frontend.

## Features

- 📝 Write messages with different emotions
- 🎭 Anonymous posting option
- 💬 Real-time message display
- 🎨 Beautiful gradient UI
- 📱 Fully responsive design

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python 3.x

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

## Setup Instructions

### Backend Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd fast_api_project
```

2. Create virtual environment
```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Mac/Linux
```

3. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Create `.env` file in backend folder
```
DATABASE_URL=your_postgresql_connection_string
```

5. Run the server
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to frontend folder
2. Open `index.html` in a browser or use a local server

## Environment Variables

Create a `.env` file in the `backend/` directory:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## API Endpoints

- `POST /messages` - Create a new message
- `GET /messages` - Get all messages
- `GET /messages/{id}` - Get a specific message
- `PUT /messages/{id}` - Update a message
- `DELETE /messages/{id}` - Delete a message

## Deployment

- **Backend**: Deployed on Render
- **Frontend**: Deployed on Netlify

## License

MIT