# B2B Deal – Nepal's B2B Wholesale Marketplace Platform

> **Connect • Order • Grow**  
> Modern, production-ready B2B wholesale marketplace connecting retailers, kirana stores, and supermarkets directly with authorized wholesale FMCG distributors and manufacturers in Nepal.

---

## 🌟 Platform Highlights

- **3 Fully Integrated Platforms**:
  1. **Retailer Platform (Mobile-First)**: Live search, tiered volume discounts, MOQ checks, real-time cart calculations with 13% VAT, Cash on Delivery (COD) / digital payments, and live order tracking with driver contact.
  2. **Distributor Web Portal**: Product catalog management with CSV bulk import/template, order fulfillment workflow (Confirm → Pack → Dispatch & Assign Driver → Deliver), wholesale promotional deals, and commission earnings ledger.
  3. **Super Admin Dashboard**: Nationwide GMV and revenue charts, distributor verification & custom commission overrides, retailer audit, master orders ledger, and 1-click downloadable CSV reports.
- **Nepal-Specific Business Architecture**:
  - Currency: Nepalese Rupee (`NPR` / `Rs.` / `रू`)
  - Official 13% VAT Tax Invoices compliant with Nepal Inland Revenue Department (IRD) standards, complete with Buyer & Seller 9-digit PAN/VAT registration numbers and printable/PDF layouts.
  - Multi-tier administrative division hierarchy: 7 Provinces (Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim), major Districts, Municipalities, and Ward numbers.
  - Ready modular architecture for digital payment providers (eSewa, Khalti, Fonepay, Cash on Delivery, Bank Transfer).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts
- **Backend**: Next.js Server Components, App Router RESTful API routes, Server-side business logic
- **Database & ORM**: Neon Serverless PostgreSQL with Prisma ORM
- **Authentication**: Role-based access control (RBAC), bcryptjs password hashing, JWT session cookies, server-side route security
- **Deployment**: Vercel ready with automated Prisma client generation

---

## 🔑 Pre-Configured Demo Accounts

For instant testing and evaluation across all three portals, use the following credentials (or use the **1-Click Demo Login** buttons on `/login`):

| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Retailer Shopping** | `RETAILER` | `retailer@kalankimart.com.np` | `Password123!` |
| **Distributor Portal** | `DISTRIBUTOR` | `distributor@himalayan.com.np` | `Password123!` |
| **Super Admin Panel** | `SUPER_ADMIN` | `admin@b2bdeal.com.np` | `Password123!` |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/b2b-deal.git
cd b2b-deal
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
# Neon Serverless PostgreSQL Database URLs
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Authentication & Session Secret
AUTH_SECRET="your-super-secure-auth-secret-key-min-32-chars-long"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_CURRENCY="NPR"
NEXT_PUBLIC_VAT_PERCENTAGE="13"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to Neon PostgreSQL (when connected)
npm run prisma:push

# Seed database with sample data
npm run prisma:seed
```

*Note: In local development or before attaching a Neon PostgreSQL database, the platform features a transparent persistent in-memory repository with preloaded sample data so every single page, CRUD operation, checkout, and invoice works immediately.*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Deployment on Vercel

1. Push your repository to **GitHub**.
2. Connect the repository in the **Vercel Dashboard**.
3. In **Settings → Environment Variables**, add:
   - `DATABASE_URL` (Neon PostgreSQL pooled connection string)
   - `DIRECT_URL` (Neon PostgreSQL direct connection string)
   - `AUTH_SECRET` (Secure 32+ character random secret)
   - `NEXT_PUBLIC_APP_URL` (Your production Vercel URL)
4. The included `vercel.json` and `package.json` will automatically run `npx prisma generate && next build`.

---

## 📁 Project Architecture

```
b2b-deal/
├── app/
│   ├── (public)/          # Retailer marketplace, products, categories, deals
│   ├── (auth)/            # Login, retailer register, distributor onboarding
│   ├── retailer/          # Shopping cart, checkout, orders, IRD invoices, profile
│   ├── distributor/       # Distributor dashboard, catalog, offers, orders, drivers
│   ├── admin/             # Super admin control, distributors, retailers, reports
│   └── api/               # RESTful API endpoints (auth, cart, orders, products)
├── components/
│   ├── ui/                # Core accessible UI components (Button, Input, Card, Badge)
│   ├── shared/            # Navbar, Footer, MobileNav, Sidebar, Tax Invoice, StatCard
│   ├── retailer/          # ProductCard, OrderTimeline
│   └── distributor/       # SalesChart (Recharts)
├── lib/
│   ├── auth/              # JWT, password hashing, session cookies, RBAC
│   ├── db/                # Prisma client, mock/seed repository, store
│   ├── services/          # Nepal 7 provinces, districts, municipalities data
│   ├── validations/       # Zod validation schemas
│   └── utils/             # NPR currency formatters, date formatters, cn
├── prisma/
│   ├── schema.prisma      # Normalized PostgreSQL schema
│   └── seed.js            # Database seeding script
└── vercel.json            # Production deployment build config
```

---

## 📄 License & Credits

Developed for the Nepalese Wholesale Ecosystem by **B2B Deal Nepal Pvt. Ltd.**
