import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.password,
      },
    })
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
      })

      console.log('Email sent successfully:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async sendContactFormReply(to: string, name: string, originalMessage: string, reply: string) {
    const subject = 'Re: Your message to our portfolio'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your message, ${name}!</h2>
        <p>We've received your message and wanted to get back to you.</p>

        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Your original message:</h3>
          <p style="white-space: pre-wrap;">${originalMessage}</p>
        </div>

        <div style="background-color: #e8f4fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Our response:</h3>
          <p style="white-space: pre-wrap;">${reply}</p>
        </div>

        <p>Best regards,<br>The Portfolio Team</p>
      </div>
    `

    return this.sendEmail(to, subject, html)
  }

  async sendContactNotification(adminEmail: string, contactData: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    const subject = `New contact form submission: ${contactData.subject}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; white-space: pre-wrap;">
            ${contactData.message}
          </div>
        </div>

        <div style="margin-top: 20px;">
          <a href="mailto:${contactData.email}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply to ${contactData.name}</a>
        </div>
      </div>
    `

    return this.sendEmail(adminEmail, subject, html)
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
}

// Create email service instance
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
}

export const emailService = new EmailService(emailConfig)
