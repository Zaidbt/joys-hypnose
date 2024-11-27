# Deployment Guide for Joy's Hypnose

## Prerequisites
- Hostinger VPS with MEAN stack
- Domain name configured to point to your VPS IP
- SSH access to your VPS

## Step 1: Initial Server Setup

1. SSH into your VPS:
```bash
ssh root@your-server-ip
```

2. Update the system:
```bash
apt update && apt upgrade -y
```

3. Install required dependencies:
```bash
apt install -y git nginx
```

4. Install PM2 globally:
```bash
npm install -g pm2
```

## Step 2: Clone and Setup Application

1. Clone your repository:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Install dependencies:
```bash
npm install
```

3. Create production environment file:
```bash
cp .env.local .env.production
```

4. Update .env.production with your production values:
```
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"
ADMIN_EMAIL="your-email"
ADMIN_PASSWORD="your-hashed-password"
MONGODB_URI="your-mongodb-uri"
```

## Step 3: Deploy Application

1. Make deploy script executable:
```bash
chmod +x scripts/deploy.sh
```

2. Run deployment script:
```bash
./scripts/deploy.sh
```

3. Start the application with PM2:
```bash
pm2 start ecosystem.config.js
```

4. Save PM2 process list:
```bash
pm2 save
```

5. Setup PM2 to start on system boot:
```bash
pm2 startup
```

## Step 4: Configure Nginx

1. Copy nginx configuration:
```bash
cp nginx.conf /etc/nginx/sites-available/joys-hypnose
```

2. Create symbolic link:
```bash
ln -s /etc/nginx/sites-available/joys-hypnose /etc/nginx/sites-enabled/
```

3. Test and restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

## Step 5: SSL Setup (Optional but Recommended)

1. Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Maintenance

### Updating the Application

1. Pull latest changes:
```bash
git pull origin main
```

2. Run deployment script:
```bash
./scripts/deploy.sh
```

3. Restart the application:
```bash
pm2 restart joys-hypnose
```

### Monitoring

- View logs:
```bash
pm2 logs joys-hypnose
```

- Monitor application:
```bash
pm2 monit
```

### Backup

1. Database backup (run daily):
```bash
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)
```

## Troubleshooting

1. If the application isn't accessible:
- Check PM2 status: `pm2 status`
- Check Nginx status: `systemctl status nginx`
- Check logs: `pm2 logs joys-hypnose`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`

2. If you get 502 Bad Gateway:
- Ensure Next.js is running: `pm2 list`
- Check if port 3000 is listening: `netstat -tulpn | grep 3000`

3. SSL Issues:
- Check SSL status: `certbot certificates`
- Renew certificate: `certbot renew` 