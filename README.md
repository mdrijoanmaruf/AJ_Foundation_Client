# A/J Khan Foundation — Client

Frontend for the **A/J Khan Foundation** (এজে খান ফাউন্ডেশন), a Bengali-language non-profit organization website managing education, humanitarian services, and social development programs.

**Live Site:** [aj-foundation.vercel.app](https://aj-foundation.vercel.app)
**Repository:** [github.com/mdrijoanmaruf/AJ_Foundation_Client](https://github.com/mdrijoanmaruf/AJ_Foundation_Client.git)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | NextAuth.js (Credentials + Google OAuth) |
| State/Session | JWT-based with role sync |
| Icons | React Icons |
| Alerts | SweetAlert2 |
| Image Hosting | imgbb API |
| Deployment | Vercel |

---

## Features

### Public Pages
- **Home** — Hero section, services grid, recent programs, recent blogs, gallery preview
- **About** — Foundation values, team members & advisors from API
- **Programs** — Program listing with details (objectives, beneficiaries, expenses, areas, duration, gallery, YouTube embed)
- **Blog** — Blog listing with search & pagination; detail view with YouTube embed, image gallery, related posts, view counter
- **Gallery** — Photo & video gallery with topic-based filtering and lightbox viewer
- **Contact** — Contact form + FAQ accordion + address/phone/WhatsApp info

### Authentication
- Email/password credential login
- Google OAuth sign-in
- User registration with optional profile image
- Role-based access control (Admin / User)

### Admin Dashboard
- **Dashboard** — Stats overview (users, messages, gallery, programs) + recent activity
- **User Management** — List, search, filter users; toggle admin/user roles
- **Blog Management** — Create, edit, delete, publish/unpublish blogs with image upload & YouTube URL
- **Program Management** — Full CRUD with dynamic fields (objectives, beneficiaries, expense categories, areas)
- **Gallery Management** — Photo & video CRUD organized by topics
- **Team Management** — CRUD for team members/advisors with photo, designation, bio, role, order
- **Messages** — Inbox with read/unread tracking, search, reply via email, bulk delete

### Other
- Floating WhatsApp chat button
- Responsive design with mobile hamburger menu & collapsible admin sidebar
- Bangla (Bengali) UI throughout

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=         # Backend API URL (default: http://localhost:5000)
NEXT_PUBLIC_WEBSITE_URL=     # Public site URL
GOOGLE_CLIENT_ID=            # Google OAuth client ID
GOOGLE_CLIENT_SECRET=        # Google OAuth client secret
NEXTAUTH_SECRET=             # NextAuth secret key
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/mdrijoanmaruf/AJ_Foundation_Client.git
cd AJ_Foundation_Client

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── page.tsx              # Home
├── about/                # About page
├── programs/             # Programs listing & detail
├── blog/                 # Blog listing & detail
├── gallery/              # Photo & video gallery
├── contact/              # Contact form & FAQ
├── login/                # Login page
├── register/             # Registration page
├── admin/                # Admin dashboard & management pages
└── api/auth/             # NextAuth API route
components/
├── Navbar/               # Top navigation bar
├── Footer/               # Footer with social links
├── Home/                 # Hero, Service, RecentBlog, RecentPrograms, HomeGallery
├── Contact/              # Contact page components
└── WhatsApp/             # Floating WhatsApp button
hooks/
└── useUserRole.ts        # Custom hook for role from session
```
