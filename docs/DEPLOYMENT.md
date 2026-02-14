# Deployment Guide

## Deployment Options

Query Quest can be deployed to various platforms. This guide covers the most common deployment methods.

## Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your live URL: `https://your-project.vercel.app`

### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

No environment variables required for basic deployment.

---

## Netlify

### Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: (leave empty)

4. **Deploy**
   - Click "Deploy site"
   - Get your live URL: `https://your-project.netlify.app`

---

## Static Export (GitHub Pages, etc.)

Query Quest uses client-side SQL.js, so it can be exported as a static site.

### Build Static Export

1. **Update next.config.ts**
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true
     }
   };
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Output**
   - Static files in `out/` directory
   - Deploy `out/` folder to any static host

### GitHub Pages

1. **Create `.github/workflows/deploy.yml`**
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Save

3. **Push to trigger deployment**
   ```bash
   git push origin main
   ```

---

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t query-quest .

# Run container
docker run -p 3000:3000 query-quest
```

---

## Self-Hosted (Node.js)

### Requirements

- Node.js 18+
- npm or yarn
- Process manager (PM2 recommended)

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/Theleewayy/Query-Quest.git
   cd Query-Quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Start with PM2**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "query-quest" -- start

   # Save PM2 process list
   pm2 save

   # Setup PM2 to start on boot
   pm2 startup
   ```

5. **Access**
   ```
   http://localhost:3000
   ```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Performance Optimization

### Build Optimization

1. **Analyze bundle**
   ```bash
   npm install @next/bundle-analyzer
   ```

   Update `next.config.ts`:
   ```typescript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })

   module.exports = withBundleAnalyzer(nextConfig)
   ```

   Run analysis:
   ```bash
   ANALYZE=true npm run build
   ```

2. **Enable compression**
   - Vercel/Netlify enable this automatically
   - For self-hosted, use nginx gzip

### Caching

- Static assets cached automatically
- sql.js WASM file cached by browser
- Monaco Editor chunks lazy-loaded

---

## Monitoring

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Build Errors

**Error**: `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error**: `Out of memory`
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Runtime Errors

**sql.js not loading**
- Ensure `public/` directory is deployed
- Check browser console for CORS errors
- Verify WASM files are served correctly

**Monaco Editor not loading**
- Check dynamic import is working
- Verify `ssr: false` in dynamic import
- Check browser console for errors

---

## Security Considerations

- No backend API (client-side only)
- No user data stored
- No authentication required
- sql.js runs in browser sandbox
- All SQL queries executed locally

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All levels playable
- [ ] Timer functions properly
- [ ] SQL queries execute
- [ ] Manual sidebar works
- [ ] Sound effects play
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] No console errors

---

For issues, visit: https://github.com/Theleewayy/Query-Quest/issues
