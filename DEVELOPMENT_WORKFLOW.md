# Development Workflow Guide

## Environment Setup

### Production (Live)
- **Branch**: `main`
- **URL**: https://wanderlinkhub.com (your live site)
- **Purpose**: Live website with real users
- **Deployment**: Automatic via Vercel when pushing to `main`

### Development (Testing)
- **Branch**: `development`
- **URL**: Vercel preview URL (changes with each push)
- **Purpose**: Testing new features before going live
- **Deployment**: Automatic via Vercel when pushing to `development`

## Workflow

### 1. Daily Development
```bash
# Switch to development branch
git checkout development

# Pull latest changes
git pull origin development

# Make your changes
# ... code changes ...

# Commit and push to development
git add .
git commit -m "feat: Add new feature"
git push origin development
```

### 2. Testing New Features
- Push to `development` branch
- Vercel automatically creates a preview URL
- Test the feature on the preview URL
- Share preview URL with team/stakeholders for feedback

### 3. Deploying to Production
```bash
# When ready to go live, merge development to main
git checkout main
git pull origin main
git merge development
git push origin main
```

### 4. Hotfixes (Emergency fixes)
```bash
# For urgent fixes, work directly on main
git checkout main
# ... make urgent fix ...
git add .
git commit -m "hotfix: Fix critical issue"
git push origin main
```

## Vercel Preview URLs

When you push to `development`, Vercel will create a preview URL like:
- `https://wanderlink-hub-git-development-marinas-projects-c9f4356d.vercel.app`

You can find these URLs in:
1. Vercel dashboard
2. GitHub PR comments
3. Terminal output after `vercel --prod --force`

## Environment Variables

### Production
- Uses production environment variables
- Real Stripe keys (when you switch to live mode)
- Production database

### Development
- Uses same environment variables as production
- Can be overridden for testing if needed

## Best Practices

1. **Always test on development first**
2. **Never push directly to main** (except hotfixes)
3. **Use descriptive commit messages**
4. **Test thoroughly before merging to main**
5. **Keep development branch up to date**

## Quick Commands

```bash
# Start development
git checkout development
npm run dev

# Deploy to development
git push origin development

# Deploy to production
git checkout main
git merge development
git push origin main
```

## Rollback (if needed)

If something goes wrong in production:
```bash
# Revert to previous commit
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

## Current Status

- ✅ Development branch created
- ✅ Vercel preview deployments enabled
- ✅ Production site protected
- ✅ Development workflow established
