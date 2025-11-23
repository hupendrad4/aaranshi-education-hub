# 🚀 Email Notification System - Quick Start

## ✅ WHAT'S BEEN IMPLEMENTED

Your registration form now automatically sends emails to **hupendrad4@gmail.com** every time someone registers!

### Features:
- ✅ Beautiful HTML email with all registration details
- ✅ Automatic email to admin (you)
- ✅ Confirmation email to student
- ✅ Professional branding
- ✅ Data saved to database
- ✅ Error handling & fallbacks

---

## ⚡ QUICK SETUP (5 Minutes)

### 1. Get Gmail App Password

1. Go to: **https://myaccount.google.com/apppasswords**
2. You may need to enable 2-Step Verification first
3. Select app: **Mail**
4. Select device: **Other** → Type "Aranshi Education Hub"
5. Click **Generate**
6. Copy the 16-character password (example: `abcd efgh ijkl mnop`)

### 2. Update .env File

Open `.env` file and replace `your_app_specific_password_here` with your app password:

```env
EMAIL_USER=hupendrad4@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=hupendrad4@gmail.com
```

**Important**: Remove spaces from the password!

### 3. Install & Run

```bash
cd "/home/aumni/Hupendra/Hupendra Work/aaranshi-education-hub"

# Install dependencies
npm install

# Start server
npm start
```

### 4. Test It!

1. Open: **http://localhost:3001/register.html**
2. Fill out the form
3. Submit
4. Check **hupendrad4@gmail.com** inbox!

---

## 📧 WHAT EMAILS LOOK LIKE

### Email to You (Admin)

**Subject**: 🎓 New Registration: [Student Name] - [Class]

**Contains**:
- Student's full details
- Guardian information
- Academic background
- Course preferences  
- Interests
- Additional notes
- Timestamp

### Email to Student

**Subject**: 🎓 Registration Received - Aranshi Education Hub

**Contains**:
- Welcome message
- Confirmation of registration
- What happens next
- Your contact details

---

## 🔧 FILES MODIFIED/CREATED

### Created:
- `server/utils/emailService.js` - Email sending service
- `server/controllers/registrationController.js` - Handle submissions
- `server/routes/registration.js` - API endpoints
- `.env` - Configuration
- `EMAIL_SETUP_GUIDE.md` - Full documentation
- `db/` - Database directory

### Modified:
- `server/index.js` - Initialize email service
- `register.html` - Connect form to API
- `package.json` - Added nodemailer

---

## ✅ TESTING CHECKLIST

- [ ] App password generated
- [ ] `.env` file updated
- [ ] `npm install` completed
- [ ] Server starts successfully
- [ ] See "✓ Email service ready" in console
- [ ] Form submits successfully
- [ ] Email received at hupendrad4@gmail.com
- [ ] Student gets confirmation email

---

## ⚠️ TROUBLESHOOTING

### "Email service not configured"
→ Check `.env` file has EMAIL_USER and EMAIL_PASSWORD

### "Invalid login"  
→ Make sure you're using App Password (not regular password)
→ Remove spaces from password

### Email not received
→ Check spam folder
→ Verify email address is correct
→ Check server logs for errors

---

## 📞 NEED HELP?

Check the full guide: `EMAIL_SETUP_GUIDE.md`

Server logs location: `logs/error.log`

Test email endpoint:
```bash
curl http://localhost:3001/api/registration/test/email
```

---

**Status**: ✅ READY TO USE  
**Setup Time**: ~5 minutes  
**Configuration Needed**: Gmail App Password only

🎉 **That's it! Your email notifications are ready!**

