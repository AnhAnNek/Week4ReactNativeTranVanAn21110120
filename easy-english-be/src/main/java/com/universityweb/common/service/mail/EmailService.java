package com.universityweb.common.service.mail;

public interface EmailService {
    void sendHtmlContent(String toEmail, String subject, String htmlBody);
}
