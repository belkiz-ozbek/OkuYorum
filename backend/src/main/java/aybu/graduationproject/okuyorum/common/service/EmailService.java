package aybu.graduationproject.okuyorum.common.service;

import aybu.graduationproject.okuyorum.donation.entity.Donation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.MailException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        try {
            helper.setFrom(fromEmail, "OkuYorum Doğrulama");
        } catch (UnsupportedEncodingException e) {
            logger.warn("Encoding error while setting from address: {}", e.getMessage());
            helper.setFrom(fromEmail);
        }

        helper.setTo(toEmail);
        helper.setSubject("OkuYorum Hesap Doğrulama Kodu");
        helper.setText(String.format("""
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
        """, verificationCode), true);

        mailSender.send(message);
    }

    public void sendDonationConfirmationEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bağışınız için Teşekkürler!");
            message.setText(String.format(
                "Sayın bağışçımız,\n\n" +
                "%s kitabını bağışladığınız için teşekkür ederiz.\n" +
                "Bağışınız incelendikten sonra sizinle iletişime geçeceğiz.\n\n" +
                "Saygılarımızla,\nOkuYorum Ekibi",
                donation.getBookTitle()
            ));
            
            mailSender.send(message);
            logger.info("Bağış onay emaili gönderildi: {}", toEmail);
        } catch (MailException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
            // Email gönderimi başarısız olsa bile bağış işleminin devam etmesini sağlıyoruz
        }
    }

    public void sendInstitutionNotificationEmail(Donation donation) {
        try {
            if (donation.getInstitutionName() == null || donation.getInstitutionName().trim().isEmpty()) {
                logger.error("Kurum adı boş olamaz");
                return;
            }

            // Gerçek email adresi yerine geçici bir adres kullanıyoruz
            String institutionEmail = donation.getInstitutionName().toLowerCase()
                .replaceAll("[^a-z0-9]", "") + "@example.com";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(institutionEmail);
            message.setSubject("Yeni Kitap Bağışı!");
            message.setText(String.format(
                "Sayın Yetkili,\n\n" +
                "Kurumunuza yeni bir kitap bağışı yapıldı:\n" +
                "Kitap: %s\n" +
                "Yazar: %s\n" +
                "Adet: %d\n\n" +
                "Bağış detaylarını sistemden inceleyebilirsiniz.\n\n" +
                "Saygılarımızla,\nOkuYorum Ekibi",
                donation.getBookTitle(),
                donation.getAuthor(),
                donation.getQuantity()
            ));
            
            mailSender.send(message);
            logger.info("Kurum bilgilendirme emaili gönderildi: {}", institutionEmail);
        } catch (MailException e) {
            logger.error("Kurum emaili gönderimi sırasında hata oluştu: {}", e.getMessage());
            // Email gönderimi başarısız olsa bile bağış işleminin devam etmesini sağlıyoruz
        }
    }

    /**
     * Bağış durumu güncellendiğinde kullanıcıya bildirim gönderir
     */
    public void sendDonationStatusUpdateEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            String statusText = getStatusText(donation.getStatus());
            String statusDescription = getStatusDescription(donation.getStatus());

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bağış Durumu Güncellendi: " + statusText);
            
            StringBuilder emailContent = new StringBuilder();
            emailContent.append(String.format(
                "Sayın bağışçımız,\n\n" +
                "\"%s\" kitabı için bağışınızın durumu güncellendi.\n\n" +
                "Güncel Durum: %s\n" +
                "%s\n\n",
                donation.getBookTitle(),
                statusText,
                statusDescription
            ));
            
            // Takip bilgileri varsa ekle
            if (donation.getTrackingCode() != null && !donation.getTrackingCode().isEmpty()) {
                emailContent.append(String.format("Takip Kodu: %s\n", donation.getTrackingCode()));
            }
            
            if (donation.getDeliveryMethod() != null && !donation.getDeliveryMethod().isEmpty()) {
                emailContent.append(String.format("Teslimat Yöntemi: %s\n", donation.getDeliveryMethod()));
            }
            
            if (donation.getEstimatedDeliveryDate() != null) {
                emailContent.append(String.format("Tahmini Teslimat Tarihi: %s\n", 
                    donation.getEstimatedDeliveryDate().toLocalDate().toString()));
            }
            
            if (donation.getStatusNote() != null && !donation.getStatusNote().isEmpty()) {
                emailContent.append(String.format("\nNot: %s\n", donation.getStatusNote()));
            }
            
            emailContent.append("\nBağışınızın durumunu web sitemizden de takip edebilirsiniz.\n\n" +
                "Saygılarımızla,\nOkuYorum Ekibi");
            
            message.setText(emailContent.toString());
            
            mailSender.send(message);
            logger.info("Bağış durum güncelleme emaili gönderildi: {}", toEmail);
        } catch (MailException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }
    
    /**
     * Bağış takip bilgileri güncellendiğinde kullanıcıya bildirim gönderir
     */
    public void sendDonationTrackingUpdateEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bağış Takip Bilgileri Güncellendi");
            
            StringBuilder emailContent = new StringBuilder();
            emailContent.append(String.format(
                "Sayın bağışçımız,\n\n" +
                "\"%s\" kitabı için bağışınızın takip bilgileri güncellendi.\n\n",
                donation.getBookTitle()
            ));
            
            // Takip bilgilerini ekle
            emailContent.append("Güncel Takip Bilgileri:\n");
            
            if (donation.getTrackingCode() != null && !donation.getTrackingCode().isEmpty()) {
                emailContent.append(String.format("Takip Kodu: %s\n", donation.getTrackingCode()));
            }
            
            if (donation.getDeliveryMethod() != null && !donation.getDeliveryMethod().isEmpty()) {
                emailContent.append(String.format("Teslimat Yöntemi: %s\n", donation.getDeliveryMethod()));
            }
            
            if (donation.getEstimatedDeliveryDate() != null) {
                emailContent.append(String.format("Tahmini Teslimat Tarihi: %s\n", 
                    donation.getEstimatedDeliveryDate().toLocalDate().toString()));
            }
            
            if (donation.getHandlerName() != null && !donation.getHandlerName().isEmpty()) {
                emailContent.append(String.format("İlgilenen Görevli: %s\n", donation.getHandlerName()));
            }
            
            emailContent.append("\nBağışınızın durumunu web sitemizden de takip edebilirsiniz.\n\n" +
                "Saygılarımızla,\nOkuYorum Ekibi");
            
            message.setText(emailContent.toString());
            
            mailSender.send(message);
            logger.info("Bağış takip bilgileri güncelleme emaili gönderildi: {}", toEmail);
        } catch (MailException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }
    
    /**
     * Bağış durumuna göre metin açıklaması döndürür
     */
    private String getStatusText(aybu.graduationproject.okuyorum.donation.entity.DonationStatus status) {
        return switch (status) {
            case PENDING -> "Beklemede";
            case APPROVED -> "Onaylandı";
            case PREPARING -> "Hazırlanıyor";
            case READY_FOR_PICKUP -> "Teslim Almaya Hazır";
            case IN_TRANSIT -> "Taşınıyor";
            case DELIVERED -> "Teslim Edildi";
            case RECEIVED_BY_RECIPIENT -> "Alıcı Tarafından Alındı";
            case COMPLETED -> "Tamamlandı";
            case REJECTED -> "Reddedildi";
            case CANCELLED -> "İptal Edildi";
        };
    }
    
    /**
     * Bağış durumuna göre detaylı açıklama döndürür
     */
    private String getStatusDescription(aybu.graduationproject.okuyorum.donation.entity.DonationStatus status) {
        return switch (status) {
            case PENDING -> "Bağışınız şu anda inceleme aşamasındadır. En kısa sürede değerlendirilecektir.";
            case APPROVED -> "Bağışınız onaylandı ve işleme alındı. Kitaplarınız hazırlanmaya başlanacak.";
            case PREPARING -> "Kitaplarınız şu anda hazırlanıyor ve paketleniyor.";
            case READY_FOR_PICKUP -> "Kitaplarınız paketlendi ve teslim almaya hazır.";
            case IN_TRANSIT -> "Kitaplarınız şu anda alıcıya doğru yolda.";
            case DELIVERED -> "Kitaplarınız teslim noktasına ulaştı.";
            case RECEIVED_BY_RECIPIENT -> "Kitaplarınız alıcı tarafından teslim alındı.";
            case COMPLETED -> "Bağış süreci başarıyla tamamlandı. Katkınız için teşekkür ederiz!";
            case REJECTED -> "Bağışınız bazı nedenlerden dolayı kabul edilemedi. Detaylı bilgi için lütfen bizimle iletişime geçin.";
            case CANCELLED -> "Bağışınız iptal edildi.";
        };
    }
} 