# Fitness Zone Backend

Django + PostgreSQL REST API backend for the Fitness Zone project.

## Tech Stack

- **Framework**: Django 6.1
- **Database**: PostgreSQL
- **API**: Django REST Framework
- **CORS**: django-cors-headers
- **Env Management**: python-decouple

## Project Structure

```
backend/
├── core/               # Django project config (settings, urls, wsgi)
├── venv/               # Virtual environment (do not commit)
├── manage.py
├── requirements.txt
└── .env                # Environment variables (do not commit)
```

## Setup

### 1. Activate virtual environment

```bash
# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Edit `.env` with your PostgreSQL credentials:

```env
DB_NAME=fitness_zone_db
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Create the PostgreSQL database

```sql
CREATE DATABASE fitness_zone_db;
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

Server runs at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin**
