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
    logger: true,  
  debug: true,   
  dns: { preferIPv4: true }, 
});
  

const generateEmailContent = (type, data) => {
    switch (type) {
        case 'application':
            return {
                subject: 'New Application Received for Your Job Posting',

                text: `Dear Employer,
                
                We are pleased to inform you that ${data.full_name} has applied for your job posting: ${data.job_title}.
                
                You can view more details and manage the application by logging into your employer account.
                
                Best regards,
                The Trabahadoor Team`,
                
                html: `
                <p>Dear Employer,</p>
                
                <p>We are pleased to inform you that <strong>${data.full_name}</strong> has applied for the position of <strong>${data.job_title}</strong>.</p>
                
                <p>You can view more details and manage this application by logging into your <a href="https://trabahadoor-front-end.onrender.com/login">employer account</a>.</p>
                
                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `
                
            };
        case 'status_update':
            return {
                subject: 'Your Application Status Has Been Updated',

                text: `Hello ${data.jobSeekerName},
                
                We wanted to inform you that your application status for the position of ${data.job_title} has been updated to: ${data.status}.
                
                You can log into your account to view more details.
                
                Best regards,
                The Trabahadoor Team`,
                
                html: `
                <p>Hello ${data.jobSeekerName},</p>
                
                <p>We wanted to inform you that your application status for the position of <strong>${data.job_title}</strong> has been updated to: <strong>${data.status}</strong>.</p>
                
                <p>You can log into your account to view more details by visiting your <a href="https://trabahadoor-front-end.onrender.com/login">jobseeker account</a>.</p>
                
                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `                
            };
        case 'contact_notification': 
            return {
                subject: 'An Employer Wants to Connect With You',

                text: `Hello ${data.jobSeekerName},

                We are excited to inform you that ${data.companyName} has reached out to you with the following message:

                "${data.message}"

                Please log into your account to view more details and take the next steps.

                Best regards,
                The Trabahadoor Team`,

                html: `
                <p>Hello ${data.jobSeekerName},</p>

                <p>We are excited to inform you that <strong>${data.companyName}</strong> has reached out to you with the following message:</p>
                
                <p> "${data.message}" </p>
                <p>Please log into your account to view more details by visiting your <a href="https://trabahadoor-front-end.onrender.com/login">jobseeker account</a> and take the next steps.</p>

                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `

            };
        case 'account_activation':
            return {
                subject: 'Your Account Has Been Activated',

                text: `Congratulations! Your employer account has been successfully activated.
                
                You can now log in to your account and start posting job listings to find the right candidates for your organization.
                
                If you have any questions or need assistance, feel free to reach out to us.
                
                Best regards,
                The Trabahadoor Team`,
                
                html: `
                <p>Congratulations!</p>
                
                <p>Your employer account has been successfully activated.</p>
                
                <p>You can now log in to your account and start posting job listings to find the right candidates for your organization. Visit your <a href="https://trabahadoor-front-end.onrender.com/login">employer account</a> to get started.</p>
                
                <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                
                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `
                
            };
        case 'account_rejection':
            return {
                subject: 'Your Account Has Been Rejected',

                text: `We regret to inform you that your employer account has been rejected for the following reason:
                
                "${data.reason}"
                
                If you have any questions, please contact support.
                
                Best regards,
                The Trabahadoor Team`,
                
                html: `
                <p>We regret to inform you that your employer account has been rejected for the following reason:</p>
                <blockquote>${data.reason}</blockquote>
                <p>If you have any questions, please contact support.</p>
                
                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `
                
            };
        case 'email_verification':
            return {
                subject: 'Email Verification',

                text: `Please verify your email by clicking the link below:

                ${verificationLink}
                
                Best regards,
                The Trabahadoor Team`,
                
                html: `
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>
                
                <p>Best regards,<br/>
                <strong>The Trabahadoor Team</strong></p>
                `
            }
        default:
            return {};
    }
};

const generateEmailContentVerify = (type, params) => {
    switch (type) {
      case 'email_verification':
        return {
          subject: 'Email Verification',
          text: `Please verify your email by clicking the following link: ${params.verificationLink}`,
          html: `<p>Please verify your email by clicking the following link: <a href="${params.verificationLink}">${params.verificationLink}</a></p>`,
        };
      default:
        return {};
    }
  };

const sendApplicationEmail = async (employerEmail, fullName, jobTitle) => {
    const data = {
        full_name: fullName,
        job_title: jobTitle
    };

    const emailContent = generateEmailContent('application', data);

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

const sendStatusUpdateEmail = async (jobSeekerEmail, jobSeekerName, jobTitle, status) => {
    const emailContent = generateEmailContent('status_update', { jobSeekerName, job_title: jobTitle, status });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: jobSeekerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

const sendContactNotificationEmail = async (jobSeekerEmail, jobSeekerName, companyName, message) => {
    const emailContent = generateEmailContent('contact_notification', { jobSeekerName, companyName, message });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: jobSeekerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

const sendActivationEmail = async (employerEmail) => {
    const emailContent = generateEmailContent('account_activation', {});

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

const sendRejectionEmail = async (employerEmail, reason) => {
    const emailContent = generateEmailContent('account_rejection', {reason});

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
    });
};

const sendVerificationEmail = async (email, verificationLink) => {
    const emailContent = generateEmailContentVerify('email_verification', { verificationLink });
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
};


module.exports = {
    sendApplicationEmail,
    sendStatusUpdateEmail,
    sendContactNotificationEmail,
    sendActivationEmail,
    sendRejectionEmail,
    sendVerificationEmail
};
  

