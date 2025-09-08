# Database Setup Guide

This guide will help you set up PostgreSQL database integration for your portfolio admin dashboard.

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database running locally or remotely
2. **Node.js**: Make sure you have Node.js installed
3. **Environment Variables**: Configure your database connection

## 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Configuration (for contact form replies)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"

# Admin User (for initial setup)
ADMIN_EMAIL="admin@portfoliopro.com"
ADMIN_PASSWORD="admin123"

# Default User ID (for public portfolio viewing)
DEFAULT_USER_ID="your-user-id-here"
```

### PostgreSQL Setup Options

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb portfolio_db

# Or use psql
psql -c "CREATE DATABASE portfolio_db;"
```

#### Option B: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name portfolio-postgres \
  -e POSTGRES_USER=portfolio_user \
  -e POSTGRES_PASSWORD=portfolio_password \
  -e POSTGRES_DB=portfolio_db \
  -p 5432:5432 \
  -d postgres:15

# Update your DATABASE_URL:
DATABASE_URL="postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_db?schema=public"
```

#### Option C: Cloud Database (Recommended for Production)
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com

## 2. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Create and run database migration
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

## 3. Initial Setup

Run the setup script to create your admin user and default content:

```bash
# Make sure your .env file is configured first
node scripts/setup.js
```

This will create:
- Admin user account
- PortfolioPro content (skills, projects, experience)
- Database tables and relationships

## 3.1 Get Your User ID

After running the setup script, you need to get your user ID for the DEFAULT_USER_ID environment variable:

```bash
# Check your database for the user ID
npx prisma studio

# Or query it directly:
npx prisma db execute --file <(echo "SELECT id FROM \"User\" LIMIT 1;")
```

Copy the user ID and add it to your `.env` file:
```env
DEFAULT_USER_ID="your-actual-user-id-here"
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Access Admin Dashboard

1. Open your browser to `http://localhost:3000/admin`
2. Log in with the admin credentials from your `.env` file
3. Start customizing your portfolio!

## 6. Email Configuration (Optional)

To enable contact form email replies:

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an App Password: https://support.google.com/accounts/answer/185833
   - Use the App Password in `SMTP_PASSWORD`

2. **Other Email Providers**:
   - Update `SMTP_HOST` and `SMTP_PORT` accordingly
   - For Outlook: `smtp-mail.outlook.com:587`
   - For Yahoo: `smtp.mail.yahoo.com:587`

## 7. File Upload Configuration

The upload directory will be created automatically. You can customize:

```env
# Upload directory (relative to project root)
UPLOAD_DIR="./uploads"

# Maximum file size in bytes (10MB default)
MAX_FILE_SIZE="10485760"
```

## 8. Production Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
```

### Database Migration in Production

```bash
# Generate Prisma client for production
npx prisma generate

# Run migrations in production
npx prisma migrate deploy
```

## 9. Troubleshooting

### Common Issues

1. **Database Connection Error**:
   ```bash
   # Check if PostgreSQL is running
   pg_isready -h localhost -p 5432

   # Or for Docker
   docker ps | grep postgres
   ```

2. **Prisma Client Error**:
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   ```

3. **Migration Issues**:
   ```bash
   # Reset database (WARNING: This will delete all data)
   npx prisma migrate reset
   ```

### Database Schema Updates

If you modify the `prisma/schema.prisma` file:

```bash
# Create new migration
npx prisma migrate dev --name your-migration-name

# Generate updated client
npx prisma generate
```

## 10. Backup and Restore

### Export Data
Use the "Export Content" button in the Publishing Controls section of your admin dashboard.

### Manual Backup
```bash
# Export all data
npx prisma db push --preview-feature

# Or use pg_dump for PostgreSQL
pg_dump your_database_name > backup.sql
```

## 11. Security Notes

- **Change default admin password** after first login
- **Use strong JWT secrets** in production
- **Enable SSL/TLS** for database connections in production
- **Regular backups** are recommended
- **Monitor database performance** and optimize queries as needed

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure PostgreSQL is running and accessible
4. Check Prisma documentation: https://www.prisma.io/docs

---

🎉 **Your portfolio admin dashboard is now fully functional with database persistence!**
