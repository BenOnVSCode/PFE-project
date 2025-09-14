import { Resend } from 'resend'
import { prisma } from './prisma'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name?: string) {
  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  })

  // Save new token to database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })

  // Send email
  const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`
  
  try {
    await resend.emails.send({
      from: 'Freelance App <noreply@carilya.com>',
      to: [email],
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Freelance App!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error: 'Failed to send verification email' }
  }
}

export async function verifyEmailToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    return { success: false, error: 'Invalid token' }
  }

  if (verificationToken.expires < new Date()) {
    return { success: false, error: 'Token expired' }
  }

  // Activate user
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { 
      isActive: true,
      emailVerified: new Date()
    }
  })

  // Delete used token
  await prisma.verificationToken.delete({
    where: { token }
  })

  return { success: true }
}
