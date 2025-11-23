# Email Notification System - Setup Guide

## ✅ IMPLEMENTED FEATURES

### 1. Automatic Email Notifications
- **Admin Notification**: Every registration sends a detailed email to `hupendrad4@gmail.com`
- **Student Confirmation**: Automatic confirmation email sent to the student
- **Professional HTML Templates**: Beautifully formatted emails with your branding

### 2. Email Content Includes
- ✅ Student's full personal information
- ✅ Guardian/parent details
- ✅ Academic background
- ✅ Course preferences
- ✅ Interests and additional notes
- ✅ Timestamp of submission
- ✅ Direct reply capability

### 3. Technical Implementation
- **SMTP Service**: Gmail SMTP (reliable and free)
- **Email Library**: Nodemailer (industry standard)
- **Fallback Handling**: Registration succeeds even if email fails
- **Database Storage**: All registrations saved to JSON file

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Generate Gmail App Password

**IMPORTANT**: Gmail requires an App-Specific Password (not your regular password)

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - OR: Search for "App Passwords" in account settings
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name it: "Aranshi Education Hub"
   - Click "Generate"

4. **Copy the 16-character Password**
   - Example: `abcd efgh ijkl mnop`
   - Remove spaces: `abcdefghijklmnop`

### Step 2: Update .env File

Open `.env` file and update:

```env
EMAIL_USER=hupendrad4@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
ADMIN_EMAIL=hupendrad4@gmail.com
```

**Example:**
```env
EMAIL_USER=hupendrad4@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=hupendrad4@gmail.com
```

### Step 3: Install Dependencies

```bash
cd "/home/aumni/Hupendra/Hupendra Work/aaranshi-education-hub"
npm install
```

### Step 4: Start the Server

```bash
npm start
# OR
node server/index.js
```

**Expected Output:**
```
✓ Email service initialized successfully
✓ Email server connection verified
✓ Email service ready
Server running on port 3001
```

---

## 📧 EMAIL TEMPLATES

### Admin Notification Email

**Subject**: 🎓 New Registration: [Student Name] - [Class]

**Content**:
- Professional header with gradient design
- Complete student information organized in sections:
  - Personal Information
  - Guardian Information
  - Academic Information
  - Interests (as badges)
  - Additional Information
- Submission timestamp
- Direct reply capability to student's email

### Student Confirmation Email

**Subject**: 🎓 Registration Received - Aranshi Education Hub

**Content**:
- Welcome message
- Registration confirmation
- Next steps information
- Contact details
- Professional branding

---

## 🧪 TESTING

### Test Email Configuration

1. **Start the server**
   ```bash
   npm start
   ```

2. **Test Email Setup** (via API)
   ```bash
   curl http://localhost:3001/api/registration/test/email
   ```

3. **Submit a Test Registration**
   - Go to: http://localhost:3001/register.html
   - Fill out the form
   - Submit

4. **Check Your Email**
   - Check `hupendrad4@gmail.com` inbox
   - Look for email with subject: "New Registration..."

---

## 📁 FILES CREATED/MODIFIED

### New Files Created:

1. **`server/utils/emailService.js`**
   - Email service class
   - SMTP configuration
   - Email templates (HTML & text)
   - Send methods

2. **`server/controllers/registrationController.js`**
   - Handle registration submissions
   - Save to database
   - Trigger email notifications
   - Error handling

3. **`server/routes/registration.js`**
   - API endpoints
   - POST /api/registration (submit)
   - GET /api/registration (list all)
   - GET /api/registration/:id (get one)
   - GET /api/registration/test/email (test)

4. **`.env`**
   - Environment configuration
   - Email credentials

5. **`EMAIL_SETUP_GUIDE.md`** (this file)
   - Complete documentation

### Modified Files:

1. **`server/index.js`**
   - Import email service
   - Initialize on startup
   - Verify connection

2. **`package.json`**
   - Added nodemailer dependency
   - Added dotenv dependency

---

## 🔍 TROUBLESHOOTING

### "Email service not configured"

**Problem**: Missing or incorrect email credentials

**Solution**:
1. Check `.env` file exists
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
3. Make sure you're using App Password (not regular password)
4. Remove spaces from app password

### "Invalid login"

**Problem**: App Password not generated or incorrect

**Solution**:
1. Enable 2-Step Verification on Google account
2. Generate new App Password
3. Copy exactly (without spaces)
4. Update `.env` file
5. Restart server

### "ECONNREFUSED" or connection errors

**Problem**: Network/firewall blocking SMTP

**Solution**:
1. Check internet connection
2. Try from a different network
3. Check firewall settings
4. Gmail SMTP ports: 587 (TLS) or 465 (SSL)

### Email sent but not received

**Problem**: Emails in spam or filters

**Solution**:
1. Check spam/junk folder
2. Add sender to contacts
3. Check Gmail filters
4. Verify email address is correct

---

## 📊 DATABASE

Registrations are saved to: `db/registrations.json`

**Structure**:
```json
{
  "registrations": [
    {
      "id": "1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      ...
      "submittedAt": "2025-11-23T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

## 🔐 SECURITY NOTES

### ⚠️ IMPORTANT:

1. **Never commit .env to Git**
   - Already added to `.gitignore`
   - Contains sensitive credentials

2. **Use App Passwords**
   - More secure than regular password
   - Can be revoked independently
   - Limited to mail access only

3. **Keep credentials private**
   - Don't share email password
   - Don't screenshot with credentials visible

4. **Regular password rotation**
   - Regenerate app password periodically
   - Update `.env` file when changed

---

## 📞 SUPPORT

If you encounter issues:

1. **Check Server Logs**
   - Look for error messages in terminal
   - Check `logs/error.log`

2. **Verify Configuration**
   - `.env` file has correct values
   - No typos in email address
   - App password copied correctly

3. **Test Email Connection**
   ```bash
   curl http://localhost:3001/api/registration/test/email
   ```

---

## ✅ CHECKLIST

Before going live, verify:

- [ ] Gmail App Password generated
- [ ] `.env` file updated with credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Email test endpoint returns success
- [ ] Test registration sends email
- [ ] Email received in inbox
- [ ] Student gets confirmation email
- [ ] Emails look professional (check HTML)

---

## 🎯 WHAT HAPPENS WHEN FORM IS SUBMITTED

1. User fills registration form on `register.html`
2. Form data posted to `/api/registration`
3. Server validates and saves to database
4. **Email sent to admin** (`hupendrad4@gmail.com`) with all details
5. **Confirmation email sent to student**
6. Success message shown to user
7. Admin can review and respond

---

## 📧 EXAMPLE NOTIFICATION EMAIL

```
Subject: 🎓 New Registration: Raj Kumar - Class 10

From: Aranshi Education Hub <hupendrad4@gmail.com>
To: hupendrad4@gmail.com
Reply-To: student@example.com

[Beautiful HTML Email with:]
- Gradient header
- Student name, email, phone
- Guardian details
- Academic background
- Course preferences
- Submission timestamp
- Professional footer
```

---

**Status**: ✅ READY TO USE

**Last Updated**: November 23, 2025

**Configuration Required**: Gmail App Password (see Step 1)

