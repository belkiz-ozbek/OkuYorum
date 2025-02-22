package aybu.graduationproject.okuyorum.signup.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String verificationCode) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            try {
                helper.setFrom(fromEmail, "OkuYorum Doğrulama");
            } catch (UnsupportedEncodingException e) {
                log.error("Encoding error while setting from address: {}", e.getMessage());
                helper.setFrom(fromEmail); // Fallback to simple from address
            }

            helper.setTo(toEmail);
            helper.setSubject("OkuYorum Hesap Doğrulama Kodu");

            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4A5568; margin: 0;">OkuYorum</h1>
                        <p style="color: #718096; margin-top: 5px;">Kitapseverler Topluluğu</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #2D3748; margin-bottom: 20px;">Hoş Geldiniz!</h2>
                        <p style="color: #4A5568; margin-bottom: 20px;">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
                        <div style="background-color: #EDF2F7; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
                            <h2 style="color: #2D3748; letter-spacing: 5px; margin: 0; font-size: 32px;">%s</h2>
                        </div>
                        <p style="color: #718096; font-size: 14px;">Bu kod 10 dakika süreyle geçerlidir.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #A0AEC0; font-size: 12px;">
                            Bu e-posta OkuYorum hesabınızı doğrulamak için gönderilmiştir.<br>
                            Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                        </p>
                    </div>
                </div>
            """, verificationCode);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            
            log.info("Verification email sent successfully to: {} with code: {}", toEmail, verificationCode);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}. Error: {}", toEmail, e.getMessage());
            throw e;
        }
    }
} 