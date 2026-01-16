# 🛍️ AI Store - Telegram MiniApp Online Store

Production-ready MVP for selling digital products (courses, intensives, community subscriptions) with secure payment processing integration.

## Quick Start

### Windows

1. **Setup Environment**:
   ```cmd
   scripts\setup.bat
   ```

2. **Configure Credentials**:
   - Edit `backend\.env` with your payment provider and Telegram credentials
   - Edit `frontend\.env` with your configuration

3. **Start Development**:
   
   **Option A: Docker (Recommended)**
   ```cmd
   scripts\start.bat
   ```

   **Option B: Local Development with Tuna.am Tunnels**
   ```cmd
   scripts\dev.bat
   ```

4. **Seed Sample Data**:
   ```cmd
   scripts\seed.bat
   ```

### Linux/macOS

1. **Setup Environment**:
   ```bash
   ./scripts/setup.sh
   ```

2. **Configure Credentials**:
   - Edit `backend/.env` with your payment provider and Telegram credentials
   - Edit `frontend/.env` with your configuration

3. **Start Development**:
   ```bash
   ./scripts/start.sh
   ```

4. **Seed Sample Data**:
   ```bash
   ./scripts/seed.sh
   ```

**Access Points:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📊 **Admin Panel**: http://localhost:3000/admin/login
- 📚 **API Docs**: http://localhost:8000/docs

## Database Setup

This project uses PostgreSQL as the default database.

### Using Docker

The easiest way to set up the database is using Docker Compose:

```bash
docker-compose up postgres
```

This will start a PostgreSQL server with the following configuration:
- Host: localhost
- Port: 5432
- Database: ai_store
- Username: postgres
- Password: postgres

### Manual Setup

If you prefer to set up PostgreSQL manually:

1. Install PostgreSQL on your system
2. Create a database named `ai_store`
3. Update the database URL in your `.env` file:
   ```
   DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/ai_store
   ```
4. Initialize the database schema:
   ```bash
   python backend/init_db.py
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_store
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key-change-in-production
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Testing Database Connection

To test the database connection:

```bash
python backend/test_db.py
```

## 📁 Project Structure

```
ai_store/
├── backend/                 # FastAPI Backend
│   ├── alembic/            # Database migrations
│   ├── routers/            # API endpoints
│   ├── services/           # Business logic
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database operations
│   ├── auth.py             # Authentication
│   ├── main.py             # FastAPI app
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities
│   │   └── App.js          # Main app
│   ├── public/             # Static files
│   └── package.json        # Node dependencies
├── database/               # Database schema
│   └── schema.sql         # PostgreSQL schema
├── nginx/                  # Nginx configuration
├── scripts/                # Deployment scripts
├── docker-compose.yml      # Development setup
└── docker-compose.prod.yml # Production setup
```

## 🚀 Features

### 💳 Payment System
- **Unified Payment Adapter**: Support for Stripe, Square, and more
- **Installment Payments**: Flexible payment plans
- **Webhook Support**: Real-time payment notifications
- **Refund System**: Admin refund capabilities

### 📱 Telegram Integration
- **MiniApp Support**: Native Telegram WebApp
- **Admin Notifications**: Real-time order alerts
- **User Authentication**: Telegram WebApp data verification
- **Deep Linking**: Seamless navigation

### 🛍️ Product Management
- **Digital Products**: Courses, intensives, subscriptions
- **Admin Panel**: Full CRUD operations
- **Analytics**: Sales and click tracking
- **SEO Friendly**: Optimized product pages

### 🔐 Security & Auth
- **JWT Authentication**: Secure admin access
- **Rate Limiting**: DDoS protection
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Secure cross-origin requests

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Async ORM
- **Alembic**: Database migrations
- **Celery**: Background tasks
- **Redis**: Caching and task queue

### Frontend
- **React**: Modern UI library
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Telegram WebApp SDK**: Native integration

### Infrastructure
- **Docker**: Containerization
- **Nginx**: Reverse proxy and load balancer
- **Docker Compose**: Multi-container orchestration

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_store

# Payment Provider (Stripe, Square, etc.)
PAYMENT_PROVIDER=stripe
PAYMENT_API_KEY=your_api_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id

# Security
SECRET_KEY=your_jwt_secret_key
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_TELEGRAM_BOT_NAME=@your_bot
```

## 🚀 Deployment

### Development
```bash
./scripts/start.sh    # or scripts\start.bat on Windows
```

### Production
```bash
./scripts/deploy.sh   # or scripts\deploy.bat on Windows
```

### Docker Commands
```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📊 Analytics & Monitoring

- **Click Tracking**: Monitor user interactions
- **Sales Analytics**: Revenue and conversion metrics
- **Admin Dashboard**: Real-time statistics
- **Payment Monitoring**: Transaction status tracking

## 🔔 Notifications

- **Order Notifications**: New order alerts to admin
- **Payment Updates**: Success/failure notifications
- **Installment Reminders**: Automated payment reminders
- **System Alerts**: Error and status notifications

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Telegram Theming**: Native Telegram colors
- **Haptic Feedback**: Enhanced user experience
- **Loading States**: Smooth user interactions
- **Error Handling**: User-friendly error messages

##  License

MIT License - see LICENSE file for details.
