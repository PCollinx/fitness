import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send a password reset email
 * @param to Recipient email address
 * @param resetToken The password reset token
 * @param username The user's name or email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  username: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset Your Password - MyTrainer App",
    text:
      `Hello ${username},\n\n` +
      `You requested a password reset for your MyTrainer account. Please click the link below to reset your password:\n\n` +
      `${resetUrl}\n\n` +
      `This link will expire in 1 hour.\n\n` +
      `If you didn't request this, please ignore this email and your password will remain unchanged.\n\n` +
      `Thanks,\n` +
      `The MyTrainer Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #f59e0b; text-align: center;">Reset Your Password</h2>
        <p>Hello ${username},</p>
        <p>You requested a password reset for your MyTrainer account. Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #f59e0b; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>Thanks,<br>The MyTrainer Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      </div>
    `,
  };

  try {
    // Using Nodemailer
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}

/**
 * Send a password change confirmation email
 * @param to Recipient email address
 * @param username The user's name or email
 */
export async function sendPasswordChangeConfirmationEmail(
  to: string,
  username: string
) {
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your Password Has Been Changed - MyTrainer App",
    text:
      `Hello ${username},\n\n` +
      `This is a confirmation that the password for your MyTrainer account has just been changed.\n\n` +
      `If you did not make this change, please contact our support team immediately.\n\n` +
      `Thanks,\n` +
      `The MyTrainer Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #f59e0b; text-align: center;">Password Changed</h2>
        <p>Hello ${username},</p>
        <p>This is a confirmation that the password for your MyTrainer account has just been changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Thanks,<br>The MyTrainer Team</p>
      </div>
    `,
  };

  try {
    // Using Nodemailer
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending password change confirmation email:", error);
    return { success: false, error };
  }
}
