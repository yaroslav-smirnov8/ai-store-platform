# AI Store Frontend - Telegram MiniApp

Complete React frontend for the AI Store Telegram MiniApp with all 7 required pages and full payment integration.

## 🚀 Features

### Pages
- **Home** - Welcome page with expert introduction and quick actions
- **Courses** - Product catalog with payment integration
- **Community** - Community subscription page with external bot link
- **Bot** - Lesson generator bot description and access
- **Free Lessons** - Sample lessons to showcase teaching quality
- **Contact** - Contact information and FAQ
- **Admin** - Admin dashboard for managing the store
- **Payment Success** - Payment confirmation and status page

### Components
- **Navigation** - Bottom navigation bar for mobile
- **ProductCard** - Reusable product display with buy buttons
- **LoadingSpinner** - Loading states
- **ErrorBoundary** - Error handling

### Integrations
- **Telegram WebApp SDK** - Full MiniApp functionality
- **YooKassa Payments** - Complete payment flow
- **Analytics Tracking** - User behavior tracking
- **Responsive Design** - Mobile-first with Tailwind CSS

## 🛠 Setup

### Prerequisites
- Node.js 16+
- Your backend API running at `https://aistore-dev-api.ru.tuna.am/api`

### Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
REACT_APP_API_URL=https://aistore-dev-api.ru.tuna.am/api
REACT_APP_TELEGRAM_BOT_NAME=@your_bot_name
REACT_APP_COMMUNITY_LINK=https://t.me/your_community
REACT_APP_BOT_LINK=https://t.me/your_lesson_bot
REACT_APP_ENVIRONMENT=development
```

3. **Start development server:**
```bash
npm start
```

## 📱 Telegram MiniApp Setup

### 1. Create Telegram Bot
1. Message @BotFather on Telegram
2. Create new bot with `/newbot`
3. Get your bot token
4. Set up WebApp with `/newapp`

### 2. Configure WebApp
```
Name: AI Store
Description: Digital products marketplace
Photo: Upload your logo
Web App URL: https://aistore-dev.ru.tuna.am
```

### 3. Test in Telegram
- Open your bot in Telegram
- Use the WebApp button to launch your store

## 🎨 Customization

### Update Bot Links
Edit these files to point to your actual bots:
- `src/pages/CommunityPage.js` - Line 25 (community bot link)
- `src/pages/BotPage.js` - Line 25 (lesson generator bot link)

### Update Contact Info
Edit `src/pages/ContactPage.js`:
- Line 25: Your Telegram username
- Line 40: Your email address

### Styling
- All styles use Tailwind CSS
- Telegram theme variables are supported
- Mobile-first responsive design

## 🔄 Payment Flow

1. **User selects product** → `CoursesPage.js`
2. **Creates order** → Backend API `/api/orders`
3. **Initiates payment** → Backend API `/api/payments/create`
4. **Redirects to YooKassa** → External payment form
5. **Returns to success page** → `PaymentSuccessPage.js`
6. **Webhook processes payment** → Backend handles completion

## 📊 Analytics

All user interactions are tracked:
- Page views
- Button clicks
- Purchase attempts
- External link clicks

Data is sent to `/api/analytics/click` endpoint.

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests

### Project Structure
```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── utils/              # Utilities (API, Telegram)
├── App.js              # Main app with routing
└── index.js            # Entry point
```

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Deploy to your hosting:
- Upload `build/` folder contents
- Configure your web server
- Update Telegram WebApp URL

## 🔒 Security

- All API calls include Telegram WebApp authentication
- Admin routes require proper authentication
- Error boundaries prevent crashes
- Input validation on all forms

## 📞 Support

If you need help:
1. Check the console for errors
2. Verify your `.env` configuration
3. Ensure backend API is running
4. Test Telegram WebApp integration

## 🎯 Next Steps

Your MVP is complete! Consider adding:
- Push notifications
- Offline support
- Advanced analytics
- A/B testing
- More payment methods
