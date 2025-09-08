# WanderLink Hub

A production-ready MVP for discovering family-friendly events and hubs around the world. Built as a mobile-first Progressive Web App (PWA) with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Interactive Map**: Explore listings with clustered pins using Mapbox GL JS
- **Calendar View**: Browse events chronologically with FullCalendar integration
- **Smart Filtering**: Filter by type, date, verification status, and location
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Review System**: Rate and review listings (one per user per listing)
- **Admin Panel**: Verify/reject submitted listings
- **PWA Ready**: Installable web app with offline capabilities
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Maps**: Mapbox GL JS with clustering
- **Calendar**: FullCalendar React
- **Validation**: Zod schemas
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Mapbox account and access token

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd wanderlink-hub
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp env.example .env.local
```

Fill in your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# App Configuration
NEXT_PUBLIC_APP_NAME=WanderLink Hub
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-schema.sql` to create all tables and policies

### 4. Seed the Database

```bash
npm run seed
```

This will create sample listings and reviews for testing.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses three main tables:

- **`profiles`**: User profiles with family information
- **`listings`**: Events and hubs with location data
- **`reviews`**: User reviews with ratings and comments

All tables have Row Level Security (RLS) enabled with appropriate policies for data access control.

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Ready**: Service worker for basic offline functionality
- **App-like Experience**: Full-screen mode and mobile-optimized UI
- **Responsive Design**: Works seamlessly across all device sizes

## 🔐 Authentication & Authorization

- **User Registration**: Email/password signup with profile creation
- **Secure Login**: Supabase Auth with session management
- **Admin Access**: Role-based access control for listing verification
- **Data Protection**: RLS policies ensure users only access appropriate data

## 🗺️ Map Integration

- **Interactive Pins**: Clickable markers for each listing
- **Clustering**: Efficient display of multiple nearby listings
- **Location Search**: Coordinate input for precise positioning
- **Responsive Design**: Optimized for mobile and desktop

## 📅 Calendar Features

- **Event Display**: Shows all verified events chronologically
- **Multiple Views**: Month and week views available
- **Interactive**: Click events to view full details
- **Filtering**: Only shows verified events

## 🎯 API Endpoints

- `GET /api/listings` - Fetch listings with filters
- `POST /api/listings` - Create new listing (requires auth)
- `GET /api/listings/[id]` - Get specific listing details
- `PATCH /api/listings/[id]` - Update listing (owner only)
- `POST /api/admin/verify` - Admin verification (admin only)
- `GET /api/reviews` - Fetch reviews for a listing
- `POST /api/reviews` - Submit/update review (requires auth)

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Explore Page**: Map loads with clustered pins
- [ ] **Filters**: Type, date, and verification filters work
- [ ] **Calendar**: Events display correctly
- [ ] **Submit Form**: Can create new listings
- [ ] **Authentication**: Sign up, sign in, sign out
- **Admin Panel**: Can verify/reject listings (admin only)
- **Reviews**: Can submit and view reviews
- **PWA**: Installable on mobile devices

### Test URLs

- `/explore` - Main map and listing view
- `/calendar` - Events calendar
- `/submit` - Submit new listing
- `/admin` - Admin verification panel
- `/profile` - User profile and auth
- `/listing/[id]` - Individual listing details

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

### Project Structure

```
wanderlink-hub/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   │   ├── explore/       # Map and listing view
│   │   ├── calendar/      # Calendar view
│   │   ├── submit/        # Submit form
│   │   ├── admin/         # Admin panel
│   │   ├── profile/       # User profile
│   │   └── listing/[id]/  # Listing details
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/             # React components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── styles/                 # Global styles
```

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**: Check Mapbox token in environment variables
2. **Database errors**: Ensure Supabase schema is properly set up
3. **Authentication issues**: Verify Supabase Auth is enabled
4. **Build errors**: Check TypeScript types and dependencies

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and check browser console for detailed error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Mapbox for mapping services
- FullCalendar for calendar functionality
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

For support and questions:

1. Check the troubleshooting section above
2. Review Supabase and Mapbox documentation
3. Open an issue in the GitHub repository

---

**Happy exploring! 🌍✨**

##  Issues Found

### 1. **API Error (500)** - Supabase Connection Issue
The `/api/listings` endpoint is failing, which means Supabase isn't properly connected.

### 2. **Mapbox Token Missing** - Using Placeholder
The map is trying to use `your_mapbox_token_here` instead of a real token.

## 🔧 Let's Fix These Issues

### Step 1: Fix Supabase Connection

**Check your `.env.local` file:**
```bash
cat .env.local
```

**Make sure it contains your real Supabase credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://wtjvfhdbrvtliyqihktw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0anZmaGRicnZ0bGl5cWloa3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjExNDM2LCJleHAiOjIwNzE0MzcxNDM2fQ.1GlGoQt6Zs0rqcti1I-9DUpdE_bFsDVUlS6ZJmqARvU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0anZmaGRicnZ0bGl5cWloa3R3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg2MTE0MzYsImV4cCI6MjA3MTQzNzE0M30.k3LgQedNHLDDpsRm6-Qc839Wt5_xvRuNbs-_WiAvUow
```

### Step 2: Check Supabase Database Schema

**Go to your Supabase dashboard:**
1. Visit: [https://supabase.com/dashboard/project/wtjvfhdbrvtliyqihktw](https://supabase.com/dashboard/project/wtjvfhdbrvtliyqihktw)
2. **Go to "Table Editor"**
3. **Check if these tables exist:**
   - `profiles`
   - `listings` 
   - `reviews`

**If tables don't exist, run the schema:**
1. Go to "SQL Editor"
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run"

### Step 3: Test Supabase Connection

**Restart your development server:**
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**Test the API endpoint:**
1. Go to `/explore` page
2. Check browser console for the `/api/listings` error
3. If it's still 500, check Supabase dashboard for errors

### Step 4: Get Mapbox Token (Optional for now)

**For now, let's focus on fixing Supabase first.** The map will work without Mapbox token, but you'll need one later.

## 🎯 Debug Steps

### Check Supabase Dashboard:
1. **Go to "Logs"** in your Supabase dashboard
2. **Look for any error messages**
3. **Check "Table Editor"** to see if tables exist

### Check Your Environment:
```bash
# Make sure .env.local exists and has correct values
ls -la .env.local
cat .env.local
```

## ❓ Questions for You

1. **Does your `.env.local` file exist and contain the real Supabase credentials?**
2. **Have you run the database schema in Supabase SQL Editor?**
3. **What do you see in Supabase "Table Editor" - are there any tables?**

**Let me know what you find and we'll get Supabase working first!**

## 🎯 Add Mapbox Token

### Step 1: Create/Update `.env.local`

You need to create a `.env.local` file in your `wanderlink-hub` directory with your Mapbox token:

```bash
cd wanderlink-hub
```

Then create the `.env.local` file with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wtjvfhdbrvtliyqihktw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0anZmaGRicnZ0bGl5cWloa3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjExNDM2LCJleHAiOjIwNzE0MzcxNDM2fQ.1GlGoQt6Zs0rqcti1I-9DUpdE_bFsDVUlS6ZJmqARvU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0anZmaGRicnZ0bGl5cWloa3R3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg2MTE0MzYsImV4cCI6MjA3MTQzNzE0M30.k3LgQedNHLDDpsRm6-Qc839Wt5_xvRuNbs-_WiAvUow
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoid29uZGVybGlua2h1YiIsImEiOiJjbWVuaGxoNWoxNG95Mm5vcmU0eWd0eWR2In0.vwaPeMQLj4GcquHP9fxTyw
NEXT_PUBLIC_APP_NAME=WanderLink Hub
```

### Step 2: Restart Development Server

After creating the file, restart your development server:

```bash
npm run dev
```

## 🎯 What This Will Fix

1. ✅ **Metadata warnings** - Fixed by moving viewport properties
2. ✅ **Mapbox errors** - Will be fixed with the real token
3. ✅ **API connection** - Already working (no more 500 errors)

## 🎯 Test the Fix

Once you restart the server:
- The metadata warnings should disappear
- The map should load properly with Mapbox
- You should see the explore page working correctly

**Go ahead and create the `.env.local` file with the content above, then restart your dev server!** 🚀
