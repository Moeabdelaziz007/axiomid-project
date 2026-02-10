# Domain Configuration Guide for AxiomID

## Overview

This guide provides step-by-step instructions for configuring the axiomid.app domain with Vercel deployment and ensuring proper DNS setup.

## Current Configuration Status

✅ **Package.json**: Updated with proper metadata and deployment scripts
✅ **Vercel.json**: Created with security headers and domain alias
✅ **Layout.tsx**: Enhanced with SEO metadata and proper structure
✅ **README.md**: Updated with professional documentation and founder attribution

## Domain Setup Instructions

### 1. Vercel Project Configuration

The project is configured to deploy to `axiomid.app` with the following settings:

```json
{
  "alias": ["axiomid.app"],
  "regions": ["iad1", "sfo1", "pdx1"],
  "public": true
}
```

### 2. DNS Configuration Required

To point axiomid.app to your Vercel deployment, configure these DNS records:

#### A Records (for apex domain):
```
@ → 76.76.21.21
@ → 99.86.54.54
@ → 143.244.172.10
@ → 23.235.39.123
```

#### CNAME Record (for www subdomain):
```
www → cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for custom domains. Once DNS is configured correctly, the certificate will be issued within 24 hours.

### 4. Environment Variables

Set these environment variables in your Vercel project settings:

```bash
NEXT_PUBLIC_SITE_URL=https://axiomid.app
NEXTAUTH_URL=https://axiomid.app
NEXTAUTH_SECRET=your-secret-key-here
```

## Deployment Commands

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Deployment
```bash
npm run build
npm run deploy
# Deploys to Vercel with production settings
```

### Preview Deployment
```bash
npm run deploy:preview
# Creates a preview deployment for testing
```

## Monitoring and Analytics

### Performance Monitoring
- Vercel Analytics for Core Web Vitals
- Custom performance metrics tracking
- Error monitoring with Sentry integration

### Domain Health Checks
- SSL certificate expiration monitoring
- DNS propagation verification
- Uptime monitoring

## Security Configuration

The `vercel.json` includes these security headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

## Troubleshooting Common Issues

### DNS Not Propagating
1. Verify DNS records with `dig axiomid.app`
2. Wait 24-48 hours for full propagation
3. Check Vercel domain settings in dashboard

### SSL Certificate Issues
1. Ensure DNS is pointing to Vercel
2. Check domain verification in Vercel dashboard
3. Force reissue certificate through Vercel UI

### Deployment Failures
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure package.json scripts are correct

## Backup and Recovery

### Git Backup Strategy
- Main repository: GitHub (primary)
- Automated backups: Daily snapshots
- Branch protection: Enabled for main branch

### Disaster Recovery Plan
1. Restore from latest backup
2. Reconfigure environment variables
3. Update DNS records if needed
4. Monitor deployment health

## Future Enhancements

### Planned Improvements
- Multi-region deployment expansion
- Advanced caching strategies
- CDN optimization
- Performance monitoring dashboard

### Scalability Considerations
- Auto-scaling configuration
- Database connection pooling
- API rate limiting
- Load testing procedures

This configuration ensures AxiomID will be properly deployed and accessible at axiomid.app with enterprise-grade security and performance optimizations.