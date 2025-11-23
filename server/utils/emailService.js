const nodemailer = require('nodemailer');

/**
 * Email Service for sending registration notifications
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email transporter with SMTP configuration
   */
  initialize() {
    try {
      // Create transporter using Gmail SMTP
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'hupendrad4@gmail.com',
          pass: process.env.EMAIL_PASSWORD // App-specific password
        }
      });

      this.initialized = true;
      console.log('✓ Email service initialized successfully');
    } catch (error) {
      console.error('✗ Failed to initialize email service:', error.message);
      this.initialized = false;
    }
  }

  /**
   * Verify email configuration
   */
  async verify() {
    if (!this.transporter) {
      this.initialize();
    }

    try {
      await this.transporter.verify();
      console.log('✓ Email server connection verified');
      return true;
    } catch (error) {
      console.error('✗ Email server verification failed:', error.message);
      return false;
    }
  }

  /**
   * Send registration notification email
   * @param {Object} registrationData - Registration form data
   * @returns {Promise<Object>} - Email send result
   */
  async sendRegistrationNotification(registrationData) {
    if (!this.initialized) {
      this.initialize();
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      city,
      guardianName,
      guardianPhone,
      address,
      class: studentClass,
      course,
      previousSchool,
      previousBoard,
      percentage,
      interests,
      startMonth,
      additionalInfo,
      submittedAt
    } = registrationData;

    // Create email HTML content
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #004B63 0%, #22B573 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .section { margin-bottom: 25px; }
    .section-title { color: #004B63; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #22B573; padding-bottom: 5px; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: bold; color: #004B63; display: inline-block; min-width: 150px; }
    .field-value { color: #333; }
    .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #22B573; margin: 15px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
    .badge { display: inline-block; padding: 5px 12px; background: #22B573; color: white; border-radius: 20px; font-size: 12px; margin: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 New Student Registration</h1>
      <p style="margin: 5px 0 0 0; font-size: 16px;">Aranshi Education Hub</p>
    </div>

    <div class="content">
      <div class="highlight">
        <strong>📅 Submission Time:</strong> ${new Date(submittedAt).toLocaleString('en-IN', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata'
        })}
      </div>

      <!-- Personal Information -->
      <div class="section">
        <div class="section-title">👤 Personal Information</div>
        <div class="field">
          <span class="field-label">Full Name:</span>
          <span class="field-value">${firstName} ${lastName}</span>
        </div>
        <div class="field">
          <span class="field-label">Email:</span>
          <span class="field-value">${email}</span>
        </div>
        <div class="field">
          <span class="field-label">Phone:</span>
          <span class="field-value">${phone}</span>
        </div>
        ${dob ? `<div class="field">
          <span class="field-label">Date of Birth:</span>
          <span class="field-value">${new Date(dob).toLocaleDateString('en-IN')}</span>
        </div>` : ''}
        ${gender ? `<div class="field">
          <span class="field-label">Gender:</span>
          <span class="field-value">${gender}</span>
        </div>` : ''}
        ${city ? `<div class="field">
          <span class="field-label">City:</span>
          <span class="field-value">${city}</span>
        </div>` : ''}
        ${address ? `<div class="field">
          <span class="field-label">Address:</span>
          <span class="field-value">${address}</span>
        </div>` : ''}
      </div>

      <!-- Guardian Information -->
      ${guardianName || guardianPhone ? `
      <div class="section">
        <div class="section-title">👨‍👩‍👧 Guardian Information</div>
        ${guardianName ? `<div class="field">
          <span class="field-label">Guardian Name:</span>
          <span class="field-value">${guardianName}</span>
        </div>` : ''}
        ${guardianPhone ? `<div class="field">
          <span class="field-label">Guardian Phone:</span>
          <span class="field-value">${guardianPhone}</span>
        </div>` : ''}
      </div>
      ` : ''}

      <!-- Academic Information -->
      <div class="section">
        <div class="section-title">📚 Academic Information</div>
        ${studentClass ? `<div class="field">
          <span class="field-label">Class:</span>
          <span class="field-value">${studentClass}</span>
        </div>` : ''}
        ${course ? `<div class="field">
          <span class="field-label">Course:</span>
          <span class="field-value">${course}</span>
        </div>` : ''}
        ${previousSchool ? `<div class="field">
          <span class="field-label">Previous School:</span>
          <span class="field-value">${previousSchool}</span>
        </div>` : ''}
        ${previousBoard ? `<div class="field">
          <span class="field-label">Board:</span>
          <span class="field-value">${previousBoard}</span>
        </div>` : ''}
        ${percentage ? `<div class="field">
          <span class="field-label">Previous Percentage:</span>
          <span class="field-value">${percentage}%</span>
        </div>` : ''}
        ${startMonth ? `<div class="field">
          <span class="field-label">Preferred Start Month:</span>
          <span class="field-value">${startMonth}</span>
        </div>` : ''}
      </div>

      <!-- Interests -->
      ${interests && interests.length > 0 ? `
      <div class="section">
        <div class="section-title">🎯 Interests</div>
        <div>
          ${interests.map(interest => `<span class="badge">${interest}</span>`).join(' ')}
        </div>
      </div>
      ` : ''}

      <!-- Additional Information -->
      ${additionalInfo ? `
      <div class="section">
        <div class="section-title">💬 Additional Information</div>
        <div class="field-value" style="padding: 10px; background: #f9f9f9; border-radius: 5px;">
          ${additionalInfo}
        </div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p><strong>Aranshi Education Hub</strong></p>
      <p>📞 +91 98765 43210 | ✉️ info@aranshieduhub.com</p>
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        This is an automated notification. Please respond to the student's email address for correspondence.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const emailText = `
New Student Registration - Aranshi Education Hub
================================================

Submission Time: ${new Date(submittedAt).toLocaleString('en-IN')}

PERSONAL INFORMATION
-------------------
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
${dob ? `Date of Birth: ${new Date(dob).toLocaleDateString('en-IN')}` : ''}
${gender ? `Gender: ${gender}` : ''}
${city ? `City: ${city}` : ''}
${address ? `Address: ${address}` : ''}

${guardianName || guardianPhone ? `
GUARDIAN INFORMATION
-------------------
${guardianName ? `Guardian Name: ${guardianName}` : ''}
${guardianPhone ? `Guardian Phone: ${guardianPhone}` : ''}
` : ''}

ACADEMIC INFORMATION
-------------------
${studentClass ? `Class: ${studentClass}` : ''}
${course ? `Course: ${course}` : ''}
${previousSchool ? `Previous School: ${previousSchool}` : ''}
${previousBoard ? `Board: ${previousBoard}` : ''}
${percentage ? `Previous Percentage: ${percentage}%` : ''}
${startMonth ? `Preferred Start Month: ${startMonth}` : ''}

${interests && interests.length > 0 ? `
INTERESTS
---------
${interests.join(', ')}
` : ''}

${additionalInfo ? `
ADDITIONAL INFORMATION
---------------------
${additionalInfo}
` : ''}

---
Aranshi Education Hub
Phone: +91 98765 43210
Email: info@aranshieduhub.com
    `;

    // Email options
    const mailOptions = {
      from: {
        name: 'Aranshi Education Hub - Registration System',
        address: process.env.EMAIL_USER || 'hupendrad4@gmail.com'
      },
      to: 'hupendrad4@gmail.com',
      subject: `🎓 New Registration: ${firstName} ${lastName} - ${studentClass || 'General Enquiry'}`,
      text: emailText,
      html: emailHTML,
      replyTo: email // Allow direct reply to student
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✓ Registration email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('✗ Failed to send registration email:', error);
      throw error;
    }
  }

  /**
   * Send confirmation email to student
   * @param {Object} registrationData - Registration form data
   */
  async sendStudentConfirmation(registrationData) {
    const { firstName, email } = registrationData;

    const confirmationHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #004B63 0%, #22B573 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .button { display: inline-block; padding: 12px 30px; background: #22B573; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Welcome to Aranshi Education Hub!</h1>
    </div>
    <div class="content">
      <p>Dear ${firstName},</p>
      <p>Thank you for your interest in Aranshi Education Hub! We have successfully received your registration.</p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our admissions team will review your application</li>
        <li>We'll contact you within 24-48 hours</li>
        <li>You'll receive information about courses, schedules, and fees</li>
      </ul>
      <p>If you have any immediate questions, feel free to contact us:</p>
      <p>📞 <strong>+91 98765 43210</strong><br>
      ✉️ <strong>info@aranshieduhub.com</strong></p>
      <p>We look forward to being part of your educational journey!</p>
      <p>Best regards,<br><strong>Aranshi Education Hub Team</strong></p>
    </div>
    <div class="footer">
      <p><strong>Aranshi Education Hub</strong></p>
      <p>Empowering Future Minds</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: 'Aranshi Education Hub',
        address: process.env.EMAIL_USER || 'hupendrad4@gmail.com'
      },
      to: email,
      subject: '🎓 Registration Received - Aranshi Education Hub',
      html: confirmationHTML
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✓ Confirmation email sent to student:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('✗ Failed to send confirmation email:', error);
      // Don't throw - confirmation email failure shouldn't break registration
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;

