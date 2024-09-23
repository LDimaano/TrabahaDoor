// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,  // Enable logging
  debug: true,   // Enable debug output
  dns: { preferIPv4: true }, 
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to the email service:', error);
//   } else {
//     console.log('Email service is ready to send messages:', success);
//   }
// });

// const mailOptions = {
//   from: 'trabahadoor.sanjose@gmail.com',
//   to: 'carlafrancescadimaandal29@gmail.com',
//   subject: 'Test Email',
//   text: 'This is a test email sent using Nodemailer.',
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error sending email:', error);
//   } else {
//     console.log('Email sent successfully:', info.response);
//   }
// });


const generateEmailContent = (type, data) => {
    switch (type) {
        case 'application':
            return {
                subject: 'New Application Received',
                text: `${data.full_name} has applied for your job: ${data.job_title}`,
                html: `<p>${data.full_name} has applied for your job: <strong>${data.job_title}</strong></p>`,
            };
        case 'status_update':
            return {
                subject: 'Your Application Status Has Been Updated',
                text: `Hello ${data.jobSeekerName}, your application status for ${data.job_title} has been updated to: ${data.status}`,
                html: `<p>Hello ${data.jobSeekerName},</p>
                       <p>Your application status for <strong>${data.job_title}</strong> has been updated to: <strong>${data.status}</strong>.</p>`,
            };
        default:
            return {};
    }
};
const sendApplicationEmail = async (employerEmail, fullName, jobTitle) => {
    // Create the data object with both full_name and job_title
    const data = {
        full_name: fullName,
        job_title: jobTitle
    };

    // Generate email content
    const emailContent = generateEmailContent('application', data);

    // Send the email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};


const sendStatusUpdateEmail = async (jobSeekerEmail, jobSeekerName, jobTitle, status) => {
    // Customize the email content to include the job seeker's name and the job title
    const emailContent = generateEmailContent('status_update', { jobSeekerName, job_title: jobTitle, status });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: jobSeekerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

module.exports = {
    sendApplicationEmail,
    sendStatusUpdateEmail,
};
