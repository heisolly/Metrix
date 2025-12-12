# 🎮 Metrix - Gaming Tournament Platform

A comprehensive gaming tournament platform with live streaming, marketplace, and advanced payment systems.

## ✨ Features

### 🏆 Tournament Management

- Create and manage tournaments
- Bracket system with automatic generation
- Multiple tournament formats (Single/Double Elimination, Battle Royale, Round Robin)
- Entry fee management
- Participant registration
- Manual verification system

### 💳 Payment System

- **AlatPay Integration** - Automated payment gateway
- **Manual Payment System** - Bank transfer with admin verification
- Flexible payment configuration
- Pending payment verification
- Payment proof upload and review

### 🛒 Account Marketplace

- Buy and sell gaming accounts
- Secure transaction system
- Account verification
- Rating and review system
- Purchase history

### 📺 Live Streaming

- Admin-managed live streams
- Real-time chat system
- Stream scheduling
- Viewer engagement

### 👥 User Management

- User profiles with avatars
- Referral system
- Role-based access control (Admin/User)
- Authentication with Supabase

### 🏠 Dynamic Homepage

- Editable tournament sections
- Featured matches
- Countdown timers
- Responsive design

### 📊 Admin Dashboard

- Comprehensive admin panel
- User management
- Tournament oversight
- Payment verification
- Marketplace moderation
- Live stream control
- Analytics and reporting

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend

- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage

### Payment Integration

- **AlatPay** - Nigerian payment gateway
- Manual bank transfer system

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/heisolly/Metrix.git
cd Metrix/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AlatPay
NEXT_PUBLIC_ALATPAY_PUBLIC_KEY=your_alatpay_public_key
NEXT_PUBLIC_ALATPAY_SECRET_KEY=your_alatpay_secret_key
NEXT_PUBLIC_ALATPAY_BUSINESS_ID=your_alatpay_business_id
```

4. **Run database migrations**

In Supabase SQL Editor, run these migrations in order:

```sql
-- Core tables
migrations/create_referral_system.sql
migrations/create_live_streaming_system.sql
migrations/create_account_marketplace.sql
migrations/create_homepage_cms.sql
migrations/create_manual_payment_system.sql
migrations/ensure_unique_match_ids.sql
```

5. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📚 Documentation

### Admin Guides

- [Admin Navigation](ADMIN_NAVIGATION.md) - Complete admin panel guide
- [Homepage CMS](HOMEPAGE_CMS_GUIDE.md) - Managing homepage content
- [Manual Payment System](MANUAL_PAYMENT_SYSTEM.md) - Payment configuration
- [AlatPay Integration](ALATPAY_INTEGRATION.md) - Payment gateway setup
- [Live Streaming](LIVE_STREAMING_ADMIN_GUIDE.md) - Stream management
- [Marketplace](ACCOUNT_MARKETPLACE_GUIDE.md) - Account marketplace

### Setup Guides

- [Google Sign-In](GOOGLE_SIGNIN_SETUP.md) - OAuth configuration
- [Payment Issue Resolution](PAYMENT_ISSUE_RESOLUTION.md) - Troubleshooting
- [Referral System](REFERRAL_SYSTEM_WORKING.md) - Referral setup

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── homepage/      # Homepage management
│   │   │   ├── tournaments/   # Tournament management
│   │   │   ├── payments/      # Payment settings
│   │   │   ├── marketplace/   # Marketplace admin
│   │   │   └── live/          # Live streaming
│   │   ├── dashboard/         # User dashboard
│   │   ├── tournaments/       # Tournament pages
│   │   ├── marketplace/       # Marketplace pages
│   │   ├── signin/            # Sign in page
│   │   └── signup/            # Sign up page
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Authentication
│   │   ├── database.ts       # Database queries
│   │   ├── supabase.ts       # Supabase client
│   │   └── alatpay.ts        # Payment config
│   └── styles/               # Global styles
├── migrations/               # Database migrations
├── public/                   # Static assets
└── package.json             # Dependencies
```

## 🔑 Key Features

### For Users

- ✅ Register and create profile
- ✅ Join tournaments with payment
- ✅ View live streams
- ✅ Buy/sell gaming accounts
- ✅ Refer friends for rewards
- ✅ Track tournament progress

### For Admins

- ✅ Create and manage tournaments
- ✅ Configure payment methods
- ✅ Verify manual payments
- ✅ Manage live streams
- ✅ Moderate marketplace
- ✅ Edit homepage content
- ✅ View analytics

## 🔒 Security

- Row Level Security (RLS) on all tables
- Admin-only access controls
- Secure payment processing
- OAuth integration
- Environment variable protection

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ALATPAY_PUBLIC_KEY`
- `NEXT_PUBLIC_ALATPAY_SECRET_KEY`
- `NEXT_PUBLIC_ALATPAY_BUSINESS_ID`

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributors

- **heisolly** - Project Creator

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@metrix.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] More payment gateways
- [ ] Advanced analytics
- [ ] Tournament brackets visualization
- [ ] Live score updates
- [ ] Social features
- [ ] Discord integration

---

**Built with ❤️ by the Metrix Team**
