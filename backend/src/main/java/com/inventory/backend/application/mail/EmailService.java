package com.inventory.backend.application.mail;

/**
 * Port interface for sending application emails.
 */
public interface EmailService {

    /**
     * Sends a password reset email with a secure link.
     *
     * @param toEmail       recipient's email address
     * @param recipientName recipient's full name or username
     * @param resetUrl      complete frontend reset URL including the secure token
     */
    void sendPasswordResetEmail(String toEmail, String recipientName, String resetUrl);
}
