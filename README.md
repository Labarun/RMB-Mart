# RMB-Mart

RMB-Mart is a full-stack, modern currency exchange platform built to facilitate seamless conversion of Ghanaian Cedis (GHS) to Chinese Yuan (RMB). The platform provides a secure environment for users to place exchange orders and supports payouts to popular Chinese wallets like **Alipay** and **WeChat**.

## 🚀 Features

- **User Authentication & Roles**: Secure authentication powered by NextAuth. Two distinct roles: Customer and Admin.
- **KYC Verification**: Built-in Know Your Customer (KYC) workflows, allowing users to upload identification documents securely before placing large orders.
- **Order Management**: End-to-end tracking of currency exchange orders with various statuses (Pending, Processing, Completed, Refunded, Cancelled).
- **Live Exchange Rates**: Admins can dynamically update the GHS to RMB exchange rate.
- **Mobile Money Integration**: Handling of MoMo (Mobile Money) payments for Ghanaian users.
- **In-App Messaging**: Order-specific chat system for direct communication between customers and admins.
- **Admin Dashboard**: Comprehensive analytics, order processing interface, audit logging, and dynamic site settings management.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (managed via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Emails**: [Resend](https://resend.com/)

## 📦 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) and npm/yarn/pnpm installed.
You will also need a PostgreSQL database (e.g., Supabase) and accounts for UploadThing and Resend.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sherif55/RMB-Mart.git
   cd RMB-Mart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (you can use `.env.example` as a reference):
   ```bash
   cp .env.example .env
   ```
   Fill in the required variables (Database connection string, NextAuth secret, Resend API key, UploadThing secrets, etc.).

4. Set up the database:
   ```bash
   npm run db:push
   ```
   *(Optional)* Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema

The core models include:
- `User`: Manages user accounts, roles, and KYC statuses.
- `Order`: Tracks exchange orders, payout details (Alipay/WeChat), and amounts.
- `ExchangeRate`: Stores historical and current GHS to RMB rates.
- `OrderMessage`: Facilitates chat support for specific orders.
- `AuditLog`: Admin action tracking for security and accountability.
- `PaymentSettings` & `SiteSettings`: Dynamic configuration for the platform.

## 📝 License

This project is proprietary and intended for internal use.
