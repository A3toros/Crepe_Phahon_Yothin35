export const emailConfig = {
  // Email service configuration
  service: {
    name: 'Crepe Phahon Yothin35',
    domain: 'crepephahonyothin35.netlify.app',
    fromEmail: 'noreply@crepephahonyothin35.netlify.app',
    fromName: 'Crepe Phahon Yothin35',
  },

  // Email templates configuration
  templates: {
    confirmation: {
      subject: 'Welcome to Crepe Phahon Yothin35 - Confirm Your Email',
      expiryHours: 24,
    },
    orderConfirmation: {
      subject: 'Order Confirmation - Crepe Phahon Yothin35',
    },
    passwordReset: {
      subject: 'Reset Your Password - Crepe Phahon Yothin35',
      expiryHours: 1,
    },
  },

  // Email service endpoints
  endpoints: {
    sendEmail: '/.netlify/edge-functions/send-email',
  },

  // Brevo API configuration
  brevo: {
    apiUrl: 'https://api.brevo.com/v3/smtp/email',
    apiKey: 'BREVO_API_KEY', // Environment variable name
  },

  // Email validation
  validation: {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxSubjectLength: 100,
    maxContentLength: 10000,
  },
};

export default emailConfig;
