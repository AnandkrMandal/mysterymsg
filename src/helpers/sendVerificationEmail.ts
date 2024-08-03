import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: "MS_BsRSVY@trial-0p7kx4xnxkvg9yjr.mlsender.net",
      to: email,
      subject: "Mystery Message Verification Code",
      html: `<!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }

                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .email-header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #dddddd;
                }

                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                    color: #333333;
                }

                .email-body {
                    padding: 20px 0;
                }

                .email-body p {
                    margin: 0 0 20px 0;
                    font-size: 16px;
                    color: #666666;
                }

                .verification-code {
                    display: block;
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    color: #333333;
                    margin: 20px 0;
                }

                .email-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #dddddd;
                }

                .email-footer p {
                    margin: 0;
                    font-size: 14px;
                    color: #aaaaaa;
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Email Verification</h1>
                </div>
                <div class="email-body">
                    <p>Hi ${username},</p>
                    <p>Your verification code is:</p>
                    <span class="verification-code">${verifyCode}</span>
                </div>
                <div class="email-footer">
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
            </div>
            </body>
            </html>`,
    });

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
