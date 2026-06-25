# 🤝 SkillSwap

> **The Digital Town Square for Hyper-local Skill & Favor Trading.**

SkillSwap is a modern, community-first web application built to revive neighbor-to-neighbor cooperation. Instead of relying on monetary transactions, SkillSwap enables community members to trade skills, tools, time, and favors (e.g., *"I'll fix your leaky faucet if you tutor my daughter in algebra"* or *"Lending a pressure washer for weekend gardening help"*).

---

## ✨ Features Implemented (Phase 1 & Phase 2)

### 🗺️ Geo-fenced Discovery & Exploration
* **Community Zones**: Filter neighbors and offers dynamically by DB-driven geographical sectors (*Northside Hub, South Market, East Village, West End*).
* **Reputation & Availability Filters**: Search offers and requests with instant toggles for **Trusted Members** and **Available Now**.
* **Verified Reputation Overlays**: Space-saving checkmark overlays (`verified`) on member avatars across card and bento grid layouts.

### 📦 Skill Offers & Requests
* **Offer Lifecycle Management**: Members can create, edit, pause, and resume skill offers.
* **Skill Requests**: Post community favor requests and cancel them cleanly when fulfilled or withdrawn.
* **Multi-step Onboarding**: Smooth onboarding experience with instant live image previewing and Supabase Storage avatar uploads.

### 💬 Instant Real-time Messaging
* **WebSocket Live Chat**: Built-in messaging thread (`/messages` & `/exchanges/[id]`) powered by Supabase Realtime channel subscriptions.
* **Automatic Read Receipts**: Thread notifications and unread message indicators sync instantly upon opening conversation modals.

### 🛡️ Trust, Moderation, & Admin Governance
* **Role-Based Access Control (RBAC)**: Secure admin navigation (`/admin/*`) and moderator queues (`/moderator/*`).
* **Conflict of Interest (COI) Guardrails**: Enforced server-side checks preventing moderators from dismissing or acting on user reports where they are either the reporter or the accused target.
* **Moderation Audit Trail**: Comprehensive system audit log page (`/admin/moderation-log`) tracking administrative overrides and member bans.

### 🎨 Design System & Aesthetics
* **Rich Aesthetic System**: Built with strict CSS design tokens (`index.css`), glassmorphic modals, and curated typography (*Outfit* & *Plus Jakarta Sans*).
* **Responsive Card & Table Portals**: Action dropdowns rendered via `createPortal` to prevent bounding-box clipping on compact tables.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [Next.js 16](https://nextjs.org) (App Router, React Server Components, Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org) (Strict type checking)
* **Styling**: Vanilla CSS Design Tokens + Tailwind CSS utility helpers
* **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Supabase Auth, Row-Level Security)
* **Realtime & Storage**: Supabase Realtime WebSockets & Supabase Storage (`avatars` bucket)

---

## 🚀 Getting Started

### Prerequisites
* Node.js v20+ 
* npm v10+
* A Supabase project instance

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/skill-swap.git
cd skill-swap
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔮 Roadmap & Future Updates

* [ ] **Dispute Resolution Flow**: Add participant trigger buttons on active exchanges to escalate issues directly into the `/moderator/queue`.
* [ ] **Admin Category UI**: Visual management page in the Admin Panel for CRUD operations on skill categories.
* [ ] **Edge Query Caching**: Integrate Redis or Edge cache headers to reduce sequential Supabase roundtrip latency during high-frequency discovery navigations.
* [ ] **Suspension Notice Intercept**: Dedicated full-screen appeal modal upon login attempt for suspended accounts.

---

## 📄 License
This project is licensed under the MIT License.
