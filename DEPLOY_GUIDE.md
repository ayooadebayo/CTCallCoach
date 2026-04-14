# CTCallCoach — Deployment Guide
## From your laptop to cc.vantforge.com

Follow these sections in order. Each section tells you what you are doing and why,
then gives you the exact steps to execute. Total time: 60–90 minutes on a good run.

---

## The big picture before you start

```
Your GitHub repo
      ↓ connected to
Railway  →  builds and runs the API + PostgreSQL database
      ↑ API URL fed into
Vercel   →  builds and serves the React frontend
      ↑ custom domain added to
Cloudflare  →  handles DNS, HTTPS, and CDN for vantforge.com
      ↑ nameservers pointed to Cloudflare by
Namecheap   →  where vantforge.com is registered
```

The chain is: Namecheap holds the domain. Cloudflare manages the DNS.
Cloudflare points `cc.vantforge.com` at Vercel. Vercel serves the frontend.
The frontend talks to Railway for all data. Railway holds the database and runs the API.

You only do this setup once. After that, every `git push` to main deploys automatically.

---

## SECTION 1 — Push your code to GitHub

> Why: Railway and Vercel both deploy directly from GitHub. Nothing works without this.

**If you have not yet pushed the repo to GitHub:**

1. Go to github.com → New repository
2. Name it `CTCallCoach` — set it to **Private** for now (you can make it public later)
3. Do not initialise with a README (your repo already has one)
4. Copy the remote URL it gives you (e.g. `https://github.com/yourusername/CTCallCoach.git`)
5. In your terminal, from the repo root:
   ```
   git remote add origin https://github.com/yourusername/CTCallCoach.git
   git branch -M main
   git push -u origin main
   ```

**If the repo is already on GitHub:** confirm the latest code is pushed:
```
git status
git push
```

✅ **Check:** Visit your GitHub repo URL in the browser. You should see the full
monorepo folder structure: `apps/`, `packages/`, `BUILD_GUIDE.md`, etc.

---

## SECTION 2 — Deploy the API to Railway

> Why: Railway runs your Fastify API and PostgreSQL database in the cloud.
> It reads your Dockerfile, builds a container, and keeps it running.
> The free tier is more than sufficient for demo traffic.

### Step 2.1 — Create a Railway account

1. Go to **railway.app**
2. Sign up with your GitHub account (this is important — it gives Railway permission
   to access your repos directly)

### Step 2.2 — Create a new project

1. Click **New Project**
2. Choose **Deploy from GitHub repo**
3. Find and select your `CTCallCoach` repository
4. Railway will ask how to deploy it — **do not let it auto-detect**. Click
   **"Add a service"** → choose **"GitHub Repo"** again but this time when it
   asks for configuration, you will set the Dockerfile path manually (next step)

### Step 2.3 — Configure the API service

Once the service is created:
1. Click on the service → go to **Settings** tab
2. Under **Build**, set:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `apps/api/Dockerfile`
   - **Watch Paths**: `apps/api/**`, `packages/**`
3. Under **Deploy**, set:
   - **Start Command**: leave blank (the Dockerfile CMD handles this)
   - **Root Directory**: leave blank (Railway builds from repo root)

### Step 2.4 — Add a PostgreSQL database

1. In your Railway project, click **"+ New"** → **Database** → **Add PostgreSQL**
2. Railway creates a managed PostgreSQL instance and automatically injects
   a `DATABASE_URL` environment variable into your API service. You do not
   need to copy or set this manually.

### Step 2.5 — Set environment variables

Click on your API service → **Variables** tab → add these one by one:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | `sk-...` (your OpenAI key from platform.openai.com) |
| `CORS_ALLOWED_ORIGINS` | `https://cc.vantforge.com` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

> `DATABASE_URL` is already set automatically by the PostgreSQL plugin.
> Do not add it manually.

### Step 2.6 — Deploy

Click **Deploy**. Railway will:
- Pull your code from GitHub
- Build the Docker image using your Dockerfile (takes 3–6 minutes first time)
- Start the API server

Watch the build logs. You are looking for the final line to say something like:
`Server listening on 0.0.0.0:3001` or `ready`.

If it fails, the most common causes are:
- Dockerfile path is wrong — double-check `apps/api/Dockerfile` exists in your repo
- A package is missing — check the build log for `Cannot find module` errors

### Step 2.7 — Run migrations and seed the database

Your database exists but is empty. You need to run the schema migration and seed it.

1. In Railway, click your API service → **"Deploy"** tab → click **"Railway Shell"**
   (or look for a terminal/shell option)
2. In the shell, run:
   ```
   cd apps/api && pnpm exec prisma migrate deploy
   ```
   Wait for it to complete — you should see `All migrations have been applied`.
3. Then run:
   ```
   pnpm db:seed
   ```
   Or if that alias doesn't exist: `npx tsx prisma/seed/index.ts`
   You should see seed confirmation messages for versions, scenarios, questions, etc.

### Step 2.8 — Note your Railway API URL

1. Click your API service → **Settings** → scroll to **Domains**
2. Railway gives you a generated URL like `ctcallcoach-production.up.railway.app`
3. **Copy this URL** — you will need it in Section 3

✅ **Check:** Visit `https://[your-railway-url]/health` in your browser.
You should see `{"status":"ok"}`. If you see that, your API is live.

---

## SECTION 3 — Deploy the frontend to Vercel

> Why: Vercel is the fastest way to host a Vite/React app. It builds automatically
> on every push, gives you HTTPS for free, and handles custom domains cleanly.

### Step 3.1 — Create a Vercel account

1. Go to **vercel.com**
2. Sign up with your GitHub account

### Step 3.2 — Import your project

1. From the Vercel dashboard, click **"Add New"** → **"Project"**
2. Find and import your `CTCallCoach` GitHub repository
3. Vercel will try to auto-detect the framework — it may get confused by the monorepo.
   Set these manually:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - Click **"Edit"** next to Root Directory if needed to type it in

### Step 3.3 — Set environment variables

Before clicking Deploy, scroll down to **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://[your-railway-url]` (the URL from Step 2.8, no trailing slash) |

> Example: `https://ctcallcoach-production.up.railway.app`

### Step 3.4 — Deploy

Click **Deploy**. Vercel will:
- Pull your code from GitHub
- Run `pnpm build` in `apps/web`
- Deploy the built static files to their global CDN

First deploy takes 1–3 minutes. You will get a preview URL like
`ctcallcoach-abc123.vercel.app`.

✅ **Check:** Visit the Vercel preview URL. You should see your landing page.
Click "Launch Demo" — it should work end to end against your Railway API.
If API calls fail, check the browser console for CORS errors (means the
Railway `CORS_ALLOWED_ORIGINS` variable is not yet set to your final domain —
that gets fixed in Section 5 after DNS is set up).

---

## SECTION 4 — Add vantforge.com to Cloudflare

> Why: Cloudflare sits in front of your domain and handles DNS, HTTPS certificates,
> DDoS protection, and CDN caching — all on the free tier. You keep vantforge.com
> registered on Namecheap but tell Namecheap to use Cloudflare's nameservers instead.
> After that, all DNS is managed in Cloudflare.

### Step 4.1 — Create a Cloudflare account

1. Go to **cloudflare.com**
2. Sign up for a free account

### Step 4.2 — Add your domain

1. From the Cloudflare dashboard, click **"Add a site"**
2. Enter `vantforge.com` (the root domain, not the subdomain)
3. Choose the **Free** plan
4. Cloudflare will scan your existing DNS records and import them.
   Review the list — keep any records that were already there
   (e.g. if you have a root A record, MX records for email, etc.)
5. Click **Continue**

### Step 4.3 — Note the Cloudflare nameservers

Cloudflare will show you two nameserver addresses like:
- `aria.ns.cloudflare.com`
- `ben.ns.cloudflare.com`

**Write these down** — you will enter them in Namecheap next.

---

## SECTION 5 — Update nameservers on Namecheap

> Why: Your domain is registered on Namecheap. By pointing its nameservers to
> Cloudflare, you hand over DNS management to Cloudflare. Namecheap still owns
> the domain registration — it just no longer manages the DNS records.

1. Log into **namecheap.com**
2. Go to **Domain List** → click **Manage** next to `vantforge.com`
3. Under the **Nameservers** section, change from "Namecheap BasicDNS" to
   **"Custom DNS"**
4. Enter the two Cloudflare nameservers from Step 4.3
5. Click the green tick / save button

> DNS propagation takes between 5 minutes and 48 hours. Usually it is under 30 minutes.
> Cloudflare will send you an email when the nameservers are active.

✅ **Check:** In Cloudflare, your domain should move from "Pending" to "Active"
in the dashboard. You will also get an email from Cloudflare confirming this.

---

## SECTION 6 — Add the DNS record for cc.vantforge.com

> Why: This is the single DNS record that routes `cc.vantforge.com` to Vercel.
> One CNAME record, and the subdomain is live.

1. In **Cloudflare**, select `vantforge.com`
2. Go to **DNS** → **Records** → **Add record**
3. Fill in:
   - **Type**: `CNAME`
   - **Name**: `cc`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: **Proxied** (orange cloud — this enables Cloudflare protection)
   - **TTL**: Auto
4. Click **Save**

---

## SECTION 7 — Add the custom domain in Vercel

> Why: Vercel needs to know that `cc.vantforge.com` belongs to your project
> so it can serve the right app and provision an HTTPS certificate.

1. In **Vercel**, go to your CTCallCoach project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter `cc.vantforge.com`
4. Vercel will check the DNS. Because you already added the CNAME in Cloudflare,
   it should verify within a minute or two and show a green tick
5. Vercel automatically provisions a free HTTPS certificate via Let's Encrypt

✅ **Check:** Visit `https://cc.vantforge.com` in your browser.
- You should see your landing page
- The address bar should show a padlock (HTTPS is working)
- Click "Launch Demo" — complete a full scenario end to end
- Visit `https://cc.vantforge.com/admin` — check the admin page loads and populates

If you still see a CORS error in the browser console at this stage:
Go back to **Railway** → your API service → **Variables** and confirm
`CORS_ALLOWED_ORIGINS` is set to `https://cc.vantforge.com` (exact match, no slash).
Then redeploy the Railway service.

---

## SECTION 8 — Final checks before telling anyone

Run through this list before sharing the URL with anyone:

- [ ] `https://cc.vantforge.com` loads the landing page with govuk-blue hero
- [ ] "Launch Demo" navigates to the scenario list at `/app`
- [ ] You can select an agent, start a scenario, and complete a full call
- [ ] The question rationale text appears under each question (slight delay is fine)
- [ ] "Generate draft" on the wrap-up screen pre-populates the case note
- [ ] Coaching feedback appears after completing a call
- [ ] `https://cc.vantforge.com/admin` shows versions, escalation rules, and support catalog
- [ ] No red errors in the browser DevTools console
- [ ] `https://[railway-url]/health` returns `{"status":"ok"}`
- [ ] The page looks correct on a phone (resize browser to ~375px width)

Once all boxes are ticked — you have a live, production-grade demo on the internet.

---

## After deployment: keeping it live

**Automatic deploys:** Every time you push to the `main` branch on GitHub, Vercel
and Railway both redeploy automatically. You do not need to do anything manually.

**Railway free tier:** Railway's free tier includes a usage allowance. For demo
traffic it will not come close to limits, but if you leave it running for months
you may want to check the Railway dashboard occasionally.

**Making the repo public:** When you are ready to share the GitHub link alongside
the demo, go to your GitHub repo → Settings → scroll to "Danger Zone" → Change
visibility → Public. This lets people see the code and architecture, which is a
strong signal of quality and openness for your target audiences.

---

*Deployment guide — CTCallCoach LITFOW Project — April 2026*
