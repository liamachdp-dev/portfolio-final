# Portfolio

Next.js (App Router) + Tailwind + Supabase. Boot-sequence intro that hands off
into a neofetch-style ASCII panel, then a minimalist sidebar-nav one-pager.
Visitors sign in with Google to leave a recommendation, which only appears
publicly after you approve it from `/admin`.

## 1. Install

```bash
npm install
```

## 2. Create a Supabase project

1. Go to https://supabase.com, create a new project (free tier is enough).
2. In **Project Settings -> API**, copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY` (keep this secret, never
     commit it or expose it to the client)
3. Copy `.env.local.example` to `.env.local` and fill in those values, plus
   `ADMIN_EMAIL` (the Gmail address that's allowed to approve/reject).

## 3. Run the schema

In the Supabase dashboard, go to **SQL Editor -> New query**, paste the
contents of `supabase/schema.sql`, and run it. This creates the
`recommendations` table with row-level security already configured.

## 4. Set up Google sign-in

1. In Supabase: **Authentication -> Providers -> Google** -> enable it.
2. You'll need a Google OAuth Client ID/Secret from the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Application type: **Web application**
   - Authorized redirect URI: the callback URL Supabase shows you on that
     same provider settings page (looks like
     `https://<project-ref>.supabase.co/auth/v1/callback`)
3. Paste the Client ID/Secret into Supabase's Google provider settings and
   save.
4. In **Authentication -> URL Configuration**, add
   `http://localhost:3000/auth/callback` (and later your real domain's
   equivalent) to the Redirect URLs allow-list.

## 5. Run it

```bash
npm run dev
```

Open http://localhost:3000. Sign in with your `ADMIN_EMAIL` Google account and
visit http://localhost:3000/admin to approve/reject test submissions.

## Where things live

```
app/
  page.tsx                     Homepage (Server Component)
  layout.tsx                   Root layout + fonts
  globals.css                  Tailwind + all terminal/boot CSS
  admin/page.tsx                Admin gate (checks ADMIN_EMAIL)
  admin/AdminList.tsx           Approve/reject buttons (Client Component)
  auth/callback/route.ts        OAuth redirect handler
  api/recommendations/route.ts        GET approved list / POST new submission
  api/recommendations/[id]/route.ts   PATCH approve or reject (admin only)

components/
  BootSequence.tsx              "booting up..." intro animation
  Neofetch.tsx                  ASCII portrait + info panel, line-by-line reveal
  PageShell.tsx                 Client wrapper owning the boot animation state
  Sidebar.tsx                   Sticky nav with scroll-spy
  RecommendationForm.tsx        Google sign-in + submit form
  sections/                     About, Certifications, Blogs, Courses, Recommendations

lib/
  asciiArt.ts                   Your ASCII portrait -- swap this file to update it
  supabase/client.ts             Browser Supabase client
  supabase/server.ts             Server Supabase client + admin (service role) client
  types.ts

supabase/schema.sql             Run this once in the Supabase SQL editor
```

## Things to personalize before shipping

- `lib/asciiArt.ts` -- swap in your real portrait (send me a photo and I'll
  generate the ASCII for you, or use a tool like `jp2a` / `ascii-image-converter`)
- `components/Neofetch.tsx` -- the `infoRows` array (role, certs, tools, etc.)
- `app/layout.tsx` -- title/description metadata
- Every section component under `components/sections/` still has bracketed
  placeholder text (`[Your Name]`, `[status]`, etc.)

## Deploying

Push to GitHub, then import the repo on [Vercel](https://vercel.com). Add the
same environment variables from `.env.local` in the Vercel project settings,
and update Supabase's Redirect URLs / Google's Authorized redirect URI to
include your production domain.
