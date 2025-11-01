const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { createLogger } = require('winston');
const logger = require('../config/logger');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP server is ready to take our messages');
  }
});

/**
 * Handle registration form submission
 */
exports.submitRegistration = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const {
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      address,
      currentSchool,
      grade,
      subjects = [],
      parentName,
      parentRelation,
      parentEmail,
      parentPhone,
      howDidYouHear,
      message
    } = req.body;

    // Prepare email content
    const emailHtml = `
      <h2>New Student Registration</h2>
      <p><strong>Student Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Date of Birth:</strong> ${new Date(dob).toLocaleDateString()}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Current School/College:</strong> ${currentSchool || 'Not specified'}</p>
      <p><strong>Grade/Class:</strong> ${grade}</p>
      <p><strong>Subjects Interested In:</strong> ${Array.isArray(subjects) ? subjects.join(', ') : subjects}</p>
      
      <h3>Parent/Guardian Information</h3>
      <p><strong>Name:</strong> ${parentName}</p>
      <p><strong>Relation:</strong> ${parentRelation}</p>
      <p><strong>Email:</strong> ${parentEmail || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${parentPhone}</p>
      
      <h3>Additional Information</h3>
      <p><strong>How did you hear about us?</strong> ${howDidYouHear}</p>
      <p><strong>Additional Message:</strong> ${message || 'None'}</p>
      
      <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
        This is an automated message. Please do not reply to this email.
      </p>
    `;

    // Email options
    const mailOptions = {
      from: `"Aranshi Education Hub" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Registration: ${firstName} ${lastName}`,
      html: emailHtml,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to student if email is provided
    if (email) {
      const studentMailOptions = {
        from: `"Aranshi Education Hub" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Thank You for Registering with Aranshi Education Hub',
        html: `
          <h2>Thank You for Your Registration!</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for registering with Aranshi Education Hub. We have received your application and will review it shortly.</p>
          <p>Here's a summary of your registration:</p>
          <ul>
            <li><strong>Name:</strong> ${firstName} ${lastName}</li>
            <li><strong>Grade/Class:</strong> ${grade}</li>
            <li><strong>Contact Number:</strong> ${phone}</li>
          </ul>
          <p>We will contact you soon with further details about the admission process.</p>
          <p>If you have any questions, feel free to contact us at ${process.env.CONTACT_PHONE || 'our office number'}.</p>
          <p>Best regards,<br>The Aranshi Education Hub Team</p>
          <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
            This is an automated message. Please do not reply to this email.
          </p>
        `
      };
      
      transporter.sendMail(studentMailOptions).catch(error => {
        logger.error('Error sending confirmation email:', error);
      });
    }

    // Log the registration
    logger.info(`New registration received from ${firstName} ${lastName} (${email})`);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Registration successful! We will contact you soon.',
      data: {
        student: `${firstName} ${lastName}`,
        email: email,
        phone: phone
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    next(new Error('An error occurred while processing your registration. Please try again later.'));
  }
};

/**
 * Get list of available classes/grades
 */
exports.getAvailableClasses = (req, res) => {
  const classes = [
    { value: 'nursery', label: 'Nursery' },
    { value: 'lkg', label: 'LKG' },
    { value: 'ukg', label: 'UKG' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Class ${i + 1}`
    })),
    { value: '11_science', label: 'Class 11 (Science)' },
    { value: '11_commerce', label: 'Class 11 (Commerce)' },
    { value: '11_arts', label: 'Class 11 (Arts)' },
    { value: '12_science', label: 'Class 12 (Science)' },
    { value: '12_commerce', label: 'Class 12 (Commerce)' },
    { value: '12_arts', label: 'Class 12 (Arts)' },
    { value: 'neet', label: 'NEET' },
    { value: 'jee', label: 'JEE' },
    { value: 'foundation', label: 'Foundation (8-10)' }
  ];

  res.status(200).json({
    success: true,
    data: classes
  });
};
