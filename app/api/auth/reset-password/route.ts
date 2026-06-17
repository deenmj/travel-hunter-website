import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generate a signed reset token using HMAC
function generateResetToken(email: string): string {
  const secret = process.env.RESET_TOKEN_SECRET!
  const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour from now
  const payload = `${email}:${expiresAt}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  // Encode as base64url so it's safe in URL params
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url')
  return token
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Always respond with success to prevent email enumeration
    const successResponse = NextResponse.json({
      message: 'If an account exists with that email, a reset link has been sent.',
    })

    // Check if user exists in Supabase auth
    const supabase = createAdminClient()
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      return successResponse // Still return success to prevent enumeration
    }

    const user = users.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      // User doesn't exist — return success anyway (prevent enumeration)
      return successResponse
    }

    // Generate a reset token
    const token = generateResetToken(email)

    // Build reset URL
    const origin = request.headers.get('origin') || request.nextUrl.origin
    const resetUrl = `${origin}/admin/reset-password?token=${token}`

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Travel Hunter <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Password — Travel Hunter',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); width: 56px; height: 56px; border-radius: 14px; line-height: 56px; font-size: 28px;">
              🧭
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin-top: 16px; margin-bottom: 4px;">Travel Hunter</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Admin Panel</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; text-align: center;">
            <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password. This link expires in <strong style="color: #10b981;">1 hour</strong>.
            </p>
            
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 16px; margin-bottom: 16px;">
              Reset Password
            </a>
            
            <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          
          <p style="color: #475569; font-size: 11px; text-align: center; margin-top: 24px;">
            © ${new Date().getFullYear()} Travel Hunter. All rights reserved.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Resend email error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    return successResponse
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
