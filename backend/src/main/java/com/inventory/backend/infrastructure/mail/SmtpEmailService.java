package com.inventory.backend.infrastructure.mail;

import com.inventory.backend.application.mail.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

/**
 * Infrastructure implementation of EmailService using Spring JavaMailSender (SMTP).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@inventory.com}")
    private String fromEmail;

    @Value("${app.mail.sender-name:Inventory Management}")
    private String senderName;

    @Value("${app.reset-token.expiration-minutes:15}")
    private int expirationMinutes;

    @Override
    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetUrl) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password - Inventory Management System");

            String htmlBody = buildHtmlTemplate(recipientName, resetUrl);
            String textBody = buildTextTemplate(recipientName, resetUrl);

            helper.setText(textBody, htmlBody);

            mailSender.send(mimeMessage);
            log.info("Password reset email sent to {}", maskEmail(toEmail));
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to construct/send reset email to {}: {}", maskEmail(toEmail), e.getMessage());
            throw new RuntimeException("Unable to deliver password reset email. Please try again later.", e);
        } catch (Exception e) {
            log.error("Unexpected error sending reset email to {}: {}", maskEmail(toEmail), e.getMessage());
            throw new RuntimeException("Unable to deliver password reset email. Please try again later.", e);
        }
    }

    private String buildHtmlTemplate(String name, String resetUrl) {
        String displayName = (name != null && !name.isBlank()) ? name : "User";
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #0f0f1a;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  color: #f1f5f9;
                }
                .container {
                  max-width: 560px;
                  margin: 40px auto;
                  background: #1a1a2e;
                  border: 1px solid rgba(99, 102, 241, 0.2);
                  border-radius: 16px;
                  padding: 40px 32px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 28px;
                }
                .badge {
                  display: inline-block;
                  background: linear-gradient(135deg, #6366f1, #4f46e5);
                  color: white;
                  padding: 8px 16px;
                  border-radius: 12px;
                  font-size: 14px;
                  font-weight: 700;
                  letter-spacing: 0.5px;
                }
                h1 {
                  color: #ffffff;
                  font-size: 22px;
                  font-weight: 700;
                  margin: 16px 0 8px 0;
                }
                p {
                  color: #94a3b8;
                  font-size: 15px;
                  line-height: 1.6;
                  margin: 12px 0;
                }
                .button-container {
                  text-align: center;
                  margin: 32px 0;
                }
                .btn {
                  display: inline-block;
                  background: linear-gradient(135deg, #6366f1, #4f46e5);
                  color: #ffffff !important;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 15px;
                  padding: 14px 32px;
                  border-radius: 10px;
                }
                .url-box {
                  background: #16162a;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 8px;
                  padding: 12px;
                  font-size: 12px;
                  word-break: break-all;
                  color: #818cf8;
                  margin-top: 16px;
                }
                .footer {
                  margin-top: 36px;
                  border-top: 1px solid rgba(255, 255, 255, 0.08);
                  padding-top: 20px;
                  font-size: 12px;
                  color: #64748b;
                  text-align: center;
                }
                .warning {
                  background: rgba(245, 158, 11, 0.1);
                  border-left: 3px solid #f59e0b;
                  padding: 10px 14px;
                  border-radius: 4px;
                  color: #fbbf24;
                  font-size: 13px;
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="badge">INVENTORY MANAGEMENT</div>
                  <h1>Password Reset Request</h1>
                </div>
                <p>Hello <strong>%s</strong>,</p>
                <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
                
                <div class="button-container">
                  <a href="%s" class="btn" target="_blank">Reset Password</a>
                </div>

                <div class="warning">
                  &#9888; <strong>Security Notice:</strong> This link is valid for <strong>%d minutes</strong> and can only be used once.
                </div>

                <p style="font-size: 13px;">If the button above does not work, copy and paste this link into your browser:</p>
                <div class="url-box">%s</div>

                <div class="footer">
                  <p>If you did not request this password reset, no action is needed. Your password remains safe and unchanged.</p>
                  <p>&copy; 2026 Inventory Management System. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(displayName, resetUrl, expirationMinutes, resetUrl);
    }

    private String buildTextTemplate(String name, String resetUrl) {
        String displayName = (name != null && !name.isBlank()) ? name : "User";
        return """
            Hello %s,

            We received a request to reset your password for your Inventory Management System account.

            To choose a new password, open this link in your browser:
            %s

            This link is valid for %d minutes and can only be used once.

            If you did not request a password reset, you can safely ignore this email.

            --
            Inventory Management System
            """.formatted(displayName, resetUrl, expirationMinutes);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf('@');
        String prefix = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (prefix.length() <= 2) {
            return prefix.charAt(0) + "***" + domain;
        }
        return prefix.charAt(0) + "***" + prefix.charAt(prefix.length() - 1) + domain;
    }
}
