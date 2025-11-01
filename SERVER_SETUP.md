# Aranshi Education Hub - Server Setup Guide

This guide will help you set up the backend server for the Aranshi Education Hub student registration system.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- An SMTP server (like Gmail, SendGrid, etc.)

## Setup Instructions

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone <repository-url>
   cd aaranshi-education-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env.example` file to `.env`
   - Update the values in `.env` with your configuration
   ```bash
   cp .env.example .env
   ```

4. **Configure email settings**
   - Update the following in your `.env` file:
     ```
     SMTP_HOST=your-smtp-host
     SMTP_PORT=587
     SMTP_SECURE=false
     SMTP_USER=your-email@example.com
     SMTP_PASSWORD=your-email-password
     EMAIL_FROM=no-reply@aaranshieducationhub.com
     ADMIN_EMAIL=admin@aaranshieducationhub.com
     CONTACT_PHONE=+91-XXXXXXXXXX
     ```

5. **Create logs directory**
   ```bash
   mkdir -p logs
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic reloading.

### Production Mode
```bash
npm start
```

## API Endpoints

- `POST /api/register/submit` - Submit registration form
- `GET /api/register/classes` - Get list of available classes
- `GET /api/health` - Health check endpoint

## Email Configuration

The system is configured to send two types of emails:
1. **Admin Notification**: Sent to the admin email when a new registration is received
2. **Confirmation Email**: Sent to the student as an acknowledgment

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions

## Troubleshooting

- **Email not sending**: Check SMTP settings and ensure your email provider allows less secure apps
- **Port in use**: Change the `PORT` in `.env` if the default port is in use
- **CORS issues**: Verify the `FRONTEND_URL` in `.env` matches your frontend URL

## Security Considerations

1. Keep your `.env` file secure and never commit it to version control
2. Use environment variables for all sensitive information
3. Keep dependencies updated
4. Use HTTPS in production
5. Implement rate limiting for the registration endpoint

## Deployment

For production deployment, consider using:
- PM2 for process management
- Nginx as a reverse proxy
- SSL/TLS for secure connections
- Environment-specific configuration files
